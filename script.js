/*
   Optimized for iPhone - Love Letter Website
*/

// =============================================
// MUSIC PLAYER SYSTEM - iPhone Optimized
// =============================================

// Your local music tracks
const musicTracks = [
    {
        title: "I Love You",
        url: "pfguitar.mp3",
        artist: "For You"
    }
];

let currentTrackIndex = 0;
const audioPlayer = document.getElementById('backgroundMusic');
const musicButton = document.getElementById('musicButton');

// =============================================
// DETECT IPHONE/IPAD
// =============================================
function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

// =============================================
// IPHONE-SPECIFIC MUSIC INITIALIZATION
// =============================================
function initializeMusicPlayer() {
    console.log("🎵 Initializing music player for", isIOS() ? "iOS" : "Desktop");
    
    // Set volume (iPhone will use system volume)
    audioPlayer.volume = 0.7; // Higher for mobile
    
    // Load first track
    loadTrack(currentTrackIndex);
    
    // iPhone-specific setup
    if (isIOS()) {
        setupIOSMusicPlayer();
    } else {
        setupDesktopMusicPlayer();
    }
}

// =============================================
// IPHONE-SPECIFIC SETUP
// =============================================
function setupIOSMusicPlayer() {
    console.log("Setting up iOS-optimized music player");
    
    // iPhone: NEVER try auto-play - it will fail
    musicButton.innerHTML = '🎵 Tap to Play';
    musicButton.style.fontSize = '16px'; // Larger text for touch
    
    // iPhone needs user gesture for audio context
    // We'll enable audio on first tap
    let audioEnabled = false;
    
    const enableAudio = () => {
        if (!audioEnabled) {
            // Create a silent audio buffer to unlock audio
            const silentAudio = new Audio();
            silentAudio.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
            silentAudio.play().then(() => {
                console.log("✅ iOS audio unlocked");
                audioEnabled = true;
                
                // Now our real audio can play
                audioPlayer.play().then(() => {
                    audioPlayer.pause(); // Start paused but ready
                    musicButton.innerHTML = '▶️ Play Music';
                });
            }).catch(e => {
                console.log("iOS audio unlock failed (normal)");
            });
        }
    };
    
    // Enable audio on ANY touch
    document.addEventListener('touchstart', enableAudio, { once: true });
    
    // Also enable on button click
    musicButton.addEventListener('click', enableAudio);
}

// =============================================
// DESKTOP SETUP
// =============================================
function setupDesktopMusicPlayer() {
    console.log("Setting up desktop music player");
    
    // Try auto-play (will fail on some browsers)
    tryAutoPlay();
    
    // When track ends, play next
    audioPlayer.addEventListener('ended', playNextTrack);
}

// =============================================
// FUNCTION: Load a specific track
// =============================================
function loadTrack(trackIndex) {
    if (trackIndex < 0 || trackIndex >= musicTracks.length) return;
    
    currentTrackIndex = trackIndex;
    const track = musicTracks[trackIndex];
    
    // For iPhone: Preload the audio
    audioPlayer.src = track.url;
    audioPlayer.load(); // Important for iOS
    
    // Simple button text for iPhone
    if (isIOS()) {
        musicButton.innerHTML = audioPlayer.paused ? '▶️ Play' : '⏸️ Pause';
    } else {
        musicButton.innerHTML = `🎵 ${track.title}`;
    }
    
    console.log(`Loaded: ${track.title}`);
}

// =============================================
// FUNCTION: Play or pause music (iPhone Optimized)
// =============================================
function toggleMusic() {
    console.log("Toggle music called on", isIOS() ? "iOS" : "Desktop");
    
    if (!audioPlayer.paused) {
        // Pause the music
        audioPlayer.pause();
        musicButton.innerHTML = isIOS() ? '▶️ Play' : '▶️ Play Music';
        console.log("Music paused");
    } else {
        // Play the music
        audioPlayer.play().then(() => {
            if (isIOS()) {
                musicButton.innerHTML = '⏸️ Pause';
            } else {
                const track = musicTracks[currentTrackIndex];
                musicButton.innerHTML = `⏸️ ${track.title}`;
            }
            console.log("Now playing on", isIOS() ? "iPhone" : "Desktop");
            
            // iPhone: Lock screen media controls
            if (isIOS() && 'mediaSession' in navigator) {
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: "I Love You",
                    artist: "For You",
                    artwork: [
                        { src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiBmaWxsPSIjOGIwMDAwIi8+CjxwYXRoIGQ9Ik0yNTYgMzY4QzMyMS4zIDM2OCAzNzYgMzEzLjMgMzc2IDI0OEMzNzYgMTgyLjcgMzIxLjMgMTI4IDI1NiAxMjhDMTkwLjcgMTI4IDEzNiAxODIuNyAxMzYgMjQ4QzEzNiAzMTMuMyAxOTAuNyAzNjggMjU2IDM2OFoiIGZpbGw9IiNGRjMzNjYiLz4KPHBhdGggZD0iTTI1NiAyMjRDMjcwLjkgMjI0IDI4OCAyMDYuOSAyODggMTkyQzI4OCAxNzcuMSAyNzAuOSAxNjAgMjU2IDE2MEMyNDEuMSAxNjAgMjI0IDE3Ny4xIDIyNCAxOTJDMjI0IDIwNi45IDI0MS4xIDIyNCAyNTYgMjI0WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+', sizes: '512x512', type: 'image/svg+xml' }
                    ]
                });
            }
        }).catch(error => {
            console.log("Play failed:", error.message);
            
            // iPhone-specific error handling
            if (isIOS()) {
                musicButton.innerHTML = '🔇 Tap Screen First';
                musicButton.style.backgroundColor = 'rgba(139, 0, 0, 0.5)';
                
                // Show help message
                setTimeout(() => {
                    alert("iPhone Tip: Tap anywhere on screen first, then tap play button.");
                }, 500);
            }
        });
    }
}

