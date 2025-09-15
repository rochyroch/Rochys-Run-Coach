
import React, { useState } from 'react';
import { AnatomySelector } from './AnatomySelector';

interface RecoveryScreenProps {
    onGenerate: (focusArea: string, specificMuscle: string) => void;
}

const RecoveryScreen: React.FC<RecoveryScreenProps> = ({ onGenerate }) => {
    const [selectedArea, setSelectedArea] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedArea) {
            onGenerate(selectedArea, '');
        }
    };

    return (
        <div className="p-8">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-brand-dark mb-1">Recovery & Stretching Routine</h2>
                <p className="text-brand-text mb-2">Select an area on the body to generate a custom routine.</p>
            </div>

            <form onSubmit={handleSubmit}>
                <AnatomySelector selectedArea={selectedArea} onAreaSelect={setSelectedArea} />
                
                {selectedArea && (
                    <p className="text-center text-lg font-semibold text-brand-dark -mt-2 mb-4">
                        Focus Area: <span className="text-brand-primary">{selectedArea}</span>
                    </p>
                )}

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={!selectedArea}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-slate-400 disabled:cursor-not-allowed"
                    >
                        Generate Routine
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RecoveryScreen;
