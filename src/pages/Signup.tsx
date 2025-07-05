import { useState } from "react";
import Form1 from "@/components/signup_forms/form_1";
import Form2 from "@/components/signup_forms/form_2";
import Form3 from "@/components/signup_forms/form_3";
import Form4 from "@/components/signup_forms/form_4";
import Form5 from "@/components/signup_forms/form_5";
import FormVerifyEmail from "../components/signup_forms/form_verify_email";
import { authService } from "@/services/auth";
import { useNavigate } from "react-router-dom";

// Aggregate all fields needed for registration
interface SignupFormData {
  first_name: string;
  last_name: string;
  nickname: string;
  email: string;
  password: string;
  bio: string;
  phone_number: string;
  profile_pic: string;
  intro_video: string;
  date_of_birth: string;
  vibes: string[];
  access_code: string;
}

const initialFormData: SignupFormData = {
  first_name: "",
  last_name: "",
  nickname: "",
  email: "",
  password: "",
  bio: "",
  phone_number: "",
  profile_pic: "",
  intro_video: "",
  date_of_birth: "",
  vibes: [],
  access_code: "",
};

// Minimal prop types for each form step
interface StepProps {
  formData: SignupFormData;
  onChange: (field: keyof SignupFormData, value: any) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onImageChange?: (file: File) => void;
  onSubmit?: () => void;
  loading?: boolean;
}

export default function Signup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<SignupFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const totalSteps = 6;
  const navigate = useNavigate();

  // Handle field changes
  const handleChange = (field: keyof SignupFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle image upload (base64 string only)
  const handleImageChange = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, profile_pic: typeof reader.result === 'string' ? reader.result : '' }));
    };
    reader.readAsDataURL(file);
  };

  // Navigation
  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => s - 1);

  // Final submit
  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      console.log("form data: ", formData)
      await authService.register(formData);
      setSuccess(true);
      // Clear form data after successful signup
      setFormData(initialFormData);
      // Reset to first step
      setStep(1);
      // Redirect to login page after successful signup
      setTimeout(() => {
        navigate("/login");
      }, 1500); // Give user 1.5 seconds to see the success message
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // Render step
  let content;
  const stepProps: StepProps = {
    formData,
    onChange: handleChange,
    onNext: next,
    onPrevious: prev,
    onImageChange: handleImageChange,
    onSubmit: handleSubmit,
    loading,
  };
  switch (step) {
    case 1:
      content = (
        <Form1
          formData={formData}
          onChange={(field: string, value: any) => handleChange(field as keyof SignupFormData, value)}
          onNext={next}
          loading={loading}
        />
      );
      break;
    case 2:
      content = (
        <Form2
          {...stepProps}
          onNext={next!}
          onPrevious={prev!}
          onChange={(field: string, value: any) => handleChange(field as keyof SignupFormData, value)}
        />
      );
      break;
    case 3:
      content = (
        <Form3
          formData={formData}
          onChange={(field: string, value: any) => handleChange(field as keyof SignupFormData, value)}
          onNext={next}
          onPrevious={prev}
        />
      );
      break;
    case 4:
      content = (
        <FormVerifyEmail
          formData={formData}
          onNext={next}
          onPrevious={prev}
          loading={loading}
        />
      );
      break;
    case 5:
      content = (
        <Form4
          {...stepProps}
          onChange={(field: string, value: any) => handleChange(field as keyof SignupFormData, value)}
          onImageChange={handleImageChange}
          onNext={next!}
          onPrevious={prev!}
        />
      );
      break;
    case 6:
      content = (
        <Form5
          {...stepProps}
          onChange={(field: string, value: any) => handleChange(field as keyof SignupFormData, value)}
          onSubmit={handleSubmit}
          onPrevious={prev}
        />
      );
      break;
    default:
      content = (
        <Form1
          formData={formData}
          onChange={(field: string, value: any) => handleChange(field as keyof SignupFormData, value)}
          onNext={next}
          loading={loading}
        />
      );
  }

  return (
    <main className="fixed top-0 right-0 h-screen overflow-y-auto overflow-x-hidden w-screen bg-white z-50">
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
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
        <div className="flex justify-center items-center py-2">
          <span className="text-sm text-gray-600">Step {step} of {totalSteps}</span>
        </div>
      </div>
      {/* Error/Success Messages */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[30rem]">
        {error && <div className="bg-red-100 text-red-700 rounded p-2 text-center mb-2">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 rounded p-2 text-center mb-2">Signup successful!</div>}
      </div>
      <div className="h-full flex justify-center">
        {content}
      </div>

      <div className="h-[5rem] lg:hidden"></div>
    </main>
  );
}