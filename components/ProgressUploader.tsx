import React, { useState, useCallback, useId } from 'react';
import { UploadCloudIcon, XCircleIcon } from './icons';

interface ProgressUploaderProps {
  onAnalyze: (images: string[]) => void;
}

interface FileState {
  id: string;
  name: string;
  preview: string;
  base64: string;
}

const ProgressUploader: React.FC<ProgressUploaderProps> = ({ onAnalyze }) => {
  const [files, setFiles] = useState<FileState[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const formId = useId();

  const processFile = (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const base64 = result.split(',')[1];
        if (base64) {
          setFiles(prev => [...prev, { id: `${file.name}-${new Date().getTime()}`, name: file.name, preview: result, base64 }]);
        }
      };
      reader.readAsDataURL(file);
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      Array.from(selectedFiles).forEach(processFile);
    }
  };
  
  const handleDragEvents = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
        setIsDragging(true);
    } else if (e.type === "dragleave") {
        setIsDragging(false);
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach(processFile);
    }
  }

  const handleRemoveImage = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length > 1) {
      onAnalyze(files.map(f => f.base64));
    }
  };

  const canSubmit = files.length > 1;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-brand-dark mb-1">Analyze Your Progress</h2>
      <p className="text-brand-text mb-6">Upload at least two screenshots of your runs. The AI will analyze them to find trends and give you recommendations.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label 
                htmlFor={`file-upload-${formId}`} 
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md ${isDragging ? 'border-brand-primary bg-sky-50' : ''}`}
                onDragEnter={handleDragEvents}
                onDragLeave={handleDragEvents}
                onDragOver={handleDragEvents}
                onDrop={handleDrop}
            >
              <div className="space-y-1 text-center">
                <UploadCloudIcon className="mx-auto h-12 w-12 text-slate-400" />
                <div className="flex text-sm text-slate-600">
                  <span className="relative cursor-pointer bg-white rounded-md font-medium text-brand-primary hover:text-sky-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-primary">
                    <span>Upload files</span>
                  </span>
                  <input id={`file-upload-${formId}`} name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" multiple />
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-slate-500">Upload at least 2 images (PNG, JPG, WEBP)</p>
              </div>
            </label>
          </div>
          
          {files.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-brand-text mb-2">Selected Runs ({files.length})</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {files.map((file) => (
                  <div key={file.id} className="relative group aspect-square">
                    <img src={file.preview} alt={file.name} className="w-full h-full object-cover rounded-md shadow-md" />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-colors flex items-center justify-center">
                      <button 
                        type="button" 
                        onClick={() => handleRemoveImage(file.id)} 
                        className="absolute top-1 right-1 text-white bg-black bg-opacity-50 rounded-full h-6 w-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={`Remove ${file.name}`}
                      >
                         <XCircleIcon className="h-5 w-5"/>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {canSubmit ? 'Analyze My Progress' : 'Please upload at least 2 images'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProgressUploader;
