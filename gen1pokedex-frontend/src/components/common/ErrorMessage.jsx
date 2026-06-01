// Reusable error message component with retro styling
// Displays errors with optional retry button
const ErrorMessage = ({ message, onRetry, icon = '⚠️' }) => {
    return (
        <div className="bg-pixel-red/20 border-2 border-pixel-red p-6 text-center max-w-md mx-auto">
            <div className="text-4xl mb-3 animate-pulse">{icon}</div>
            <p className="font-pixel text-pixel-red text-sm mb-4">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-4 py-2 bg-pixel-red/30 hover:bg-pixel-red/50 border border-pixel-red font-pixel text-xs text-white transition-colors"
                >
                    TRY AGAIN
                </button>
            )}
        </div>
    );
};

export default ErrorMessage;