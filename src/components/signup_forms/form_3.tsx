import { Input } from "../ui/input";
import { useState } from "react";
import { authService } from "@/services/auth";
import { getVerificationError } from "../../utils/errorHandling";

interface Form3Props {
  formData: any;
  onChange: (field: string, value: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function Form3({ formData, onChange, onNext, onPrevious }: Form3Props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await authService.requestOTP(formData.email);
            onNext();
        } catch (err: any) {
            setError(getVerificationError(err));
        } finally {
            setLoading(false);
        }
    };

    return(
        <section className="space-y-6 w-full px-8 lg:px-0 lg:w-[30rem] flex flex-col items-center mx-auto mt-[5rem]">
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
                        <h1 className="text-xl font-semibold">Stay in Touch</h1>   
                        <p className="text-xs">How should we reach you? Drop your email and phone. Set a password to secure your space.</p>
                    </div>
                </div>

            <form className="space-y-4 w-full" onSubmit={handleSubmit}>
                    <div className="flex flex-col space-y-1 border border-black rounded-xl px-4 pt-3 pb-2 w-full">
                        <label className="text-xs font-semibold" >Email</label>
                        <Input 
                            className="outline-none border-none text-sm focus:border-none" 
                            type="text" 
                            placeholder="e.g johnnydex@gmail.com"
                        value={formData.email}
                        onChange={e => onChange("email", e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col space-y-1 border border-black rounded-xl px-4 pt-3 pb-2 w-full">
                        <label className="text-xs font-semibold" >Phone number</label>
                        <div className="flex items-center">
                            <p className="text-sm flex gap-2"><span className="font-semibold">NG</span> +234</p>
                            <Input 
                                className="outline-none border-none text-sm focus:border-none" 
                                type="text" 
                                placeholder="810 332 3454"
                            value={formData.phone_number}
                            onChange={e => onChange("phone_number", e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="flex flex-col space-y-1 border border-black rounded-xl px-4 pt-3 pb-2 w-full">
                        <label className="text-xs font-semibold" >Password</label>
                        <Input 
                            className="outline-none border-none text-sm focus:border-none" 
                            type="password" 
                            placeholder="************"
                        value={formData.password}
                        onChange={e => onChange("password", e.target.value)}
                            required
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
                      disabled={loading}
                    >
                        {loading ? "Sending..." : "Next"}
                    </button>
                </div>
                {error && <div className="text-xs text-red-500 text-center mt-2">{error}</div>}
                </form>
            </section>
        )
}