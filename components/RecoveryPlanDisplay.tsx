import React from 'react';
import { RecoveryPlan } from '../types';
import { StretchIcon, SparklesIcon } from './icons';

interface RecoveryPlanDisplayProps {
  plan: RecoveryPlan;
}

const RecoveryPlanDisplay: React.FC<RecoveryPlanDisplayProps> = ({ plan }) => {
  return (
    <div className="p-4 md:p-8 bg-white">
      <div className="text-center mb-8">
        <StretchIcon className="w-16 h-16 mx-auto text-brand-primary" />
        <h2 className="mt-4 text-3xl font-extrabold text-brand-dark tracking-tight">{plan.title}</h2>
        <p className="mt-2 max-w-2xl mx-auto text-lg text-brand-text">{plan.overview}</p>
      </div>

      <div className="space-y-4">
        {plan.routines.map((routine, index) => (
          <div key={index} className="bg-brand-light p-5 rounded-xl shadow-sm">
            <div className="flex items-start gap-4">
               <div className="flex-shrink-0 bg-amber-500 text-white rounded-lg h-10 w-10 flex items-center justify-center">
                <SparklesIcon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-brand-dark">{routine.name}</h3>
                <p className="font-semibold text-amber-700">{routine.duration}</p>
                <p className="text-brand-text mt-2 text-sm">{routine.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecoveryPlanDisplay;