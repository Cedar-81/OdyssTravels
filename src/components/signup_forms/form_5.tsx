
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

interface Form5Props {
  formData: any;
  onChange: (field: string, value: any) => void;
  onSubmit: () => void;
  onPrevious: () => void;
  loading?: boolean;
}

export default function Form5({ formData, onChange, onSubmit, onPrevious, loading }: Form5Props) {
  const handleVibeToggle = (vibe: string) => {
    const current = formData.vibes || [];
    if (current.includes(vibe)) {
      onChange("vibes", current.filter((v: string) => v !== vibe));
    } else {
      onChange("vibes", [...current, vibe]);
    }
  };

    return(
        <section className="space-y-8 w-full px-8 lg:px-0 lg:w-[30rem] flex flex-col items-center mx-auto mt-[5rem]">
            <div className="flex gap-2 w-full items-center">
                <button 
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          type="button"
          onClick={onPrevious}
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
              type="button"
              className={`text-sm rounded-lg border-2 py-2 px-4 transition-all ${formData.vibes?.includes(vibe) ? 'bg-black text-white border-black' : 'border-gray-300'}`}
              onClick={() => handleVibeToggle(vibe)}
                        >
                            {vibe}
                        </button>
                    ))}
                </div>
            </div>
      <div className="flex gap-2 w-full">
        <button 
          type="button"
          className="w-1/2 cursor-pointer py-3 text-center rounded-full text-black bg-gray-200 hover:bg-gray-300 transition-colors"
          onClick={onPrevious}
        >
          Previous
        </button>
            <button 
          className="w-1/2 cursor-pointer py-3 text-center rounded-full text-white bg-black hover:bg-gray-800 transition-colors"
          onClick={onSubmit}
          disabled={loading}
            >
          {loading ? "Submitting..." : "Done"}
            </button>
      </div>
        </section>
    )
}