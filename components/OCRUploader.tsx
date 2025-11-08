'use client';

import { useRef, useState } from 'react';
import Tesseract from 'tesseract.js';

interface OCRResult {
    text: string;
    confidence: number;
}

export default function OCRCamera() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [result, setResult] = useState<OCRResult | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [processingStatus, setProcessingStatus] = useState('');

    const startCamera = async () => {
        try {
            setError('');

            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }

            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                },
                audio: false,
            });

            streamRef.current = mediaStream;

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;

                setTimeout(async () => {
                    try {
                        if (videoRef.current) {
                            await videoRef.current.play();
                            setIsCameraOpen(true);
                        }
                    } catch (playErr) {
                        setError('Could not start video playback');
                    }
                }, 100);
            }
        } catch (err) {
            const e = err as Error;
            if (e.name === 'NotAllowedError') {
                setError('Camera permission denied');
            } else if (e.name === 'NotFoundError') {
                setError('No camera found');
            } else {
                setError('Camera error: ' + e.message);
            }
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsCameraOpen(false);
    };

    const captureAndProcess = async () => {
        if (!videoRef.current || !canvasRef.current || !isCameraOpen) {
            setError('Camera not ready at thsis moment. Please try again.');
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (!ctx || video.videoWidth === 0) {
            setError('Video not ready. Please wait and try again.');
            return;
        }

        setResult(null);
        setError('');
        setIsProcessing(true);

        try {
            // Capture high-quality image
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Apply image preprocessing for better OCR
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Increase contrast
            for (let i = 0; i < data.length; i += 4) {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                const contrast = 1.5;
                data[i] = data[i + 1] = data[i + 2] = ((avg - 128) * contrast + 128);
            }
            ctx.putImageData(imageData, 0, 0);

            const processedImage = canvas.toDataURL('image/jpeg', 0.98);

            // Extract English text with optimized settings
            setProcessingStatus('Extracting English text...');
            const ocrResult = await Tesseract.recognize(processedImage, 'eng', {
                logger: m => {
                    if (m.status === 'recognizing text') {
                        setProcessingStatus(`Processing: ${Math.round(m.progress * 100)}%`);
                    }
                },
                tessedit_pageseg_mode: Tesseract.PSM.AUTO,
                tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,!?@#$%&*()-+=:;"\'/\\[]{}',
            });

            const extractedText = ocrResult.data.text.trim();

            if (extractedText && extractedText.length > 0) {
                setResult({
                    text: extractedText,
                    confidence: Math.round(ocrResult.data.confidence)
                });
                setProcessingStatus('Complete!');
            } else {
                setError('No text detected. Please ensure the image has clear, readable text.');
            }

        } catch (err: any) {
            setError('Text extraction failed: ' + err.message);
        } finally {
            setIsProcessing(false);
            setTimeout(() => setProcessingStatus(''), 2000);
        }
    };

    const copyToClipboard = () => {
        if (result?.text) {
            navigator.clipboard.writeText(result.text);
            alert('Text copied to clipboard!');
        }
    };

    const clearResults = () => {
        setResult(null);
        setError('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
            <div className="max-w-5xl mx-auto space-y-5">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold text-gray-800">
                        📸 English Text Scanner
                    </h1>
                    <p className="text-gray-600">Capture and extract English text from images</p>
                </div>

                {/* Camera Controls */}
                <div className="flex justify-center gap-3">
                    {!isCameraOpen ? (
                        <button
                            onClick={startCamera}
                            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg"
                        >
                            📷 Open Camera
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={stopCamera}
                                className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition shadow-lg"
                            >
                                ⛔ Close Camera
                            </button>
                            <button
                                onClick={captureAndProcess}
                                disabled={isProcessing}
                                className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? '⏳ Processing...' : '✨ Capture & Extract'}
                            </button>
                        </>
                    )}
                </div>

                {/* Processing Status */}
                {processingStatus && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                        <p className="text-blue-700 font-medium text-center">{processingStatus}</p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                )}

                {/* Camera Preview */}
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-auto"
                        style={{
                            maxHeight: '500px',
                            display: isCameraOpen ? 'block' : 'none',
                            backgroundColor: '#000'
                        }}
                    />
                    {!isCameraOpen && (
                        <div className="h-64 flex items-center justify-center bg-gray-100">
                            <div className="text-center">
                                <div className="text-6xl mb-3">📷</div>
                                <p className="text-gray-500 text-lg">Open camera to start scanning</p>
                            </div>
                        </div>
                    )}
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                </div>

                {/* Result tag*/}
                {result && (
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800">📝 Extracted Text</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Confidence: {result.confidence}%
                                        <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${result.confidence >= 80 ? 'bg-green-100 text-green-700' :
                                            result.confidence >= 60 ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {result.confidence >= 80 ? 'High Accuracy' :
                                                result.confidence >= 60 ? 'Medium Accuracy' : 'Low Accuracy'}
                                        </span>
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={copyToClipboard}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                                    >
                                        📋 Copy
                                    </button>
                                    <button
                                        onClick={clearResults}
                                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm"
                                    >
                                        🗑️ Clear
                                    </button>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-base">
                                    {result.text}
                                </p>
                            </div>
                            <div className="mt-3 text-sm text-gray-500">
                                📊 Characters: {result.text.length} | Words: {result.text.split(/\s+/).filter(w => w).length}
                            </div>
                        </div>
                    </div>
                )}

                {/* Tips */}
                {isCameraOpen && !isProcessing && !result && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                        <h4 className="font-bold text-yellow-800 mb-2">💡 Tips for better accuracy:</h4>
                        <ul className="text-yellow-700 text-sm space-y-1 list-disc list-inside">
                            <li>Use bright, even lighting - avoid shadows</li>
                            <li>Hold camera steady and ensure text is in focus</li>
                            <li>Keep text horizontal and fill most of the frame</li>
                            <li>Use high contrast documents (dark text on light background)</li>
                            <li>Avoid glare, reflections, or blurry images</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}