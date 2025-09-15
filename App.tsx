import React, { useState, useCallback } from 'react';
import { AppState, ManualData, TrainingPlan, RecoveryPlan, ProgressAnalysis, RecentRunAnalysis } from './types';
import Header from './components/Header';
import WelcomeScreen from './components/WelcomeScreen';
import ImageUploader from './components/ImageUploader';
import ManualInputForm from './components/ManualInputForm';
import LoadingSpinner from './components/LoadingSpinner';
import TrainingPlanDisplay from './components/TrainingPlanDisplay';
import RecoveryScreen from './components/RecoveryScreen';
import RecoveryPlanDisplay from './components/RecoveryPlanDisplay';
import ProgressUploader from './components/ProgressUploader';
import ProgressAnalysisDisplay from './components/ProgressAnalysisDisplay';
import RecentRunUploader from './components/RecentRunUploader';
import RecentRunAnalysisDisplay from './components/RecentRunAnalysisDisplay';
import { analyzeRunDataFromImage, generatePlanFromText, generateRecoveryRoutine, analyzeProgressFromImages, analyzeRecentRunImage } from './services/geminiService';
import { ArrowLeftIcon } from './components/icons';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.Welcome);
  const [error, setError] = useState<string | null>(null);
  const [trainingPlan, setTrainingPlan] = useState<TrainingPlan | null>(null);
  const [recoveryPlan, setRecoveryPlan] = useState<RecoveryPlan | null>(null);
  const [progressAnalysis, setProgressAnalysis] = useState<ProgressAnalysis | null>(null);
  const [recentRunAnalysis, setRecentRunAnalysis] = useState<RecentRunAnalysis | null>(null);

  const handleReset = () => {
    setAppState(AppState.Welcome);
    setTrainingPlan(null);
    setRecoveryPlan(null);
    setProgressAnalysis(null);
    setRecentRunAnalysis(null);
    setError(null);
  };

  const handleBack = () => {
    if (appState === AppState.PlanReady) {
      handleReset();
    } else if (appState === AppState.ImageUpload || appState === AppState.ManualInput || appState === AppState.Recovery || appState === AppState.Progress || appState === AppState.RecentRunUpload) {
      setAppState(AppState.Welcome);
    }
  };

  const handleAnalysis = useCallback(async (
    dataType: 'image' | 'manual',
    data: string | ManualData,
    goal: string,
    weeksToRace: number
  ) => {
    setAppState(AppState.Generating);
    setError(null);
    try {
      let plan: TrainingPlan | null = null;
      if (dataType === 'image' && typeof data === 'string') {
        plan = await analyzeRunDataFromImage(data, goal, weeksToRace);
      } else if (dataType === 'manual' && typeof data !== 'string') {
        plan = await generatePlanFromText(data, goal, weeksToRace);
      }

      if (plan) {
        setTrainingPlan(plan);
        setRecoveryPlan(null);
        setProgressAnalysis(null);
        setRecentRunAnalysis(null);
        setAppState(AppState.PlanReady);
      } else {
        throw new Error('The generated plan was empty. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
      setAppState(AppState.Welcome);
    }
  }, []);

   const handleRecovery = useCallback(async (focusArea: string, specificMuscle: string) => {
    setAppState(AppState.Generating);
    setError(null);
    try {
      const plan = await generateRecoveryRoutine(focusArea, specificMuscle);
      if (plan) {
        setRecoveryPlan(plan);
        setTrainingPlan(null);
        setProgressAnalysis(null);
        setRecentRunAnalysis(null);
        setAppState(AppState.PlanReady);
      } else {
        throw new Error('The generated recovery routine was empty. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
      setAppState(AppState.Welcome);
    }
  }, []);

  const handleProgressAnalysis = useCallback(async (images: string[]) => {
    setAppState(AppState.Generating);
    setError(null);
    try {
      const analysis = await analyzeProgressFromImages(images);
      if (analysis) {
        setProgressAnalysis(analysis);
        setTrainingPlan(null);
        setRecoveryPlan(null);
        setRecentRunAnalysis(null);
        setAppState(AppState.PlanReady);
      } else {
        throw new Error('The generated analysis was empty. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
      setAppState(AppState.Welcome);
    }
  }, []);

  const handleRecentRunAnalysis = useCallback(async (image: string) => {
    setAppState(AppState.Generating);
    setError(null);
    try {
      const analysis = await analyzeRecentRunImage(image);
      if (analysis) {
        setRecentRunAnalysis(analysis);
        setTrainingPlan(null);
        setRecoveryPlan(null);
        setProgressAnalysis(null);
        setAppState(AppState.PlanReady);
      } else {
        throw new Error('The generated analysis was empty. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
      setAppState(AppState.Welcome);
    }
  }, []);


  const renderContent = () => {
    switch (appState) {
      case AppState.Welcome:
        return <WelcomeScreen setAppState={setAppState} />;
      case AppState.RecentRunUpload:
        return <RecentRunUploader onAnalyze={handleRecentRunAnalysis} />;
      case AppState.ImageUpload:
        return <ImageUploader onAnalyze={handleAnalysis} />;
      case AppState.ManualInput:
        return <ManualInputForm onAnalyze={handleAnalysis} />;
      case AppState.Recovery:
        return <RecoveryScreen onGenerate={handleRecovery} />;
      case AppState.Progress:
        return <ProgressUploader onAnalyze={handleProgressAnalysis} />;
      case AppState.Generating:
        return (
          <div className="flex flex-col items-center justify-center text-center p-8 min-h-[300px]">
            <LoadingSpinner />
            <p className="text-brand-text mt-4 text-lg">Our AI coach is working its magic... </p>
          </div>
        );
      case AppState.PlanReady:
        if (recentRunAnalysis) return <RecentRunAnalysisDisplay plan={recentRunAnalysis} />;
        if (trainingPlan) return <TrainingPlanDisplay plan={trainingPlan} />;
        if (recoveryPlan) return <RecoveryPlanDisplay plan={recoveryPlan} />;
        if (progressAnalysis) return <ProgressAnalysisDisplay plan={progressAnalysis} />;
        return <p>No plan generated.</p>;
      default:
        return <WelcomeScreen setAppState={setAppState} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-light font-sans text-brand-text">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          {appState !== AppState.Welcome && (
            <div className="p-4 border-b border-slate-200">
               <button onClick={handleBack} className="flex items-center gap-2 text-sm font-semibold text-brand-primary hover:text-sky-700 transition-colors">
                  <ArrowLeftIcon />
                  {appState === AppState.PlanReady ? 'Start Over' : 'Back'}
                </button>
            </div>
          )}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4 rounded" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}
          {renderContent()}
        </div>
      </main>
       <footer className="text-center py-4 text-slate-500 text-sm">
        <p>Powered by AI. Always consult a doctor before starting a new fitness program.</p>
      </footer>
    </div>
  );
};

export default App;