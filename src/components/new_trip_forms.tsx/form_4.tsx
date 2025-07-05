import { useState } from 'react';

interface Form4Props {
  onNext: () => void;
  onPrevious: () => void;
  formData: {
    selectedVibes: string[];
  };
  onFormDataChange: (field: string, value: any) => void;
}

const vibeOptions = [
  "Sing along",
  "Quiet ride",
  "Music lover",
  "Chatty",
  "Work mode",
  "Sleep mode",
  "Foodie",
  "Adventure seeker"
];

export default function Form4({ onNext, onPrevious, formData, onFormDataChange }: Form4Props) {
    const [localData, setLocalData] = useState({
        selectedVibes: formData.selectedVibes
    });
    const [error, setError] = useState<string | null>(null);

    const handleVibeToggle = (vibe: string) => {
        setLocalData(prev => ({
            selectedVibes: prev.selectedVibes.includes(vibe)
                ? prev.selectedVibes.filter(v => v !== vibe)
                : [...prev.selectedVibes, vibe]
        }));
    };

    const isValid = localData.selectedVibes.length > 0;

    const handleNext = () => {
        if (!isValid) {
          setError("Please select at least one vibe.");
          return;
        }
        setError(null);
        // Update parent form data
        onFormDataChange('selectedVibes', localData.selectedVibes);
        onNext();
    };

    const handlePrevious = () => {
        // Update parent form data before going back
        onFormDataChange('selectedVibes', localData.selectedVibes);
        onPrevious();
    };

    return(
        <section className="space-y-6 w-full px-8 lg:px-0 lg:w-[30rem] flex flex-col items-center mx-auto mt-[10rem]">
            <div className="flex gap-2 w-full items-center">
                <button 
                    onClick={handlePrevious}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                <svg width="32" height="33" className="h-5" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.5 7.5L11.5 16.5L20.5 25.5" stroke="black" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                </button>
                <h1 className="text-3xl font-semibold">Set the trip vibe</h1>
            </div>

            <div className="space-y-4 w-full">
                <p className="text-sm text-gray-600 text-center">
                    Select the vibes that match your travel style (you can select multiple)
                </p>

            <div className="flex flex-wrap justify-center gap-4 w-full">
                    {vibeOptions.map((vibe) => (
                        <button
                            key={vibe}
                            onClick={() => handleVibeToggle(vibe)}
                            className={`text-sm rounded-lg border-2 py-2 px-4 transition-all ${
                                localData.selectedVibes.includes(vibe)
                                    ? 'bg-black text-white border-black'
                                    : 'border-gray-300 hover:border-black'
                            }`}
                        >
                            {vibe}
                        </button>
                    ))}
                </div>
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <button 
                onClick={handleNext}
                className={`w-full py-3 text-center rounded-full text-white transition-colors ${isValid ? 'bg-black hover:bg-gray-800 cursor-pointer' : 'bg-gray-300 cursor-not-allowed'}`}
                disabled={!isValid}
            >
                Next
            </button>
        </section>
    )
}