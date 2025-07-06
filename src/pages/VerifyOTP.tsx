import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/auth";
import { getAuthError } from "../utils/errorHandling";

export default function VerifyOTP() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Get email from URL params if available
    const emailFromParams = searchParams.get('email');
    
    useEffect(() => {
        if (emailFromParams) {
            setEmail(emailFromParams);
        }
    }, [emailFromParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setValidationError(null);
        
        // Client-side validation
        if (!email) {
            setValidationError("Please enter your email address.");
            return;
        }
        if (!otp) {
            setValidationError("Please enter the reset code.");
            return;
        }
        
        setLoading(true);
        try {
            console.log("🔐 Verifying OTP:", { email, otp });
            await authService.verifyOTP({ email, otp });
            setSuccess(true);
            // Redirect to reset password page after 1 second
            setTimeout(() => {
                const resetUrl = `/reset-password?email=${email}&otp=${otp}`;
                console.log("🔐 Redirecting to:", resetUrl);
                navigate(resetUrl);
            }, 1000);
        } catch (err: any) {
            setError(getAuthError(err));
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (!email) {
            setValidationError("Please enter your email address first.");
            return;
        }
        
        setLoading(true);
        try {
            await authService.forgotPassword(email);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
            }, 3000);
        } catch (err: any) {
            setError(getAuthError(err));
        } finally {
            setLoading(false);
        }
    };

    return(
        <main className="fixed top-0 right-0 h-screen px-8 w-full lg:w-screen bg-white z-50">
            <section className="space-y-8 w-full lg:w-[30rem] flex flex-col items-center mx-auto mt-[5rem]">
                <div className="flex gap-2 w-full items-center">
                    <button 
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        onClick={() => navigate("/forgot-password")}
                    >
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
                    </button>
                    <h1 className="text-xl font-semibold">Enter Reset Code</h1>
                </div>

                <div className="text-center space-y-2">
                    <p className="text-sm text-gray-600">
                        Enter the reset code sent to your email address.
                    </p>
                </div>

                <form className="space-y-4 w-full" onSubmit={handleSubmit} noValidate>
                    <div className="flex flex-col space-y-2 border border-black rounded-xl px-4 pt-3 pb-2 w-full">
                        <label className="text-xs font-semibold" htmlFor="verify-email">Email</label>
                        <Input 
                            id="verify-email"
                            className="outline-none border-none text-sm focus:border-none" 
                            type="email" 
                            placeholder="e.g johnnydex@gmail.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col space-y-2 border border-black rounded-xl px-4 pt-3 pb-2 w-full">
                        <label className="text-xs font-semibold" htmlFor="verify-otp">Reset Code</label>
                        <Input 
                            id="verify-otp"
                            className="outline-none border-none text-sm focus:border-none" 
                            type="text" 
                            placeholder="Enter the 6-digit code"
                            value={otp}
                            onChange={e => setOtp(e.target.value)}
                            required
                        />
                    </div>
                    
                    {validationError && <div className="text-red-500 text-sm text-center">{validationError}</div>}
                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                    {success && (
                        <div className="text-green-600 text-sm text-center">
                            Code verified! Redirecting to password reset...
                        </div>
                    )}
                    
                    <button 
                        type="submit"
                        className="w-full cursor-pointer py-3 text-center rounded-full text-white bg-black hover:bg-gray-800 transition-colors"
                        disabled={loading}
                    >
                        {loading ? "Verifying..." : "Verify Code"}
                    </button>
                </form>
                
                <div className="text-center space-y-2">
                    <p className="text-sm text-gray-600">
                        Didn't receive the code?{" "}
                        <button 
                            onClick={handleResendOTP}
                            className="text-black font-medium hover:underline"
                            disabled={loading}
                        >
                            Resend Code
                        </button>
                    </p>
                    <p className="text-sm text-gray-600">
                        <button 
                            onClick={() => navigate("/login")}
                            className="text-black font-medium hover:underline"
                        >
                            Back to Login
                        </button>
                    </p>
                </div>
            </section>
        </main>
    )
} 