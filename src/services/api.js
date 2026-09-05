/**
 * Centralized API Service Layer
 * Handles all backend communication with proper error handling, authentication, and loading states
 */

const SERVER_URL =
  import.meta && import.meta.env && import.meta.env.VITE_SERVER_URL
    ? import.meta.env.VITE_SERVER_URL
    : "http://localhost:5000";

/**
 * Get the access token from cookies
 */
const getAccessToken = () => {
  const match = document.cookie.match(new RegExp("(^| )access_token=([^;]+)"));
  return match ? match[2] : null;
};

/**
 * Generic API request handler with error handling and authentication
 */
async function apiRequest(endpoint, options = {}) {
  const token = getAccessToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${SERVER_URL}${endpoint}`, config);
    
    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      // Clear token and redirect to login
      document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = "/";
      throw new Error("Session expired. Please log in again.");
    }

    // Handle other error statuses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

/**
 * Authentication API
 */
export const authAPI = {
  /**
   * Login with email and password
   */
  async login(email, password) {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const response = await apiRequest("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    // Store token in cookies
    if (response.access_token) {
      const maxAge = 24 * 60 * 60; // 1 day
      document.cookie = `access_token=${response.access_token}; path=/; max-age=${maxAge}; SameSite=Lax`;
    }

    return response;
  },

  /**
   * Register new user
   */
  async register(username, email, password) {
    const response = await apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    });

    return response;
  },

  /**
   * Google OAuth authentication
   */
  async googleAuth(token) {
    const response = await apiRequest("/api/auth/google", {
      method: "POST",
      body: JSON.stringify({ token }),
    });

    // Store token in cookies
    if (response.access_token) {
      const maxAge = 24 * 60 * 60; // 1 day
      document.cookie = `access_token=${response.access_token}; path=/; max-age=${maxAge}; SameSite=Lax`;
    }

    return response;
  },

  /**
   * Logout - clear token from cookies
   */
  logout() {
    document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!getAccessToken();
  },
};

/**
 * Story API
 */
export const storyAPI = {
  /**
   * Generate a new story
   */
  async generateStory(storyData) {
    const response = await apiRequest("/api/generate-story", {
      method: "POST",
      body: JSON.stringify(storyData),
    });

    return response;
  },

  /**
   * Get user's story history
   */
  async getMyStories() {
    return await apiRequest("/api/my-stories");
  },

  /**
   * Delete a story
   */
  async deleteStory(storyId) {
    return await apiRequest(`/api/my-stories/${storyId}`, {
      method: "DELETE",
    });
  },

  /**
   * Generate speech audio for text
   */
  async generateSpeech(text) {
    const token = getAccessToken();
    const response = await fetch(`${SERVER_URL}/api/generate-speech`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate speech");
    }

    return await response.blob();
  },
};

/**
 * Playlist API
 */
export const playlistAPI = {
  /**
   * Get user's playlists
   */
  async getMyPlaylists() {
    return await apiRequest("/api/playlists");
  },

  /**
   * Create a new playlist
   */
  async createPlaylist(name) {
    return await apiRequest("/api/playlists", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  },

  /**
   * Add story to playlist
   */
  async addStoryToPlaylist(playlistId, storyId) {
    return await apiRequest(`/api/playlists/${playlistId}/add/${storyId}`, {
      method: "POST",
    });
  },
};

/**
 * Payments API
 */
export const paymentsAPI = {
  /**
   * Get subscription status
   */
  async getStatus() {
    return await apiRequest("/api/payments/status");
  },

  /**
   * Create checkout session
   */
  async createCheckoutSession(tier) {
    return await apiRequest("/api/payments/create-checkout-session", {
      method: "POST",
      body: JSON.stringify({ tier }),
    });
  },
};

/**
 * Health check
 */
export const healthAPI = {
  async check() {
    return await apiRequest("/api/health");
  },
};

export default {
  auth: authAPI,
  story: storyAPI,
  playlist: playlistAPI,
  payments: paymentsAPI,
  health: healthAPI,
};