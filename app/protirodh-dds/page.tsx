'use client';

import React, { useState, useEffect } from 'react';
import * as ort from 'onnxruntime-web';

interface ModelMetadata {
  input_shape: number[];
  disease_classes: string[];
  symptom_names: string[];
  feature_engineering: {
    symptom_domains: {
      Respiratory_Symptoms: string[];
      Gastrointestinal_Symptoms: string[];
      Systemic_Symptoms: string[];
      Neurological_Sensory_Symptoms: string[];
    };
    disease_specific_scores: {
      COVID_Specific_Score: string[];
      Typhoid_Specific_Score: string[];
      Pneumonia_Specific_Score: string[];
    };
    interaction_features: {
      Fever_Respiratory_Interaction: string[];
      Fever_Gastro_Interaction: string[];
      Respiratory_Chest_Interaction: string[];
    };
    calculated_features: {
      Total_Symptoms: string;
      Symptom_Pattern_Diversity: string;
    };
  };
  scaler_mean?: number[];
  scaler_std?: number[];
}

interface FeatureObject {
  [key: string]: number;
}

interface Prediction {
  disease: string;
  confidence: number;
}

export default function ProtirodhDiseaseDetection() {
  // Symptoms in English (as they appear in the model)
  const symptoms: string[] = [
    'fever', 'cough', 'shortness_of_breath', 'fatigue', 'body_aches',
    'loss_of_taste', 'loss_of_smell', 'sore_throat', 'headache', 'chills',
    'nausea', 'vomiting', 'diarrhea', 'abdominal_pain', 'chest_pain',
    'confusion', 'bluish_lips', 'swollen_lymph_nodes', 'rash', 'constipation'
  ];

  // Bangla translations
  const symptomTranslations: { [key: string]: string } = {
    fever: 'জ্বর',
    cough: 'কাশি',
    shortness_of_breath: 'শ্বাসকষ্ট',
    fatigue: 'ক্লান্তি',
    body_aches: 'শরীরে ব্যথা',
    loss_of_taste: 'স্বাদ হারানো',
    loss_of_smell: 'গন্ধ হারানো',
    sore_throat: 'গলা ব্যথা',
    headache: 'মাথাব্যথা',
    chills: 'ঠাণ্ডা লাগা',
    nausea: 'বমি বমি ভাব',
    vomiting: 'বমি',
    diarrhea: 'ডায়রিয়া',
    abdominal_pain: 'পেটে ব্যথা',
    chest_pain: 'বুকে ব্যথা',
    confusion: 'কনফিউশন',
    bluish_lips: 'নীলচে ঠোঁট',
    swollen_lymph_nodes: 'গলা ফুলে যাওয়া',
    rash: 'চুলকানি',
    constipation: 'কোষ্ঠকাঠিন্য'
  };

  const diseaseTranslations: { [key: string]: string } = {
    hasCovid: 'কোভিড-১৯',
    hasTyphoid: 'টাইফয়েড',
    hasPneumonia: 'নিউমোনিয়া',
    nan: 'কোন রোগ নেই'
  };

  const [selectedSymptoms, setSelectedSymptoms] = useState<FeatureObject>({});
  const [predictions, setPredictions] = useState<Prediction[] | null>(null);
  const [metadata, setMetadata] = useState<ModelMetadata | null>(null);
  const [session, setSession] = useState<ort.InferenceSession | null>(null);
  const [loadingModel, setLoadingModel] = useState<boolean>(true);
  const [loadingPredict, setLoadingPredict] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load model + metadata once
  useEffect(() => {
    async function init() {
      try {
        // Configure wasm path if needed
        ort.env.wasm.wasmPaths = '/onnxruntime-web/';
        ort.env.wasm.numThreads = 1;

        const session = await ort.InferenceSession.create('/model/disease_predictor.onnx');
        const metadataResp = await fetch('/model/disease_model_metadata.json');
        const metadata: ModelMetadata = await metadataResp.json();

        setSession(session);
        setMetadata(metadata);
        setLoadingModel(false);
      } catch (err) {
        console.error('Model load error:', err);
        setError('Failed to load disease detection model');
        setLoadingModel(false);
      }
    }

    init();
  }, []);

  const handleSymptomToggle = (symptom: string): void => {
    setSelectedSymptoms(prev => ({
      ...prev,
      [symptom]: prev[symptom] === 1 ? 0 : 1
    }));
  };

  const applyFeatureEngineering = (inputFeatures: number[], originalFeatures: string[]): number[] => {
    const featureObj: FeatureObject = {};
    originalFeatures.forEach((feature, idx) => { 
      featureObj[feature] = inputFeatures[idx]; 
    });

    // Calculate domain aggregates
    const respiratorySymptoms = ['cough', 'shortness_of_breath', 'sore_throat', 'chest_pain', 'bluish_lips']
      .reduce((sum, s) => sum + (featureObj[s] || 0), 0);
    
    const gastrointestinalSymptoms = ['nausea', 'vomiting', 'diarrhea', 'abdominal_pain', 'constipation']
      .reduce((sum, s) => sum + (featureObj[s] || 0), 0);
    
    const systemicSymptoms = ['fever', 'fatigue', 'body_aches', 'headache', 'chills']
      .reduce((sum, s) => sum + (featureObj[s] || 0), 0);
    
    const neurologicalSensorySymptoms = ['loss_of_taste', 'loss_of_smell', 'confusion']
      .reduce((sum, s) => sum + (featureObj[s] || 0), 0);

    // Disease-specific scores
    const covidSpecificScore = ['loss_of_taste', 'loss_of_smell', 'cough', 'fever']
      .reduce((sum, s) => sum + (featureObj[s] || 0), 0);
    
    const typhoidSpecificScore = ['abdominal_pain', 'fever', 'headache', 'rash']
      .reduce((sum, s) => sum + (featureObj[s] || 0), 0);
    
    const pneumoniaSpecificScore = ['chest_pain', 'shortness_of_breath', 'cough', 'fever']
      .reduce((sum, s) => sum + (featureObj[s] || 0), 0);

    // Interaction features
    const feverRespiratoryInteraction = (featureObj['fever'] || 0) * (featureObj['cough'] || 0);
    const feverGastroInteraction = (featureObj['fever'] || 0) * (featureObj['abdominal_pain'] || 0);
    const respiratoryChestInteraction = (featureObj['cough'] || 0) * (featureObj['chest_pain'] || 0);

    // Total symptoms and variance
    const totalSymptoms = inputFeatures.reduce((sum, v) => sum + v, 0);
    const mean = totalSymptoms / inputFeatures.length;
    const variance = inputFeatures.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / inputFeatures.length;

    // Combine all features (20 original + 12 engineered = 32 total)
    const engineered: number[] = [
      // Original 20 symptoms
      ...inputFeatures,
      
      // Engineered features
      respiratorySymptoms,
      gastrointestinalSymptoms,
      systemicSymptoms,
      neurologicalSensorySymptoms,
      covidSpecificScore,
      typhoidSpecificScore,
      pneumoniaSpecificScore,
      feverRespiratoryInteraction,
      feverGastroInteraction,
      respiratoryChestInteraction,
      totalSymptoms,
      variance
    ];

    return engineered;
  };

  const manualScaleFeatures = (features: number[]): number[] => {
    // Simple standardization: (x - mean) / std
    const mean = features.reduce((sum, v) => sum + v, 0) / features.length;
    const variance = features.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / features.length;
    const std = Math.sqrt(variance) || 1;
    
    return features.map(v => {
      const scaled = (v - mean) / std;
      return isNaN(scaled) || !isFinite(scaled) ? 0 : scaled;
    });
  };

  const handlePredict = async (): Promise<void> => {
    if (!session || !metadata) {
      setError('Model not ready');
      return;
    }

    setLoadingPredict(true);
    setError(null);
    setPredictions(null);

    try {
      // Get features in correct order
      const features = symptoms.map(symptom => selectedSymptoms[symptom] === 1 ? 1 : 0);
      
      if (features.length !== metadata.symptom_names.length) {
        throw new Error('Symptom vector length mismatch');
      }

      // Apply feature engineering
      const engineered = applyFeatureEngineering(features, metadata.symptom_names);
      
      // Scale features
      const scaled = manualScaleFeatures(engineered);

      // Create input tensor
      const inputTensor = new ort.Tensor('float32', Float32Array.from(scaled), [1, scaled.length]);
      const feeds: Record<string, ort.Tensor> = {};
      feeds[session.inputNames[0]] = inputTensor;

      // Run inference
      const results = await session.run(feeds);
      const probabilities = results['probabilities'].data as Float32Array;
      const probsArray = Array.from(probabilities);

      // Process predictions
      const rawPreds: Prediction[] = probsArray.map((conf, idx) => ({
        disease: metadata.disease_classes[idx],
        confidence: Math.max(0, Math.min(1, conf))
      })).filter(p => p.confidence > 0.01)
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 4); // Show all 4 disease classes

      // Normalize confidence scores to sum to 1
      const totalConf = rawPreds.reduce((sum, p) => sum + p.confidence, 0);
      const normalized = rawPreds.map(p => ({ 
        disease: p.disease, 
        confidence: parseFloat((p.confidence / (totalConf || 1)).toFixed(4)) 
      }));

      setPredictions(normalized);
    } catch (err) {
      console.error('Prediction error', err);
      setError((err as Error).message || 'Disease prediction failed');
    } finally {
      setLoadingPredict(false);
    }
  };

  const getSelectedCount = (): number => Object.values(selectedSymptoms).filter(v => v === 1).length;

  const resetForm = (): void => {
    setSelectedSymptoms({});
    setPredictions(null);
    setError(null);
  };

  if (loadingModel) {
    return (
      <>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
        
        <div className="min-h-screen bg-gradient-to-br from-white to-green-50 flex flex-col items-center justify-center gap-5">
          <div className="w-10 h-10 border-4 border-green-200 border-t-green-500 rounded-full" 
               style={{ animation: 'spin 1s linear infinite' }} />
          <div className="flex flex-col items-center gap-2">
            <h2 className="m-0 text-2xl font-bold text-gray-900">Protirodh Disease Detection</h2>
            <p className="m-0 text-gray-600 text-sm">
              Loading AI model for disease detection...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="bg-green-500 rounded-lg p-2 mr-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Protirodh</h1>
                <p className="text-green-600 font-medium">Disease Detection System</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">AI-Powered Medical Assistant</p>
              <p className="text-xs text-gray-500">Consult a doctor for accurate diagnosis</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Warning Banner */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Important:</strong> This AI model can make mistakes. This tool is for preliminary assessment only. Please consult with a qualified healthcare professional for accurate diagnosis and treatment.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Symptoms Selection Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              আপনার লক্ষণগুলো নির্বাচন করুন
            </h2>
            
            <div className="flex justify-between items-center mb-5">
              <p className="text-gray-600">
                {getSelectedCount()}টি লক্ষণ নির্বাচন করা হয়েছে
              </p>
              <button
                onClick={resetForm}
                className="px-4 py-2 border border-gray-400 bg-white text-gray-600 cursor-pointer rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                সব পরিষ্কার করুন
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-2">
              {symptoms.map(symptom => (
                <div
                  key={symptom}
                  onClick={() => handleSymptomToggle(symptom)}
                  className={`p-3 border-2 bg-white cursor-pointer rounded-lg transition-all duration-200 flex items-center gap-3 ${
                    selectedSymptoms[symptom] 
                      ? 'border-green-500 bg-green-50 text-green-700' 
                      : 'border-gray-300 text-gray-700 hover:border-green-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                    selectedSymptoms[symptom] 
                      ? 'border-green-500 bg-green-500' 
                      : 'border-gray-400 bg-white'
                  }`}>
                    {selectedSymptoms[symptom] && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className="font-medium text-sm">
                    {symptomTranslations[symptom]}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={handlePredict}
                disabled={loadingPredict || getSelectedCount() === 0}
                className={`flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center ${
                  loadingPredict || getSelectedCount() === 0 
                    ? 'cursor-not-allowed' 
                    : 'cursor-pointer'
                }`}
              >
                {loadingPredict ? (
                  <>
                    <div className="w-5 h-5 border-2 border-transparent border-t-white rounded-full mr-2"
                         style={{ animation: 'spin 1s linear infinite' }} />
                    রোগ শনাক্ত করা হচ্ছে...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    রোগ শনাক্ত করুন
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              রোগ শনাক্তকরণ ফলাফল
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {predictions ? (
              <div className="space-y-6">
                {/* Main Prediction */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">শনাক্তকৃত রোগ</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-900">
                      {diseaseTranslations[predictions[0].disease]}
                    </span>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-700">
                        {(predictions[0].confidence * 100).toFixed(1)}% আত্মবিশ্বাস
                      </div>
                      <div className="text-sm text-green-600">মডেলের আত্মবিশ্বাসের স্তর</div>
                    </div>
                  </div>
                </div>

                {/* All Predictions */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">সমস্ত রোগের সম্ভাবনা</h4>
                  <div className="space-y-4">
                    {predictions.map((pred, index) => (
                      <div key={pred.disease} className="flex items-center justify-between">
                        <span className={`font-medium ${
                          index === 0 ? 'text-green-700' : 'text-gray-700'
                        }`}>
                          {diseaseTranslations[pred.disease]}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${
                                index === 0 ? 'bg-green-500' : 'bg-green-400'
                              }`}
                              style={{ width: `${pred.confidence * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-12">
                            {(pred.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Medical Disclaimer */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex">
                    <svg className="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm text-blue-700">
                        <strong>ডাক্তারের পরামর্শ নিন:</strong> এই ফলাফল শুধুমাত্র প্রাথমিক মূল্যায়নের জন্য। সঠিক রোগ নির্ণয় এবং চিকিৎসার জন্য একজন যোগ্য ডাক্তারের সাথে পরামর্শ করুন।
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 text-lg">আপনার লক্ষণগুলো নির্বাচন করুন এবং রোগ শনাক্তকরণ বাটনে ক্লিক করুন</p>
                <p className="text-gray-400 mt-2">AI মডেল আপনার লক্ষণগুলোর ভিত্তিতে সম্ভাব্য রোগ শনাক্ত করবে</p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-6 border border-green-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">গুরুত্বপূর্ণ তথ্য</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start">
              <div className="bg-green-100 rounded-lg p-3 mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">AI মডেল</h4>
                <p className="text-gray-600 text-sm">এই সিস্টেমটি মেশিন লার্নিং মডেল ব্যবহার করে রোগ শনাক্ত করে</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-green-100 rounded-lg p-3 mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">গোপনীয়তা</h4>
                <p className="text-gray-600 text-sm">আপনার ডেটা নিরাপদে সংরক্ষণ করা হয় এবং গোপন রাখা হয়</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-green-100 rounded-lg p-3 mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">ডাক্তারের পরামর্শ</h4>
                <p className="text-gray-600 text-sm">সর্বদা একজন যোগ্য ডাক্তারের পরামর্শ নিন</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-green-100 mt-12">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-green-500 rounded-lg p-2 mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">Protirodh</p>
                <p className="text-sm text-gray-600">Disease Detection System</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-500">
                &copy; 2024 Protirodh. This is an AI-based tool for preliminary assessment.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Always consult with healthcare professionals for medical diagnosis.
              </p>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}