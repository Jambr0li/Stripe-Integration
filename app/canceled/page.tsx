export default function Canceled() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Payment Canceled</h1>
            <p className="text-white/70">Your subscription was not completed</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-white/90 text-sm">
                No worries! Your payment was not processed and you have not been charged.
              </p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-white/90 text-sm">
                You can try again anytime or contact support if you need assistance.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <a
              href="/"
              className="block w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 text-center"
            >
              Try Again
            </a>
            
            <a
              href="/"
              className="block w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 border border-white/20 text-center"
            >
              Back to Home
            </a>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-white/50 mb-2">Need help?</p>
            <a 
              href="mailto:support@jambroli.com" 
              className="text-white/70 hover:text-white text-sm underline"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}