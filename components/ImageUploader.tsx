import React, { useState, useCallback } from 'react';
import { ManualData } from '../types';
import { UploadCloudIcon, CheckCircleIcon } from './icons';

interface ImageUploaderProps {
  onAnalyze: (dataType: 'image', data: string, goal: string, weeksToRace: number) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onAnalyze }) => {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [goal, setGoal] = useState<string>('');
  const [weeksToRace, setWeeksToRace] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        // result is "data:image/jpeg;base64,...." we need to strip the header
        const base64 = result.split(',')[1];
        setImageBase64(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageBase64 && goal && weeksToRace) {
      onAnalyze('image', imageBase64, goal, parseInt(weeksToRace, 10));
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-brand-dark mb-1">Analyze Your Run Screenshot</h2>
      <p className="text-brand-text mb-6">Upload an image of your recent run from an app like Strava or Garmin.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label htmlFor="file-upload" className="block text-sm font-medium text-brand-text mb-2">Run Data Screenshot</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {imagePreview ? (
                    <img src={imagePreview} alt="Run data preview" className="mx-auto h-40 w-auto rounded-md object-contain" />
                ) : (
                    <UploadCloudIcon className="mx-auto h-12 w-12 text-slate-400" />
                )}
                <div className="flex text-sm text-slate-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-primary hover:text-sky-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-primary">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                {!fileName && <p className="text-xs text-slate-500">PNG, JPG, WEBP up to 10MB</p>}
                {fileName && <div className="text-sm text-green-600 flex items-center justify-center gap-2 pt-2"><CheckCircleIcon/> {fileName}</div>}
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="goal" className="block text-sm font-medium text-brand-text">What is your next running goal?</label>
            <input
              type="text"
              name="goal"
              id="goal"
              className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm p-2"
              placeholder="e.g., Run a half marathon in under 2 hours"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="weeksToRace" className="block text-sm font-medium text-brand-text">How many weeks until your race?</label>
            <input
              type="number"
              name="weeksToRace"
              id="weeksToRace"
              className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm p-2"
              placeholder="e.g., 8"
              value={weeksToRace}
              onChange={(e) => setWeeksToRace(e.target.value)}
              required
              min="1"
              max="52"
            />
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={!imageBase64 || !goal || !weeksToRace}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            Generate My Training Plan
          </button>
        </div>
      </form>
    </div>
  );
};

export default ImageUploader;