import React from 'react';
import { AppState } from '../types';
import { UploadIcon, EditIcon, StretchIcon, TrendingUpIcon, SparklesIcon } from './icons';

interface WelcomeScreenProps {
  setAppState: (state: AppState) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ setAppState }) => {
  return (
    <div className="p-8 bg-white">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-brand-dark mb-2">Welcome to Rochys Run Coach</h2>
        <p className="text-lg text-brand-text mb-6 max-w-3xl mx-auto">Get instant feedback on your last run, create a personalized training plan, track your performance, or generate a custom recovery routine.</p>
      </div>

      <div className="max-w-2xl mx-auto my-8">
        <button
          onClick={() => setAppState(AppState.RecentRunUpload)}
          className="group w-full flex flex-col items-center justify-center p-6 bg-sky-50 rounded-lg border-2 border-brand-primary hover:bg-sky-100 transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-xl"
        >
          <SparklesIcon className="w-12 h-12 text-brand-primary mb-4 transition-transform group-hover:scale-110" />
          <h3 className="text-xl font-semibold text-brand-dark mb-2">Analyze Your Recent Run</h3>
          <p className="text-brand-text text-sm text-center">Get instant feedback on your last session from a single screenshot.</p>
        </button>
      </div>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-base font-medium text-slate-500">Or Plan For The Future</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-center">
        {/* Option 1: Upload Image */}
        <button
          onClick={() => setAppState(AppState.ImageUpload)}
          className="group flex flex-col items-center justify-center p-6 bg-slate-50 rounded-lg border-2 border-slate-200 hover:border-brand-primary hover:bg-sky-50 transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-lg"
        >
          <UploadIcon className="w-12 h-12 text-brand-primary mb-4 transition-transform group-hover:scale-110" />
          <h3 className="text-xl font-semibold text-brand-dark mb-2">Create Plan from Screenshot</h3>
          <p className="text-brand-text text-sm">Use run data for a new training plan.</p>
        </button>

        {/* Option 2: Manual Entry */}
        <button
          onClick={() => setAppState(AppState.ManualInput)}
          className="group flex flex-col items-center justify-center p-6 bg-slate-50 rounded-lg border-2 border-slate-200 hover:border-brand-secondary hover:bg-green-50 transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-lg"
        >
          <EditIcon className="w-12 h-12 text-brand-secondary mb-4 transition-transform group-hover:scale-110" />
          <h3 className="text-xl font-semibold text-brand-dark mb-2">Create Plan Manually</h3>
          <p className="text-brand-text text-sm">Provide your stats for a training plan.</p>
        </button>
        
        {/* Option 3: Track Progress */}
        <button
          onClick={() => setAppState(AppState.Progress)}
          className="group flex flex-col items-center justify-center p-6 bg-slate-50 rounded-lg border-2 border-slate-200 hover:border-purple-500 hover:bg-purple-50 transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-lg"
        >
          <TrendingUpIcon className="w-12 h-12 text-purple-500 mb-4 transition-transform group-hover:scale-110" />
          <h3 className="text-xl font-semibold text-brand-dark mb-2">Track Your Progress</h3>
          <p className="text-brand-text text-sm">Analyze multiple runs to see trends.</p>
        </button>

        {/* Option 4: Recovery & Stretching */}
        <button
          onClick={() => setAppState(AppState.Recovery)}
          className="group flex flex-col items-center justify-center p-6 bg-slate-50 rounded-lg border-2 border-slate-200 hover:border-amber-500 hover:bg-amber-50 transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-lg"
        >
          <StretchIcon className="w-12 h-12 text-amber-500 mb-4 transition-transform group-hover:scale-110" />
          <h3 className="text-xl font-semibold text-brand-dark mb-2">Recovery & Stretching</h3>
          <p className="text-brand-text text-sm">Generate a routine to aid recovery.</p>
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;