import { useState, useEffect, useRef } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { showToast, toastMessages } from "@/utils/toast";

interface Form5Props {
  onSubmit: () => void;
  onPrevious: () => void;
  formData: {
    tripPrice: string;
    refundPolicyAcknowledged: boolean;
    smartFillPolicy: string;
    departureCity: string;
    destinationCity: string;
    tripTime: string;
    selectedRoutePrice: number;
  };
  onFormDataChange: (field: string, value: any) => void;
  loading?: boolean;
}

export default function Form5({ onSubmit, onPrevious, formData, onFormDataChange, loading }: Form5Props) {
    const [localData, setLocalData] = useState({
        tripPrice: formData.tripPrice,
        refundPolicyAcknowledged: formData.refundPolicyAcknowledged,
        smartFillPolicy: formData.smartFillPolicy
    });
    const priceSetRef = useRef(false);

    // Auto-set price based on selected route
    useEffect(() => {
        if (formData.selectedRoutePrice > 0 && !priceSetRef.current) {
            const price = formData.selectedRoutePrice.toString();
            setLocalData(prev => ({ ...prev, tripPrice: price }));
            onFormDataChange('tripPrice', price);
            priceSetRef.current = true;
        }
    }, [formData.selectedRoutePrice]);

    // Sync localData with formData changes
    useEffect(() => {
      setLocalData(prev => ({ 
        ...prev, 
        refundPolicyAcknowledged: formData.refundPolicyAcknowledged,
        smartFillPolicy: formData.smartFillPolicy
      }));
    }, [formData.refundPolicyAcknowledged, formData.smartFillPolicy]);

    const isValid = localData.tripPrice && localData.refundPolicyAcknowledged && localData.smartFillPolicy;

    const handleSubmit = () => {
        if (loading) return; // Prevent multiple submissions
        if (!isValid) {
          showToast.error(toastMessages.refundPolicyRequired);
          return;
        }
        // Update parent form data
        onFormDataChange('tripPrice', localData.tripPrice);
        onFormDataChange('refundPolicyAcknowledged', localData.refundPolicyAcknowledged);
        onFormDataChange('smartFillPolicy', localData.smartFillPolicy);
        showToast.success(toastMessages.tripDetailsSaved);
        onSubmit();
    };

    const handlePrevious = () => {
        // Update parent form data before going back
        onFormDataChange('tripPrice', localData.tripPrice);
        onFormDataChange('refundPolicyAcknowledged', localData.refundPolicyAcknowledged);
        onFormDataChange('smartFillPolicy', localData.smartFillPolicy);
        onPrevious();
    };

    return(
        <section className="space-y-6 w-full px-8 lg:px-0 lg:w-[30rem] flex flex-col items-center mx-auto mt-[5rem] overflow-y-auto max-h-screen pb-20">
            <div className="flex gap-2 w-full items-center">
                <button 
                    onClick={handlePrevious}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <svg width="32" height="33" className="h-5" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.5 7.5L11.5 16.5L20.5 25.5" stroke="black" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
                <h1 className="text-xl font-semibold">Pricing & Plan B</h1>
            </div>

            <div className="space-y-4 w-full min-w-0">
                <div className="flex flex-col space-y-2 border border-black rounded-xl px-4 pt-3 pb-2 w-full">
                    <label className="text-xs font-semibold" htmlFor="tripPrice">Trip price per seat (₦)</label>
                    <div className="text-sm py-2 px-0">
                        {localData.tripPrice ? `₦${localData.tripPrice}` : 'Price will be set automatically'}
                    </div>
                    <p className="text-xs text-gray-500">Price is automatically set based on your selected route</p>
                </div>
                <div className="flex flex-col space-y-2 border border-black rounded-xl px-4 pt-3 pb-2 w-full">
                    <label className="text-xs font-semibold" htmlFor="refundPolicy">Refund policy acknowledgement</label>
                    <div className="flex items-start space-x-2">
                        <input
                            type="checkbox"
                            id="refundPolicy"
                            checked={!!localData.refundPolicyAcknowledged}
                            onChange={(e) => {
                              setLocalData(prev => ({ ...prev, refundPolicyAcknowledged: e.target.checked }));
                              onFormDataChange('refundPolicyAcknowledged', e.target.checked);
                            }}
                            className="mt-1"
                        />
                        <p className="text-sm text-gray-600">
                            You are eligible for a full refund if you cancel your booking at least 3 days (72 hours) before the scheduled trip date.
                            Refunds will be processed within 5–7 business days to your original payment method.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col space-y-2 border border-black rounded-xl px-4 pt-3 pb-2 w-full">
                    <label className="text-xs font-semibold" htmlFor="smartFillPolicy">Smart Fill Policy Preference</label>
                    <Select 
                        value={localData.smartFillPolicy} 
                        onValueChange={(value) => {
                            setLocalData(prev => ({ ...prev, smartFillPolicy: value }));
                            onFormDataChange('smartFillPolicy', value);
                        }}
                    >
                        <SelectTrigger className="select-fixed-width text-sm">
                            <SelectValue className="select-value-fixed text-sm" placeholder="Select your smart fill policy" />
                        </SelectTrigger>
                        <SelectContent className="text-sm">
                            <SelectGroup>
                                <SelectLabel>Policy Options</SelectLabel>
                                <SelectItem value="Share cost among booked users">Share cost among booked users</SelectItem>
                                <SelectItem value="Allow offline fill-in">Allow offline fill-in</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <button 
                onClick={handleSubmit}
                className={`w-full py-3 text-center rounded-full text-white transition-colors ${isValid ? 'bg-black hover:bg-gray-800 cursor-pointer' : 'bg-gray-300 cursor-not-allowed'}`}
                disabled={loading || !isValid}
            >
                {loading ? "Processing..." : "Book your seat"}
            </button>
        </section>
    )
}