// =============================================
// FUNCTION: Try to auto-play (Desktop only)
// =============================================
function tryAutoPlay() {
    if (isIOS()) {
        // Never auto-play on iPhone
        musicButton.innerHTML = '🎵 Tap to Play';
        return;
    }
    
    audioPlayer.play().then(() => {
        console.log("Auto-play successful");
        const track = musicTracks[currentTrackIndex];
        musicButton.innerHTML = `⏸️ ${track.title}`;
    }).catch(error => {
        console.log("Auto-play blocked (normal)");
        musicButton.innerHTML = '▶️ Play Music';
    });
}

// =============================================
// FUNCTION: Play next track
// =============================================
function playNextTrack() {
    if (isIOS()) return; // Simple player for iPhone
    
    let nextIndex = currentTrackIndex + 1;
    if (nextIndex >= musicTracks.length) nextIndex = 0;
    
    loadTrack(nextIndex);
    audioPlayer.play();
}

// =============================================
// IPHONE TOUCH-OPTIMIZED ANIMATIONS
// =============================================
function addFadeAnimations() {
    const sections = document.querySelectorAll('.letter-section');
    
    // Use requestAnimationFrame for smooth iOS animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                requestAnimationFrame(() => {
                    entry.target.classList.add('visible');
                    console.log(`Section visible on ${isIOS() ? 'iPhone' : 'Desktop'}`);
                });
            }
        });
    }, {
        threshold: 0.05, // Lower threshold for mobile
        rootMargin: '50px' // Trigger earlier on scroll
    });
    
    sections.forEach(section => {
        // iOS-optimized animations
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        section.style.willChange = 'opacity, transform'; // iOS performance hint
        
        observer.observe(section);
    });
    
    // Add animation CSS
    const style = document.createElement('style');
    style.textContent = `
        .letter-section.visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        /* Better touch targets for iPhone */
        .music-button {
            min-height: 44px; /* Apple's minimum touch target */
            min-width: 44px;
            padding: 12px 24px;
            font-size: 16px; /* Readable on mobile */
        }
        
        /* Prevent text selection on tap (iOS) */
        .letter-section {
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
            user-select: none;
        }
        
        /* Allow text selection in paragraphs */
        .letter-section p {
            user-select: text;
            -webkit-user-select: text;
        }
    `;
    document.head.appendChild(style);
}

// =============================================
// UPDATE COPYRIGHT YEAR
// =============================================
function updateCopyrightYear() {
    const currentYear = new Date().getFullYear();
    let copyrightElement = document.querySelector('.copyright-year');
    
    if (!copyrightElement) {
        copyrightElement = document.createElement('p');
        copyrightElement.className = 'copyright-year';
        copyrightElement.style.color = '#666';
        copyrightElement.style.fontSize = '0.9rem';
        copyrightElement.style.marginTop = '10px';
        copyrightElement.style.textAlign = 'center';
        
        const footer = document.querySelector('.footer');
        if (footer) {
            footer.appendChild(copyrightElement);
        }
    }
    
    copyrightElement.textContent = `© ${currentYear} • Made with love`;
}

// =============================================
// IPHONE ORIENTATION & RESIZE HANDLING
// =============================================
function setupIOSResponsive() {
    if (!isIOS()) return;
    
    // Handle iPhone rotation
    window.addEventListener('resize', () => {
        console.log(`iPhone orientation: ${window.innerWidth}x${window.innerHeight}`);
    });
    
    // Prevent zoom on double-tap
    document.addEventListener('touchstart', (e) => {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Better scrolling on iOS
    document.addEventListener('touchmove', (e) => {
        // Allow natural scrolling
    }, { passive: true });
}

// =============================================
// MAIN INITIALIZATION
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log("Website loading on", isIOS() ? "iPhone" : "Desktop");
    
    // 1. Set up music player (iPhone-optimized)
    initializeMusicPlayer();
    
    // 2. Add click event to music button
    musicButton.addEventListener('click', toggleMusic);
    
    // 3. Add iPhone touch event for audio unlock
    if (isIOS()) {
        document.addEventListener('touchstart', () => {
            // This helps unlock audio on iOS
        }, { once: true });
    }
    
    // 4. Add animations
    addFadeAnimations();
    
    // 5. Update copyright year
    updateCopyrightYear();
    
    // 6. iPhone-specific setup
    setupIOSResponsive();
    
    // 7. Add visual feedback for iPhone
    if (isIOS()) {
        musicButton.style.cursor = 'pointer';
        musicButton.style.webkitTapHighlightColor = 'rgba(139, 0, 0, 0.3)';
    }
    
    console.log("✅ Website ready for", isIOS() ? "iPhone" : "Desktop");
});

// =============================================
// VOLUME CONTROL (Desktop only)
// =============================================
function setMusicVolume(volume) {
    if (isIOS()) {
        console.log("On iPhone, use device volume buttons");
        return;
    }
    
    if (volume >= 0 && volume <= 1) {
        audioPlayer.volume = volume;
        console.log(`Volume set to: ${volume * 100}%`);
    }
}


// Make available globally
window.setMusicVolume = setMusicVolume;

// =============================================
// IPHONE DEBUG INFO (Remove before final)
// =============================================
if (isIOS()) {
    console.log("📱 Running on iOS Device");
    console.log("User Agent:", navigator.userAgent);
    console.log("Screen:", window.screen.width, "x", window.screen.height);
}

