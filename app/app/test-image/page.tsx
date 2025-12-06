'use client';

import { useState } from 'react';

export default function TestImagePage() {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if ComfyUI is connected
  const checkConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/generate-image');
      const data = await res.json();
      setStatus(data.status === 'online' ? '✅ Connected to ComfyUI!' : '❌ Not connected');
    } catch (err) {
      setStatus('❌ Error checking connection');
      setError(String(err));
    }
    setLoading(false);
  };

  // Generate a test image
  const generateTestImage = async () => {
    setLoading(true);
    setError(null);
    setImageUrl(null);
    setStatus('🎨 Generating image... (wait ~10-30 seconds)');

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Using Realistic Vision V6.0 settings
          imageRequest: {
            id: 'test-' + Date.now(),
            type: 'scene',
            prompt: 'RAW photo, a beautiful sunset over Singapore skyline, orange sky, city lights, high quality, 8k uhd, dslr, sharp focus, professional photography, photorealistic',
            negativePrompt: 'worst quality, low quality, blurry, text, watermark, deformed, disfigured',
            width: 512,
            height: 512,
            settings: {
              model: 'realisticVisionV60B1',
              sampler: 'DPM++ 2M Karras',
              steps: 25,
              cfgScale: 7,
            },
            metadata: { test: true },
          },
          saveToPublic: false,
        }),
      });

      const data = await res.json();
      console.log('API Response:', data);

      if (data.success && data.imageUrl) {
        setImageUrl(data.imageUrl);
        setStatus(`✅ Image generated in ${Math.round(data.generationTime / 1000)}s!`);
      } else {
        setStatus('❌ Generation failed');
        setError(JSON.stringify(data, null, 2));
      }
    } catch (err) {
      setStatus('❌ Error generating image');
      setError(String(err));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🎨 Image Generation Test</h1>

        {/* Status */}
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <p className="text-lg">{status || 'Click "Check Connection" to start'}</p>
          {error && (
            <p className="text-red-400 mt-2 text-sm">{error}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={checkConnection}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-bold transition-colors"
          >
            {loading ? '...' : '1️⃣ Check Connection'}
          </button>

          <button
            onClick={generateTestImage}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-bold transition-colors"
          >
            {loading ? '⏳ Generating...' : '2️⃣ Generate Test Image'}
          </button>
        </div>

        {/* Generated Image */}
        {imageUrl && (
          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Generated Image:</h2>
            <img
              src={imageUrl}
              alt="Generated test image"
              className="w-full rounded-lg border border-gray-700"
            />
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-gray-800 p-4 rounded-lg text-sm text-gray-400">
          <h3 className="font-bold text-white mb-2">How it works:</h3>
          <ol className="list-decimal list-inside space-y-1">
            <li>Make sure Stability Matrix has ComfyUI running</li>
            <li>Click "Check Connection" to verify</li>
            <li>Click "Generate Test Image" to create an image</li>
            <li>Wait 30-60 seconds for the image to appear</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
