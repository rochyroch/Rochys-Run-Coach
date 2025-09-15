
import React, { useState } from 'react';
import { ManualData } from '../types';

interface ManualInputFormProps {
  onAnalyze: (dataType: 'manual', data: ManualData, goal: string, weeksToRace: number) => void;
}

const ManualInputForm: React.FC<ManualInputFormProps> = ({ onAnalyze }) => {
  const [formData, setFormData] = useState<ManualData>({
    age: '',
    height: '',
    weight: '',
    fitnessLevel: '',
    recentRun: '',
  });
  const [goal, setGoal] = useState<string>('');
  const [weeksToRace, setWeeksToRace] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (goal && formData.fitnessLevel && weeksToRace) {
      onAnalyze('manual', formData, goal, parseInt(weeksToRace, 10));
    }
  };

  const isFormValid = Object.values(formData).every(val => val !== '') && goal !== '' && weeksToRace !== '';

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-brand-dark mb-1">Enter Your Details Manually</h2>
      <p className="text-brand-text mb-6">Provide some basic information so Rochys Run Coach can create your plan.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-slate-600">Age</label>
            <input type="number" name="age" id="age" value={formData.age} onChange={handleChange} className="mt-1 block w-full bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:bg-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary sm:text-sm p-2 transition-colors" placeholder="e.g., 32" required />
          </div>
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-slate-600">Height (cm)</label>
            <input type="number" name="height" id="height" value={formData.height} onChange={handleChange} className="mt-1 block w-full bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:bg-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary sm:text-sm p-2 transition-colors" placeholder="e.g., 175" required />
          </div>
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-slate-600">Weight (kg)</label>
            <input type="number" name="weight" id="weight" value={formData.weight} onChange={handleChange} className="mt-1 block w-full bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:bg-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary sm:text-sm p-2 transition-colors" placeholder="e.g., 70" required />
          </div>
        </div>

        <div>
          <label htmlFor="fitnessLevel" className="block text-sm font-medium text-slate-600">Fitness Level</label>
          <select id="fitnessLevel" name="fitnessLevel" value={formData.fitnessLevel} onChange={handleChange} className="mt-1 block w-full bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:bg-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-base sm:text-sm pl-3 pr-10 py-2 transition-colors" required>
            <option value="" disabled>Select your fitness level</option>
            <option value="beginner">Beginner (New to running or run infrequently)</option>
            <option value="intermediate">Intermediate (Run a few times a week)</option>
            <option value="advanced">Advanced (Run regularly and race)</option>
          </select>
        </div>

        <div>
          <label htmlFor="recentRun" className="block text-sm font-medium text-slate-600">Recent Race or Best Effort</label>
          <input type="text" name="recentRun" id="recentRun" value={formData.recentRun} onChange={handleChange} className="mt-1 block w-full bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:bg-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary sm:text-sm p-2 transition-colors" placeholder="e.g., 10k in 55 minutes" required />
        </div>
        
        <div>
          <label htmlFor="goal" className="block text-sm font-medium text-slate-600">What is your next running goal?</label>
          <input type="text" name="goal" id="goal" value={goal} onChange={(e) => setGoal(e.target.value)} className="mt-1 block w-full bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:bg-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary sm:text-sm p-2 transition-colors" placeholder="e.g., Complete a marathon" required />
        </div>

        <div>
            <label htmlFor="weeksToRace" className="block text-sm font-medium text-slate-600">How many weeks until your race?</label>
            <input
            type="number"
            name="weeksToRace"
            id="weeksToRace"
            value={weeksToRace}
            onChange={(e) => setWeeksToRace(e.target.value)}
            className="mt-1 block w-full bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:bg-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary sm:text-sm p-2 transition-colors"
            placeholder="e.g., 12"
            required
            min="1"
            max="52"
            />
        </div>

        <div className="pt-2">
          <button type="submit" disabled={!isFormValid} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-slate-400 disabled:cursor-not-allowed">
            Generate My Training Plan
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManualInputForm;
