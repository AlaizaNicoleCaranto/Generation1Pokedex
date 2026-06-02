// Pokeball loading spinner - Uses retro animated Pokeball GIF
const LoadingSpinner = ({ fullScreen = false }) => {
    return (
        <div className={`flex flex-col items-center justify-center ${fullScreen ? 'min-h-screen' : 'min-h-[150px]'} animate-fadeIn`}>
            {/* Retro Animated Pokeball GIF */}
            <img
                src="https://i.pinimg.com/originals/c0/10/bc/c010bc675a8ce64d9a541657a9171b6d.gif"
                alt="Loading..."
                className="w-24 h-24 md:w-32 md:h-32 mb-4"
            />
            <p className="font-pixel text-sm md:text-base text-retro-green animate-pulse">
                LOADING...
            </p>
        </div>
    );
};

export default LoadingSpinner;
