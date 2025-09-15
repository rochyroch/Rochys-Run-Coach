
import React from 'react';

interface AnatomySelectorProps {
  selectedArea: string | null;
  onAreaSelect: (area: string) => void;
}

// A reusable component for each clickable body part
const BodyPart: React.FC<{
  name: string;
  paths: string[];
  selectedArea: string | null;
  onAreaSelect: (area: string) => void;
}> = ({ name, paths, selectedArea, onAreaSelect }) => {
  const isSelected = selectedArea === name;
  const partClass = `cursor-pointer transition-colors duration-200 stroke-white stroke-[1.5px] ${
    isSelected ? 'fill-brand-primary' : 'fill-slate-300 hover:fill-sky-400'
  }`;

  return (
    <g onClick={() => onAreaSelect(name)} aria-label={name} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onAreaSelect(name); }}>
      <title>{name}</title>
      {paths.map((d, i) => (
        <path key={i} d={d} className={partClass} />
      ))}
    </g>
  );
};

export const AnatomySelector: React.FC<AnatomySelectorProps> = ({ selectedArea, onAreaSelect }) => {
  const bodyParts = {
    'Neck': [
      "M83.2,66.8H66.8V51.4h16.4V66.8z"
    ],
    'Arms': [
      "M51.9,80.6C51.9,80.6,51.9,80.6,51.9,80.6L36.3,138l-4,30.3l12.1-2.9l4.5-34.1l11.4-53.1L51.9,80.6z",
      "M98.1,80.6C98.1,80.6,98.1,80.6,98.1,80.6l15.6,57.4l4,30.3l-12.1-2.9l-4.5-34.1l-11.4-53.1L98.1,80.6z"
    ],
    'Upper Body': [
      "M98.1,80.6V66.8H51.9v13.8H98.1z"
    ],
    'Core': [
      "M51.9,80.6 v22.9 h46.2 V80.6 z"
    ],
    'Hips': [
      "M98.1,103.5l-8.6,22.8H60.5l-8.6-22.8H98.1z"
    ],
    'Upper Legs': [
      "M60.5,126.3L48.1,186.7h11.4l9.2-60.4H60.5z",
      "M89.5,126.3L77.1,186.7h11.4l9.2-60.4H89.5z"
    ],
    'Lower Legs': [
      "M59.5,186.7l-9.3,60.4h11.4l8.2-60.4H59.5z",
      "M88.5,186.7l-9.3,60.4h11.4l8.2-60.4H88.5z"
    ],
  };

  return (
    <div className="flex flex-col items-center py-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 150 280"
        className="w-auto h-80 md:h-96"
        aria-labelledby="anatomy-title"
      >
        <title id="anatomy-title">Select a body area to focus on</title>
        <g>
          {/* Head (not selectable) */}
          <path d="M92,34.4c0,9.4-7.6,17-17,17s-17-7.6-17-17s7.6-17,17-17S92,25,92,34.4z" fill="#e2e8f0" stroke="#FFF" strokeWidth="1.5"/>

          {Object.entries(bodyParts).map(([name, paths]) => (
            <BodyPart
              key={name}
              name={name}
              paths={paths}
              selectedArea={selectedArea}
              onAreaSelect={onAreaSelect}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};
