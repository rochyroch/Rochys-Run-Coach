import React from 'react';
import { RecentRunAnalysis } from '../types';
import { SparklesIcon, CheckCircleIcon } from './icons';

interface RecentRunAnalysisDisplayProps {
  plan: RecentRunAnalysis;
}

const RecentRunAnalysisDisplay: React.FC<RecentRunAnalysisDisplayProps> = ({ plan }) => {
  return (
    <div className="p-4 md:p-8 bg-white">
      <div className="text-center mb-8">
        <SparklesIcon className="w-16 h-16 mx-auto text-brand-primary" />
        <h2 className="mt-4 text-3xl font-extrabold text-brand-dark tracking-tight">{plan.title}</h2>
        <p className="mt-2 max-w-2xl mx-auto text-lg text-brand-text">{plan.overallSummary}</p>
      </div>
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-brand-dark border-b-2 border-slate-200 pb-2">Metrics Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plan.metrics.map((metric, index) => (
            <div key={index} className="bg-brand-light p-5 rounded-xl shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircleIcon className="w-6 h-6 text-brand-secondary" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-brand-dark text-lg">{metric.metric}</p>
                  <p className="font-semibold text-brand-primary text-xl">{metric.value}</p>
                  <p className="text-brand-text mt-2 text-sm">{metric.feedback}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentRunAnalysisDisplay;