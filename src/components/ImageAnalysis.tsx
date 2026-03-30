import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';
import { analyzeImage } from '../lib/gemini';
import Markdown from 'react-markdown';

export default function ImageAnalysis() {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setIsLoading(true);
    try {
      const base64Data = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1];
      const result = await analyzeImage(
        "Analyze this image. If it contains mathematical equations or number theory concepts, explain them. If it's something else, describe it and try to find a mathematical connection if possible.",
        base64Data,
        mimeType
      );
      setAnalysis(result || "Could not analyze image.");
    } catch (error) {
      console.error(error);
      setAnalysis("Error analyzing image.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-black rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg">
          <ImageIcon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-black dark:text-white">Visual Math Analyzer</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Upload a photo of a problem, a pattern, or anything mathematical.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative aspect-video bg-zinc-50 dark:bg-black rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center overflow-hidden group">
            {image ? (
              <>
                <img src={image} alt="Uploaded" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label className="cursor-pointer bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
                    Change Image
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>
              </>
            ) : (
              <label className="cursor-pointer flex flex-col items-center gap-2 text-zinc-400 dark:text-zinc-600 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                <Upload className="w-10 h-10" />
                <span className="font-medium">Click to upload image</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            )}
          </div>
          
          <button
            onClick={handleAnalyze}
            disabled={!image || isLoading}
            className="w-full py-3 bg-indigo-600 dark:bg-indigo-700 text-white rounded-xl font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Analyze with Gemini
              </>
            )}
          </button>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-950 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 min-h-[300px]">
          <h4 className="text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-4">Analysis Result</h4>
          {analysis ? (
            <div className="prose prose-sm prose-indigo dark:prose-invert max-w-none">
              <Markdown>{analysis}</Markdown>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-zinc-400 dark:text-zinc-600 text-center">
              <Sparkles className="w-8 h-8 mb-2 opacity-20" />
              <p>Upload and analyze an image to see the AI's insights here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
