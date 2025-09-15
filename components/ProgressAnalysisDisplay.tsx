import React from 'react';
import { ProgressAnalysis, ProgressInsight } from '../types';
import { TrendingUpIcon, ArrowUpCircleIcon, ArrowDownCircleIcon, MinusCircleIcon, SparklesIcon } from './icons';

interface ProgressAnalysisDisplayProps {
  plan: ProgressAnalysis;
}

const TrendIcon: React.FC<{ trend: ProgressInsight['trend'] }> = ({ trend }) => {
  switch (trend) {
    case 'improvement':
      return <ArrowUpCircleIcon className="w-8 h-8 text-green-500" />;
    case 'decline':
      return <ArrowDownCircleIcon className="w-8 h-8 text-red-500" />;
    case 'stagnation':
      return <MinusCircleIcon className="w-8 h-8 text-amber-500" />;
    case 'mixed':
      return <SparklesIcon className="w-8 h-8 text-purple-500" />;
    default:
      return null;
  }
};

const ProgressAnalysisDisplay: React.FC<ProgressAnalysisDisplayProps> = ({ plan }) => {
  return (
    <div className="p-4 md:p-8 bg-white">
      <div className="text-center mb-8">
        <TrendingUpIcon className="w-16 h-16 mx-auto text-purple-500" />
        <h2 className="mt-4 text-3xl font-extrabold text-brand-dark tracking-tight">{plan.title}</h2>
        <p className="mt-2 max-w-2xl mx-auto text-lg text-brand-text">{plan.summary}</p>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-brand-dark border-b-2 border-slate-200 pb-2">Key Insights & Recommendations</h3>
        {plan.insights.map((insight, index) => (
          <div key={index} className="bg-brand-light p-5 rounded-xl shadow-sm">
            <div className="flex items-start gap-4">
               <div className="flex-shrink-0 mt-1">
                <TrendIcon trend={insight.trend} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">{insight.trend}</p>
                <h4 className="text-lg font-bold text-brand-dark mt-1">Observation</h4>
                <p className="text-brand-text mt-1">{insight.observation}</p>
                
                <h4 className="text-lg font-bold text-brand-dark mt-4">Recommendation</h4>
                <p className="text-brand-text mt-1">{insight.recommendation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressAnalysisDisplay;
