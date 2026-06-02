// Reusable pixel-style button component with retro aesthetic
// Different color variants for different actions
const PixelButton = ({
    children,
    onClick,
    variant = 'primary',
    disabled = false,
    type = 'button',
    className = ''
}) => {
    // Variant colors: primary=green, secondary=gray, danger=red, retro=brown, success=green
    const variants = {
        primary: 'bg-retro-green hover:bg-green-500 text-black border-retro-green',
        secondary: 'bg-gray-700 hover:bg-gray-600 text-white border-gray-500',
        danger: 'bg-pixel-red hover:bg-red-600 text-white border-pixel-red',
        retro: 'bg-retro-brown hover:bg-amber-700 text-retro-gold border-retro-gold',
        success: 'bg-green-700 hover:bg-green-600 text-white border-retro-green',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
        ${variants[variant]}
        px-6 py-3 font-pixel text-sm
        border-4
        shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]
        active:translate-x-[2px] active:translate-y-[2px]
        active:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]
        transition-all duration-75
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
        >
            {children}
        </button>
    );
};

export default PixelButton;