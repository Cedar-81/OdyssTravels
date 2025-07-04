import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { paymentsService } from '@/services/payments';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Extract reference from URL parameters
        const reference = searchParams.get('reference');
        
        if (!reference) {
          setError('No payment reference found in URL');
          setLoading(false);
          return;
        }

        console.log('Verifying payment with reference:', reference);

        // Call the verifyJoinTripPayment service
        const result = await paymentsService.verifyJoinTripPayment({ reference });
        
        if (result.status === 'success') {
          setSuccess(true);
          console.log('Payment verification successful:', result);
        } else {
          setError(result.message || 'Payment verification failed');
        }
      } catch (err: any) {
        console.error('Payment verification error:', err);
        setError(err?.response?.data?.message || err?.message || 'Payment verification failed');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  const handleContinue = () => {
    navigate('/rides');
  };

  if (loading) {
    return (
      <main className="fixed top-0 right-0 h-screen w-screen bg-white z-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="text-lg font-medium">Verifying your payment...</p>
          <p className="text-sm text-gray-600">Please wait while we confirm your transaction</p>
        </div>
      </main>
    );
  }

  return (
    <main className="fixed top-0 right-0 h-screen w-screen bg-white z-50 flex items-center justify-center">
      <div className="w-full max-w-md px-6 py-8 text-center space-y-6">
        {success ? (
          <>
            {/* Success Icon */}
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">Payment Successful!</h1>
              <p className="text-gray-600">
                Your trip booking has been confirmed. You're now a member of this trip!
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                You'll receive a confirmation email shortly with all the trip details.
              </p>
            </div>

            <button
              onClick={handleContinue}
              className="w-full bg-black text-white py-3 px-6 rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              Continue to Rides
            </button>
          </>
        ) : (
          <>
            {/* Error Icon */}
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">Payment Verification Failed</h1>
              <p className="text-gray-600">
                {error || 'There was an issue verifying your payment. Please contact support if you believe this is an error.'}
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                If you were charged but see this error, please contact our support team with your payment reference.
              </p>
            </div>

            <button
              onClick={handleContinue}
              className="w-full bg-black text-white py-3 px-6 rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              Return to Rides
            </button>
          </>
        )}
      </div>
    </main>
  );
} 