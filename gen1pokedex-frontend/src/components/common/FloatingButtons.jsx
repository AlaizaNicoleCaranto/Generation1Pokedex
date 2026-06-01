import { Link } from 'react-router-dom';
import { useState } from 'react';
import soundService from '../../services/soundService';

// Floating Action Buttons - Bottom right corner
// Map (bottom) and Battle (above map)
const FloatingButtons = () => {
    const [showBattleTip, setShowBattleTip] = useState(false);
    const [showMapTip, setShowMapTip] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">

            {/* BATTLE BUTTON - Above map */}
            <div className="relative">
                <Link
                    to="/battle"
                    onMouseEnter={() => setShowBattleTip(true)}
                    onMouseLeave={() => setShowBattleTip(false)}
                    onClick={() => soundService.playClickSound()}
                >
                    <div className="relative transition-all duration-300 hover:scale-110">
                        <div className="absolute inset-0 bg-pixel-red/40 rounded-full animate-ping opacity-75"></div>
                        <div className="relative w-12 h-12 glass-card rounded-full flex items-center justify-center shadow-lg border-2 border-pixel-red/50 hover:border-pixel-red transition-all">
                            <span className="text-xl">⚔️</span>
                        </div>
                    </div>
                </Link>
                {showBattleTip && (
                    <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 px-2 py-1 glass-card rounded whitespace-nowrap">
                        <span className="font-pixel text-[8px] text-pixel-red">TRAIN BATTLE</span>
                    </div>
                )}
            </div>

            {/* MAP BUTTON - Bottom */}
            <div className="relative">
                <Link
                    to="/map"
                    onMouseEnter={() => setShowMapTip(true)}
                    onMouseLeave={() => setShowMapTip(false)}
                    onClick={() => soundService.playClickSound()}
                >
                    <div className="relative transition-all duration-300 hover:scale-110">
                        <div className="absolute inset-0 bg-retro-green/40 rounded-full animate-ping opacity-75"></div>
                        <div className="relative w-12 h-12 glass-card rounded-full flex items-center justify-center shadow-lg border-2 border-retro-green/50 hover:border-retro-green transition-all">
                            <span className="text-xl">🗺️</span>
                        </div>
                    </div>
                </Link>
                {showMapTip && (
                    <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 px-2 py-1 glass-card rounded whitespace-nowrap">
                        <span className="font-pixel text-[8px] text-retro-green">KANTO MAP</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FloatingButtons;