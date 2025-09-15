import React from 'react';
import { TrainingPlan } from '../types';
import { TargetIcon, CalendarIcon, CheckCircleIcon, MoonIcon } from './icons';

interface TrainingPlanDisplayProps {
  plan: TrainingPlan;
}

const TrainingPlanDisplay: React.FC<TrainingPlanDisplayProps> = ({ plan }) => {
  return (
    <div className="p-4 md:p-8 bg-white">
      <div className="text-center mb-8">
        <TargetIcon className="w-16 h-16 mx-auto text-brand-secondary" />
        <h2 className="mt-4 text-3xl font-extrabold text-brand-dark tracking-tight">{plan.title}</h2>
        <p className="mt-2 max-w-2xl mx-auto text-lg text-brand-text">{plan.overview}</p>
      </div>

      <div className="space-y-8">
        {plan.weeks.map((week) => (
          <div key={week.week} className="bg-brand-light p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-4 mb-4">
               <div className="flex-shrink-0 bg-brand-primary text-white rounded-lg h-12 w-12 flex items-center justify-center">
                <CalendarIcon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-brand-dark">Week {week.week}</h3>
                <p className="text-brand-text">{week.summary}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {week.days.map((day) => {
                const isRestDay = day.activity.toLowerCase().includes('rest');
                return (
                    <div key={day.day} className="bg-white p-4 rounded-lg border border-slate-200">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                                {isRestDay ? (
                                    <MoonIcon className="w-5 h-5 text-sky-500" />
                                ) : (
                                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                )}
                            </div>
                            <div>
                                <p className="font-bold text-brand-dark">{day.day}</p>
                                <p className={`font-semibold ${isRestDay ? 'text-sky-600' : 'text-brand-primary'}`}>{day.activity}</p>
                                <p className="text-sm text-brand-text mt-1">{day.details}</p>
                            </div>
                        </div>
                    </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingPlanDisplay;
