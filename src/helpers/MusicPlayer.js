// MusicPlayer.js - Embedded Music Player (No API Keys Required!)
// Supports: YouTube, Spotify Web Player, SoundCloud, and more

// Check if MusicPlayer already exists globally
if (typeof window.MusicPlayer === 'undefined') {
    class MusicPlayer {
        constructor() {
            // Singleton pattern - ensure only one instance exists
            if (MusicPlayer.instance) {
                return MusicPlayer.instance;
            }
            MusicPlayer.instance = this;

            this.currentPlayer = null;
            this.currentService = null;
            this.isPlaying = false;
            this.volume = 50;
            this.playerContainer = null;
            this.currentVolume = 50; // Store current volume level
        
        // Pre-configured playlists for focus music
        this.focusPlaylists = {
            youtube: [
                { name: 'Lofi Hip Hop - Beats to Study', url: 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&loop=1' },
                { name: 'Deep Focus Music', url: 'https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1&loop=1' },
                { name: 'Piano Music for Studying', url: 'https://www.youtube.com/embed/CGt-rTDkMcM?autoplay=1&loop=1' },
                { name: 'Classical Music Mix', url: 'https://www.youtube.com/embed/jgpJVI3tDbY?autoplay=1&loop=1' },
                { name: 'Ambient Study Music', url: 'https://www.youtube.com/embed/lTRiuFIWV54?autoplay=1&loop=1' }
            ],
            spotify: [
                { name: 'Deep Focus', url: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ' },
                { name: 'Peaceful Piano', url: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO' },
                { name: 'Lofi Beats', url: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn' },
                { name: 'Brain Food', url: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWXLeA8Omikj7' },
                { name: 'Instrumental Study', url: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX3PFzdbtx1Us' }
            ]
        };
        
        this.customPlaylists = this.loadCustomPlaylists();
    }

    // Create embedded player iframe
    createPlayer(url, service = 'youtube') {
        const iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = service === 'youtube' ? '200px' : '152px';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '10px';
        
        // Add proper permissions for Electron/browser compatibility
        iframe.allow = 'autoplay; encrypted-media; fullscreen; accelerometer; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('scrolling', 'no');
        
        // Remove any sandbox restrictions to allow full interactivity
        // This is safe for known services like YouTube and Spotify
        
        // Format URL based on service
        let embedUrl = url;
        
        if (service === 'youtube') {
            // Check if URL is already an embed URL
            if (url.includes('/embed/')) {
                // Already embed format, just ensure it has the right parameters
                embedUrl = url;
                if (!url.includes('autoplay')) {
                    embedUrl += (url.includes('?') ? '&' : '?') + 'autoplay=1';
                }
                if (!url.includes('controls')) {
                    embedUrl += '&controls=1';
                }
                if (!url.includes('enablejsapi')) {
                    embedUrl += '&enablejsapi=1';
                }
            } else if (url.includes('youtube.com/watch?v=')) {
                // Convert regular watch URL to embed format
                const videoId = url.split('v=')[1].split('&')[0];
                embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1&rel=0`;
            } else if (url.includes('youtu.be/')) {
                // Convert short URL to embed format
                const videoId = url.split('youtu.be/')[1].split('?')[0];
                embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1&rel=0`;
            }
        } else if (service === 'spotify') {
            // Spotify URLs - check if already embed
            if (url.includes('/embed/')) {
                embedUrl = url;
            } else if (url.includes('open.spotify.com')) {
                // Convert to embed format
                const cleanUrl = url.split('?')[0];
                embedUrl = cleanUrl.replace('open.spotify.com/', 'open.spotify.com/embed/');
            }
        } else if (service === 'soundcloud') {
            // SoundCloud embed
            embedUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&auto_play=true&hide_related=true&show_comments=false&visual=true`;
        }
        
        console.log('Final embed URL:', embedUrl);
        iframe.src = embedUrl;
        this.currentPlayer = iframe;
        this.currentService = service;
        
        return iframe;
    }

    // Load player into container
    loadPlayer(url, service = 'youtube', containerId = 'music-player-container') {
        let container = document.getElementById(containerId);
        if (!container) {
            console.error('Music player container not found:', containerId);
            return null;
        }
        
        console.log(`Loading ${service} player with URL:`, url);
        
        // Store container reference for persistence
        this.playerContainer = container;
        this.containerIdUsed = containerId;
        
        // Clear existing player
        container.innerHTML = '';
        
        // Create and add new player
        const player = this.createPlayer(url, service);
        if (player) {
            container.appendChild(player);
            this.isPlaying = true;
            console.log(`${service} player iframe added to container`);
        } else {
            console.error('Failed to create player');
        }
        
        return this.currentPlayer;
    }

    // Restore player after navigation
    restorePlayer(containerId = 'music-player-container') {
        if (!this.currentPlayer || !this.isPlaying) {
            return;
        }

        const container = document.getElementById(containerId);
        if (!container) {
            return;
        }

        // Clear and restore player
        container.innerHTML = '';
        container.appendChild(this.currentPlayer);
        this.playerContainer = container;
        this.containerIdUsed = containerId;
    }

    // Stop/Remove player
    stop() {
        console.log('Stopping music player');
        
        // Clear from stored container
        if (this.playerContainer) {
            this.playerContainer.innerHTML = '';
        }
        
        this.currentPlayer = null;
        this.isPlaying = false;
        this.playerContainer = null;
        
        console.log('Music player stopped and cleared');
    }

    // Detect service from URL
    detectService(url) {
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            return 'youtube';
        } else if (url.includes('spotify.com')) {
            return 'spotify';
        } else if (url.includes('soundcloud.com')) {
            return 'soundcloud';
        }
        return 'youtube'; // default
    }

    // Get all playlists (preset + custom)
    getAllPlaylists() {
        return {
            youtube: [...this.focusPlaylists.youtube, ...this.customPlaylists.youtube],
            spotify: [...this.focusPlaylists.spotify, ...this.customPlaylists.spotify]
        };
    }

    // Add custom playlist
    addCustomPlaylist(name, url, service) {
        console.log('Adding custom playlist:', { name, url, service });
        
        if (!this.customPlaylists[service]) {
            this.customPlaylists[service] = [];
            console.log(`Created new array for service: ${service}`);
        }
        
        // Check if playlist already exists
        const exists = this.customPlaylists[service].find(p => p.url === url);
        if (exists) {
            console.warn('Playlist already exists:', url);
            return false;
        }
        
        this.customPlaylists[service].push({ name, url });
        console.log(`Custom playlists for ${service}:`, this.customPlaylists[service]);
        
        this.saveCustomPlaylists();
        console.log('Custom playlists saved to localStorage');
        
        return true;
    }

    // Remove custom playlist
    removeCustomPlaylist(url, service) {
        if (this.customPlaylists[service]) {
            this.customPlaylists[service] = this.customPlaylists[service].filter(p => p.url !== url);
            this.saveCustomPlaylists();
        }
    }

    // Save custom playlists to localStorage
    saveCustomPlaylists() {
        if (typeof window !== 'undefined' && window.localStorage) {
            try {
                const data = JSON.stringify(this.customPlaylists);
                localStorage.setItem('customMusicPlaylists', data);
                console.log('Saved custom playlists to localStorage:', this.customPlaylists);
            } catch (e) {
                console.error('Error saving custom playlists:', e);
            }
        }
    }

    // Load custom playlists from localStorage
    loadCustomPlaylists() {
        if (typeof window !== 'undefined' && window.localStorage) {
            const saved = localStorage.getItem('customMusicPlaylists');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    console.log('Loaded custom playlists from localStorage:', parsed);
                    return parsed;
                } catch (e) {
                    console.error('Error loading custom playlists:', e);
                }
            }
        }
        console.log('No custom playlists found, returning empty object');
        return { youtube: [], spotify: [], soundcloud: [] };
    }

    // Check if player is currently playing
    isCurrentlyPlaying() {
        return this.isPlaying && this.currentPlayer !== null;
    }

    // Get current service
    getCurrentService() {
        return this.currentService;
    }

    // Set volume for the music player
    setVolume(volumePercent) {
        this.currentVolume = volumePercent;
        console.log(`Setting music player volume to ${volumePercent}%`);
        
        if (!this.currentPlayer) {
            console.log('No active player to set volume');
            return;
        }

        try {
            if (this.currentService === 'youtube') {
                // For YouTube, we need to use postMessage API
                const command = {
                    event: 'command',
                    func: 'setVolume',
                    args: [volumePercent]
                };
                this.currentPlayer.contentWindow?.postMessage(JSON.stringify(command), '*');
                console.log('YouTube volume command sent');
            } else if (this.currentService === 'spotify') {
                // Spotify embeds don't support volume control via API
                // The user must use the player's built-in controls
                console.log('Spotify volume cannot be controlled programmatically - use player controls');
            }
        } catch (error) {
            console.error('Error setting volume:', error);
        }
    }

    // Get singleton instance
    static getInstance() {
        if (!MusicPlayer.instance) {
            MusicPlayer.instance = new MusicPlayer();
        }
        return MusicPlayer.instance;
    }
}

    // Create singleton instance
    const musicPlayerInstance = MusicPlayer.getInstance();

    // Make it available globally
    if (typeof window !== 'undefined') {
        window.MusicPlayer = musicPlayerInstance;
    }

    // Export for use in other modules
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = MusicPlayer;
    }
} // End of check for existing MusicPlayer
