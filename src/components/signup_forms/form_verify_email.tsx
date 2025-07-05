import { useState } from "react";
import { authService } from "@/services/auth";
import { getVerificationError } from "../../utils/errorHandling";

export interface FormVerifyEmailProps {
  formData: any;
  onNext: () => void;
  onPrevious: () => void;
  loading?: boolean;
}

const FormVerifyEmail = ({ formData, onNext, onPrevious, loading }: FormVerifyEmailProps) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) {
      setError("Please enter the verification code.");
      return;
    }
    setError("");
    setVerifying(true);
    try {
      await authService.verifyOTP({ email: formData.email, otp: code });
      onNext();
    } catch (err: any) {
      setError(getVerificationError(err));
    } finally {
      setVerifying(false);
    }
  };

  return (
    <section className="space-y-6 w-full px-8 lg:px-0 lg:w-[30rem] flex flex-col items-center mx-auto mt-[5rem]">
      <form className="space-y-4 w-full" onSubmit={handleSubmit}>
        <h2 className="text-lg font-semibold text-center">Verify your email</h2>
        <p className="text-xs text-center text-gray-500">We sent a verification code to <span className="font-semibold">{formData.email}</span>. Enter it below to continue.</p>
        <input
          className="outline-none border border-black rounded-xl px-4 py-2 w-full text-sm"
          type="text"
          placeholder="Verification code"
          value={code}
          onChange={e => setCode(e.target.value)}
          disabled={loading || verifying}
        />
        {error && <div className="text-xs text-red-500 text-center">{error}</div>}
        <div className="flex justify-between mt-4">
          <button
            type="button"
            className="text-sm px-4 py-2 rounded-full border border-black"
            onClick={onPrevious}
            disabled={loading || verifying}
          >
            Back
          </button>
          <button
            type="submit"
            className="text-sm px-6 py-2 rounded-full bg-black text-white"
            disabled={loading || verifying}
          >
            {verifying ? "Verifying..." : "Continue"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default FormVerifyEmail; 