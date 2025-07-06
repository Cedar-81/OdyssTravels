import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/auth";
import { getAuthError } from "../utils/errorHandling";

function validateEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setValidationError(null);
        // Client-side validation
        if (!validateEmail(email)) {
            setValidationError("Please enter a valid email address.");
            return;
        }
        if (password.length < 6) {
            setValidationError("Password must be at least 6 characters.");
            return;
        }
        setLoading(true);
        try {
            const res = await authService.login({ email, password });
            console.log('Login response:', res);
            authService.setTokens(res.tokens.access_token, res.tokens.refresh_token);
            setSuccess(true);
            navigate("/");
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
                        onClick={() => navigate("/")}
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
                    <h1 className="text-xl font-semibold">Welcome back,</h1>
                </div>

                <form className="space-y-4 w-full" onSubmit={handleSubmit} noValidate>
                    <div className="flex flex-col space-y-2 border border-black rounded-xl px-4 pt-3 pb-2 w-full">
                        <label className="text-xs font-semibold" htmlFor="login-email">Email</label>
                        <Input 
                            id="login-email"
                            className="outline-none border-none text-sm focus:border-none" 
                            type="email" 
                            placeholder="e.g johnnydex@gmail.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col space-y-2 border border-black rounded-xl px-4 pt-3 pb-2 w-full">
                        <label className="text-xs font-semibold" htmlFor="login-password">Password</label>
                        <div className="relative">
                            <Input 
                                id="login-password"
                                className="outline-none border-none text-sm focus:border-none pr-10" 
                                type={showPassword ? "text" : "password"}
                                placeholder="*************"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    {validationError && <div className="text-red-500 text-sm text-center">{validationError}</div>}
                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                    {success && <div className="text-green-600 text-sm text-center">Login successful!</div>}
                    <button 
                        type="submit"
                        className="w-full cursor-pointer py-3 text-center rounded-full text-white bg-black hover:bg-gray-800 transition-colors"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                
                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <button 
                            onClick={() => navigate("/signup")}
                            className="text-black font-medium hover:underline"
                        >
                            Signup
                        </button>
                    </p>
                </div>
            </section>
        </main>
    )
}