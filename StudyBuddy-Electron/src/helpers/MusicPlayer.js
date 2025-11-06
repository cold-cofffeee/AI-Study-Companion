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
        iframe.allow = 'autoplay; encrypted-media';
        iframe.allowFullscreen = true;
        
        // Format URL based on service
        let embedUrl = url;
        
        if (service === 'youtube') {
            // Convert regular YouTube URLs to embed format
            if (url.includes('youtube.com/watch?v=')) {
                const videoId = url.split('v=')[1].split('&')[0];
                embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}`;
            } else if (url.includes('youtu.be/')) {
                const videoId = url.split('youtu.be/')[1].split('?')[0];
                embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}`;
            } else if (!url.includes('embed')) {
                embedUrl = url.replace('youtube.com/', 'youtube.com/embed/');
            }
        } else if (service === 'spotify') {
            // Convert Spotify URLs to embed format
            if (url.includes('open.spotify.com') && !url.includes('embed')) {
                // Remove query parameters like ?si=xxx
                const cleanUrl = url.split('?')[0];
                embedUrl = cleanUrl.replace('open.spotify.com/', 'open.spotify.com/embed/');
            }
        } else if (service === 'soundcloud') {
            // SoundCloud embed
            embedUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&auto_play=true&hide_related=true&show_comments=false`;
        }
        
        iframe.src = embedUrl;
        this.currentPlayer = iframe;
        this.currentService = service;
        
        return iframe;
    }

    // Load player into container
    loadPlayer(url, service = 'youtube', containerId = 'music-player-wrapper') {
        let container = document.getElementById(containerId);
        if (!container) {
            console.error('Music player container not found:', containerId);
            return null;
        }
        
        // Store container reference for persistence
        this.playerContainer = container;
        this.containerIdUsed = containerId;
        
        // Clear existing player
        container.innerHTML = '';
        
        // Create and add new player
        const player = this.createPlayer(url, service);
        container.appendChild(player);
        
        this.isPlaying = true;
        
        // Show persistent container if using the persistent wrapper
        if (containerId === 'music-player-wrapper') {
            const persistentContainer = document.getElementById('persistent-music-container');
            if (persistentContainer) {
                persistentContainer.style.display = 'block';
            }
        }
        
        return player;
    }

    // Restore player after navigation
    restorePlayer(containerId = 'music-player-wrapper') {
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
        
        // Show persistent container
        if (containerId === 'music-player-wrapper') {
            const persistentContainer = document.getElementById('persistent-music-container');
            if (persistentContainer) {
                persistentContainer.style.display = 'block';
            }
        }
    }

    // Stop/Remove player
    stop() {
        // Clear from stored container
        if (this.playerContainer) {
            this.playerContainer.innerHTML = '';
        }
        
        // Hide persistent container
        const persistentContainer = document.getElementById('persistent-music-container');
        if (persistentContainer) {
            persistentContainer.style.display = 'none';
        }
        
        this.currentPlayer = null;
        this.isPlaying = false;
        this.playerContainer = null;
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
        if (!this.customPlaylists[service]) {
            this.customPlaylists[service] = [];
        }
        
        this.customPlaylists[service].push({ name, url });
        this.saveCustomPlaylists();
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
            localStorage.setItem('customMusicPlaylists', JSON.stringify(this.customPlaylists));
        }
    }

    // Load custom playlists from localStorage
    loadCustomPlaylists() {
        if (typeof window !== 'undefined' && window.localStorage) {
            const saved = localStorage.getItem('customMusicPlaylists');
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch (e) {
                    console.error('Error loading custom playlists:', e);
                }
            }
        }
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
