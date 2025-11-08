'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import jsQR from 'jsqr';

interface QRScannerProps {
    onScanComplete?: (url: string) => void;
}

interface QRCodeLocation {
    topLeftCorner: { x: number; y: number };
    topRightCorner: { x: number; y: number };
    bottomRightCorner: { x: number; y: number };
    bottomLeftCorner: { x: number; y: number };
}

export default function QRScanner({ onScanComplete }: QRScannerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState<string>('');
    const [lastScannedUrl, setLastScannedUrl] = useState<string>('');
    const streamRef = useRef<MediaStream | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const isScanningRef = useRef(false);

    const isValidUrl = (string: string): boolean => {
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
            return false;
        }
    };

    const drawQRCodeBounds = (context: CanvasRenderingContext2D, location: QRCodeLocation) => {
        context.strokeStyle = '#00FF00';
        context.lineWidth = 4;
        context.beginPath();
        context.moveTo(location.topLeftCorner.x, location.topLeftCorner.y);
        context.lineTo(location.topRightCorner.x, location.topRightCorner.y);
        context.lineTo(location.bottomRightCorner.x, location.bottomRightCorner.y);
        context.lineTo(location.bottomLeftCorner.x, location.bottomLeftCorner.y);
        context.closePath();
        context.stroke();
    };

    const stopScanner = useCallback(() => {
        isScanningRef.current = false;

        // Stop scanning loop
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }

        // Stop camera stream
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        // Clear video element
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        setIsScanning(false);
    }, []);

    const scanFrame = useCallback(() => {
        if (!videoRef.current || !canvasRef.current || !isScanningRef.current) {
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) {
            animationFrameRef.current = requestAnimationFrame(scanFrame);
            return;
        }

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Get image data for QR scanning
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });

        if (code && code.data) {
            // QR Code detected!
            const scannedUrl = code.data;

            // Validate if it's a URL
            if (isValidUrl(scannedUrl)) {
                setLastScannedUrl(scannedUrl);

                // Draw bounding box around QR code
                drawQRCodeBounds(context, code.location);

                // Stop scanner and call callback
                isScanningRef.current = false;

                setTimeout(() => {
                    stopScanner();
                    if (onScanComplete) {
                        onScanComplete(scannedUrl);
                    }
                }, 500);

                return; // Stop further scanning
            }
        }

        // Continue scanning
        if (isScanningRef.current) {
            animationFrameRef.current = requestAnimationFrame(scanFrame);
        }
    }, [onScanComplete, stopScanner]);

    const startScanner = useCallback(async () => {
        try {
            setError('');
            setLastScannedUrl('');

            // Stop any existing stream first
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }

            // Request camera access
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });

            streamRef.current = mediaStream;

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;

                // Wait for video to load
                await new Promise<void>((resolve, reject) => {
                    if (!videoRef.current) {
                        reject(new Error('Video element not found'));
                        return;
                    }

                    const video = videoRef.current;

                    const onLoaded = () => {
                        video.removeEventListener('loadedmetadata', onLoaded);
                        video.removeEventListener('error', onError);
                        resolve();
                    };

                    const onError = () => {
                        video.removeEventListener('loadedmetadata', onLoaded);
                        video.removeEventListener('error', onError);
                        reject(new Error('Video error'));
                    };

                    video.addEventListener('loadedmetadata', onLoaded);
                    video.addEventListener('error', onError);

                    // Fallback timeout
                    setTimeout(() => {
                        if (video.readyState >= 2) {
                            video.removeEventListener('loadedmetadata', onLoaded);
                            video.removeEventListener('error', onError);
                            resolve();
                        }
                    }, 1000);
                });

                await videoRef.current.play();
                setIsScanning(true);
                isScanningRef.current = true;

                // Start scanning loop
                scanFrame();
            }
        } catch (err) {
            const error = err as Error;
            console.error('Scanner error:', error);

            if (error.name === 'NotAllowedError') {
                setError('Camera access denied. Please allow camera permissions.');
            } else if (error.name === 'NotFoundError') {
                setError('No camera found on this device.');
            } else if (error.name === 'NotSupportedError') {
                setError('Camera not supported in this browser.');
            } else {
                setError('Failed to access camera: ' + error.message);
            }
        }
    }, [scanFrame]);

    // Clean up on unmount
    useEffect(() => {
        return () => {
            isScanningRef.current = false;
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const handleManualRedirect = () => {
        if (lastScannedUrl && onScanComplete) {
            onScanComplete(lastScannedUrl);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold text-center text-gray-800">
                QR Code Scanner
            </h1>

            {/* Scanner Controls */}
            <div className="flex gap-4 justify-center">
                {!isScanning ? (
                    <button
                        onClick={startScanner}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Start Scanning
                    </button>
                ) : (
                    <button
                        onClick={stopScanner}
                        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                        Stop Scanning
                    </button>
                )}
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
                    {error}
                </div>
            )}

            {/* Scanner Preview */}
            <div className="relative bg-black rounded-lg overflow-hidden mx-auto max-w-lg">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-auto aspect-video object-cover"
                />
                <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                />

                {/* Scanner Overlay */}
                {isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="border-2 border-green-400 rounded-lg w-64 h-64 relative">
                            {/* Corner borders */}
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-400 rounded-tl"></div>
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-400 rounded-tr"></div>
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-400 rounded-bl"></div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-400 rounded-br"></div>

                            {/* Scanning animation */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-green-400 animate-pulse"></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Instructions */}
            {isScanning && (
                <div className="text-center text-white bg-blue-600 p-4 rounded-lg">
                    <p className="font-medium">Point your camera at a QR code</p>
                    <p className="text-sm opacity-90">The scanner will automatically detect QR codes</p>
                </div>
            )}

            {/* Last Scanned Result */}
            {lastScannedUrl && !isScanning && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2">QR Code Detected!</h3>
                    <p className="text-sm text-green-700 break-all mb-3">{lastScannedUrl}</p>
                    <div className="flex gap-3">
                        <button
                            onClick={handleManualRedirect}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                        >
                            Go to Website
                        </button>
                        <button
                            onClick={() => {
                                setLastScannedUrl('');
                                startScanner();
                            }}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
                        >
                            Scan Another
                        </button>
                    </div>
                </div>
            )}

            {/* Scanner Status */}
            <div className="text-center text-gray-600">
                {isScanning ? (
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Scanning for QR codes...</span>
                    </div>
                ) : (
                    <p>Click "Start Scanning" to begin</p>
                )}
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white mx-auto mb-2">
                        📱
                    </div>
                    <h3 className="font-semibold text-blue-800">Mobile Friendly</h3>
                    <p className="text-sm text-blue-600">Works on all devices</p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white mx-auto mb-2">
                        ⚡
                    </div>
                    <h3 className="font-semibold text-green-800">Fast Scanning</h3>
                    <p className="text-sm text-green-600">Instant detection</p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white mx-auto mb-2">
                        🔒
                    </div>
                    <h3 className="font-semibold text-purple-800">Secure</h3>
                    <p className="text-sm text-purple-600">No data stored</p>
                </div>
            </div>
        </div>
    );
}