import { DatePicker } from "../ui/date_picker";
import { Input } from "../ui/input";

interface Form2Props {
  formData: any;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function Form2({ formData, onChange, onNext, onPrevious }: Form2Props) {
    return(
        <section className="space-y-6 w-full px-8 lg:px-0 lg:w-[30rem] flex flex-col items-center mx-auto mt-[10rem]">
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
                <div className="">
                    <h1 className="text-xl font-semibold">Let’s Get to Know You</h1>   
                    <p className="text-xs">Just the basics — your name, your birthday, and we’re good to go.</p>
                </div>
            </div>

            <form className="space-y-4 w-full" onSubmit={e => { e.preventDefault(); onNext(); }}>
                <div className="flex gap-4">
                    <div className="flex flex-col space-y-1 border border-black rounded-xl px-4 pt-3 pb-2 w-full">
                        <label className="text-xs font-semibold" >Firstname</label>
                        <Input 
                            className="outline-none border-none text-sm focus:border-none" 
                            type="text" 
                            placeholder="Enter firstname"
                            value={formData.first_name}
                            onChange={e => onChange("first_name", e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col space-y-1 border border-black rounded-xl px-4 pt-3 pb-2 w-full">
                        <label className="text-xs font-semibold" >Lastname</label>
                        <Input 
                            className="outline-none border-none text-sm focus:border-none" 
                            type="text" 
                            placeholder="Enter lastname"
                            value={formData.last_name}
                            onChange={e => onChange("last_name", e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="flex flex-col space-y-2 border border-black rounded-xl px-4 pt-3 pb-2 w-full">
                    <label className="text-xs font-semibold" >Date of birth</label>
                    <DatePicker 
                        date={formData.date_of_birth ? new Date(formData.date_of_birth) : null}
                        onDateChange={(date) => {
                            if (date) {
                                // Convert Date to ISO string format for backend
                                onChange("date_of_birth", date.toISOString().split('T')[0]);
                            } else {
                                onChange("date_of_birth", "");
                            }
                        }}
                    />
                </div>       
                <div className="flex gap-2">
                  <button 
                      type="button"
                      className="w-1/2 cursor-pointer py-3 text-center rounded-full text-black bg-gray-200 hover:bg-gray-300 transition-colors"
                      onClick={onPrevious}
                  >
                      Previous
                  </button>
                  <button 
                      type="submit"
                      className="w-1/2 cursor-pointer py-3 text-center rounded-full text-white bg-black hover:bg-gray-800 transition-colors"
                  >
                      Next
                  </button>
                </div>
            </form>
        </section>
    )
}