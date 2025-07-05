import { useState, useEffect } from 'react';
import Form1 from "@/components/new_trip_forms.tsx/form_1";
import Form2 from "@/components/new_trip_forms.tsx/form_2";
import Form3 from "@/components/new_trip_forms.tsx/form_3";
import Form4 from "@/components/new_trip_forms.tsx/form_4";
import Form5 from "@/components/new_trip_forms.tsx/form_5";
import ReadyTripPayment from "@/components/ready_trip_payment";
import { usersService, type CompanyRoute } from "@/services/users";
import { useNavigate } from "react-router-dom";

// Define the trip data interface
interface TripFormData {
  // Form 2 data
  vehicleType: string;
  seatCount: string;
  transportPartner: string;
  
  // Form 3 data
  departureCity: string;
  destinationCity: string;
  tripDate: Date | null;
  tripTime: string;
  selectedRouteId: string;
  selectedRoutePrice: number;
  
  // Form 4 data
  selectedVibes: string[];
  
  // Form 5 data
  tripPrice: string;
  refundPolicyAcknowledged: boolean;
  smartFillPolicy: string;
}

function validateTripForm(formData: TripFormData) {
  if (!formData.vehicleType) return "Vehicle type is required.";
  if (!formData.seatCount || isNaN(Number(formData.seatCount)) || Number(formData.seatCount) < 1) return "Number of seats must be a positive number.";
  if (!formData.transportPartner) return "Transport partner is required.";
  if (!formData.departureCity) return "Departure city is required.";
  if (!formData.destinationCity) return "Destination city is required.";
  if (!formData.tripDate) return "Trip date is required.";
  if (!formData.tripTime) return "Trip time is required.";
  if (!formData.tripPrice || isNaN(Number(formData.tripPrice)) || Number(formData.tripPrice) <= 0) return "Trip price is required and must be greater than 0.";
  if (!formData.refundPolicyAcknowledged) return "You must acknowledge the refund policy.";
  if (!formData.smartFillPolicy) return "Smart fill policy selection is required.";
  return null;
}

export default function CurateTrip() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<TripFormData>({
    vehicleType: '',
    seatCount: '',
    transportPartner: '',
    departureCity: '',
    destinationCity: '',
    tripDate: null,
    tripTime: '',
    selectedRouteId: '',
    selectedRoutePrice: 0,
    selectedVibes: [],
    tripPrice: '',
    refundPolicyAcknowledged: false,
    smartFillPolicy: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [routes, setRoutes] = useState<CompanyRoute[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [tripData, setTripData] = useState<any>(null);

  // Fetch routes on component mount
  useEffect(() => {
    usersService.getAllCompanyRoutes().then(data => {
      console.log('Fetched company routes:', data);
      setRoutes(data);
    }).catch(() => setRoutes([]));
  }, []);

  const totalSteps = 5;
  const navigate = useNavigate();

  const handleNext = () => {
    setError(null);
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setError(null);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFormDataChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (loading) return; // Prevent multiple submissions
    setError(null);
    setSuccess(false);
    const validationError = validateTripForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setLoading(true);
    
    // Get user from localStorage for creator field
    const userStr = localStorage.getItem('odyss_user');
    const user = userStr ? JSON.parse(userStr) : null;
    const creator = user?.id || '';
    
    // Prepare trip data for payment
    const preparedTripData = {
      departureLoc: formData.departureCity,
      arrivalLoc: formData.destinationCity,
      departureDate: formData.tripDate?.toISOString().split('T')[0] || '',
      arrivalDate: formData.tripDate?.toISOString().split('T')[0] || '',
      seats: Number(formData.seatCount),
      price: formData.selectedRoutePrice || Number(formData.tripPrice) || 0,
      vehicle: formData.vehicleType,
      memberIds: [],
      company: formData.transportPartner,
      departureTOD: formData.tripTime,
      creator: creator,
      fill: formData.smartFillPolicy === 'smart_fill',
      vibes: formData.selectedVibes,
      route_id: formData.selectedRouteId || ""
    };
    
    // Store trip data in localStorage for PaymentSuccess to access
    localStorage.setItem('pending_trip_data', JSON.stringify(preparedTripData));
    
    setTripData(preparedTripData);
    setShowPayment(true);
    setLoading(false);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Form1 
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <Form2 
            onNext={handleNext}
            onPrevious={handlePrevious}
            formData={formData}
            onFormDataChange={handleFormDataChange}
          />
        );
      case 3:
        return (
          <Form3 
            onNext={handleNext}
            onPrevious={handlePrevious}
            formData={formData}
            onFormDataChange={handleFormDataChange}
          />
        );
      case 4:
        return (
          <Form4 
            onNext={handleNext}
            onPrevious={handlePrevious}
            formData={formData}
            onFormDataChange={handleFormDataChange}
          />
        );
      case 5:
        return (
          <Form5 
            onSubmit={handleSubmit}
            onPrevious={handlePrevious}
            formData={formData}
            onFormDataChange={handleFormDataChange}
            loading={loading}
            routes={routes}
          />
        );
      default:
        return <Form1 onNext={handleNext} />;
    }
  };

  const userStr = typeof window !== "undefined" ? localStorage.getItem("odyss_user") : null;
  const user = userStr ? JSON.parse(userStr) : null;
  const userEmail = user?.email || "";

  return (
    <main className="fixed top-0 right-0 h-screen w-screen overflow-y-auto bg-white z-50">
      {/* Fixed Top Progress Bar and Home Button */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="flex justify-center py-2">
          <div className="group flex items-center cursor-pointer" onClick={() => navigate("/")}>
            <svg
              className="h-6 w-6 text-black transition-transform duration-200"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12L12 3l9 9" />
              <path d="M9 21V9h6v12" />
            </svg>
            <span className="ml-2 text-sm text-black font-medium opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 whitespace-nowrap overflow-hidden max-w-0 group-hover:max-w-xs">
              Go Home
            </span>
          </div>
        </div>
        <div className="w-full h-1 bg-gray-200">
          <div 
            className="h-full bg-black transition-all duration-300 ease-in-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <div className="flex justify-center items-center py-2">
          <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
        </div>
      </div>
      {/* Error/Success Messages */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-full lg:w-[30rem]">
        {error && <div className="bg-red-100 text-red-700 rounded p-2 text-center mb-2">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 rounded p-2 text-center mb-2">Trip created successfully!</div>}
      </div>

      {/* Form Container with Animation */}
      <div className="h-full flex justify-center ">
        {showPayment ? (
          <div className="animate-fadeIn">
            <div className="fixed z-50 w-screen h-screen items-center justify-center left-0 bg-black/50">
              <button 
                className="absolute top-4 right-4 text-2xl cursor-pointer font-bold text-black bg-white rounded-full px-2 z-10" 
                onClick={() => setShowPayment(false)}
              >
                &times;
              </button>
              <ReadyTripPayment 
                key="trip-payment"
                tripData={tripData} 
                email={userEmail}
              />
            </div>
          </div>
        ) : (
          <div 
            key={currentStep}
            className="animate-fadeIn w-full h-full flex items-start justify-center pt-20"
          >
            {renderStep()}
          </div>
        )}
      </div>

      <div className='h-20 lg:hidden'></div>
    </main>
  );
} 