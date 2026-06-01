// Sound Service - Handles background music and Pokemon cries
class SoundService {
    constructor() {
        this.backgroundMusic = null;
        this.musicEnabled = true;
        this.sfxEnabled = true;
        this.currentBgMusic = null;
        this.userInteracted = false; // Track user interaction for autoplay
    }

    // Start background music for landing page
    startLandingMusic() {
        if (!this.musicEnabled) return;

        // Stop existing music if any
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic = null;
        }

        this.backgroundMusic = new Audio('/background.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.3;

        // Try to play immediately
        const playPromise = this.backgroundMusic.play();

        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Autoplay prevented - wait for user click
                console.log('Autoplay prevented, waiting for user interaction');
                const playOnClick = () => {
                    this.backgroundMusic?.play().catch(e => console.log('Still blocked'));
                    document.removeEventListener('click', playOnClick);
                    document.removeEventListener('keydown', playOnClick);
                };
                document.addEventListener('click', playOnClick, { once: true });
                document.addEventListener('keydown', playOnClick, { once: true });
            });
        }
    }

    // Start background music for game pages
    startGameMusic() {
        this.startLandingMusic();
    }

    // Start background music (alias for protected pages)
    startBackgroundMusic() {
        this.startLandingMusic();
    }

    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        if (this.musicEnabled) {
            this.startBackgroundMusic();
        } else {
            this.stopBackgroundMusic();
        }
        return this.musicEnabled;
    }

    // ========== POKEMON CRIES ==========
    playPokemonCry(pokemonId) {
        if (!this.sfxEnabled) return;
        const audio = new Audio();
        // Try multiple cry URLs for reliability
        audio.src = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemonId}.ogg`;
        audio.volume = 0.5;
        audio.play().catch(() => {
            // Fallback to different URL format
            audio.src = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/legacy/${pokemonId}.ogg`;
            audio.play().catch(e => console.log(`Cry not available for #${pokemonId}`));
        });
    }

    // ========== BATTLE SOUND EFFECTS ==========
    playAttackSound() { this.playBeep(520, 0.2, 0.5); }
    playHitSound() { this.playBeep(180, 0.15, 0.3); }
    playLevelUpSound() { this.playBeep(880, 0.2, 0.8); }
    playWinSound() { this.playBeep(660, 0.25, 1.2); }
    playCatchSound() { this.playBeep(440, 0.2, 0.6); }
    playClickSound() { this.playBeep(800, 0.1, 0.15); }

    playBeep(frequency, volume, duration) {
        if (!this.sfxEnabled) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = frequency;
            gain.gain.value = volume;
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
            setTimeout(() => ctx.close(), duration * 1000);
        } catch (e) { }
    }

    toggleSfx() {
        this.sfxEnabled = !this.sfxEnabled;
        return this.sfxEnabled;
    }

    getMusicState() { return this.musicEnabled; }
    getSfxState() { return this.sfxEnabled; }
}

export default new SoundService();