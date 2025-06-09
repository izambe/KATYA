// js/app.js
// Main application logic: initializes the app, sets up event listeners,
// and coordinates between ApiClient and UIManager.

/**
 * @namespace App
 * @description Main application controller.
 */
const App = {
    /**
     * @property {object|null} currentUser - Stores the currently logged-in user object.
     *                                      Example: { id: "user123", name: "Test User", email: "user@example.com" }
     */
    currentUser: null,
    /**
     * @property {Array<object>} userFavorites - Stores the current user's favorite products.
     *                                         Example: [{ id: "prod1", name: "Product 1" }, ...]
     */
    userFavorites: [],

    /**
     * Initializes the application.
     * Sets up initial UI state and event listeners.
     */
    init: function() {
        this.setupEventListeners();
        UIManager.populateFilters(); // UIManager calls ApiClient directly for this
        UIManager.updateLoginDisplay(this.currentUser, this.handleLogout.bind(this));
        UIManager.renderRecommendations(this.currentUser, this.userFavorites);
        UIManager.toggleProfileSection(!!this.currentUser);
         // Initial render of favorites (will be empty if not logged in)
        UIManager.renderFavoriteProducts(this.userFavorites, this.currentUser, this.handleRemoveFavorite.bind(this));
    },

    /**
     * Sets up all global event listeners for the application.
     */
    setupEventListeners: function() {
        // Search functionality
        const searchInput = document.getElementById('search-input');
        const searchButton = document.getElementById('search-button');
        if (searchButton) searchButton.addEventListener('click', () => this.handleSearch());
        if (searchInput) searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });

        // Filter changes
        const filterElements = [
            document.getElementById('category-filter'),
            document.getElementById('brand-filter'),
            document.getElementById('min-price'),
            document.getElementById('max-price')
        ];
        filterElements.forEach(el => {
            if (el) el.addEventListener('change', () => this.handleSearch());
        });

        // Modal Authentication
        const userAccountLink = document.querySelector('.user-account a');
        const closeAuthModalBtn = document.getElementById('close-auth-modal');
        const loginBtn = document.getElementById('login-btn');
        const registerBtn = document.getElementById('register-btn');
        const authModal = document.getElementById('auth-modal');


        if (userAccountLink) userAccountLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (!this.currentUser) {
                UIManager.toggleAuthModal(true);
            } else {
                UIManager.toggleProfileSection(true); // Show profile if user clicks their name
            }
        });
        if (closeAuthModalBtn) closeAuthModalBtn.addEventListener('click', () => UIManager.toggleAuthModal(false));
        if (loginBtn) loginBtn.addEventListener('click', () => this.handleLogin());
        if (registerBtn) registerBtn.addEventListener('click', () => this.handleRegister());

        // Close auth modal on outside click
        if (authModal) window.addEventListener('click', (e) => {
            if (e.target === authModal) {
                UIManager.toggleAuthModal(false);
            }
        });
    },

    /**
     * Handles the search functionality.
     * Retrieves query and filter values, calls ApiClient, and renders results via UIManager.
     * @async
     */
    handleSearch: async function() {
        const searchInput = document.getElementById('search-input');
        const query = searchInput.value.trim();

        const category = document.getElementById('category-filter').value;
        const brand = document.getElementById('brand-filter').value;
        const minPrice = document.getElementById('min-price').value;
        const maxPrice = document.getElementById('max-price').value;

        const filters = {
            category: category || undefined,
            brand: brand || undefined,
            minPrice: minPrice || undefined,
            maxPrice: maxPrice || undefined
        };

        const results = await ApiClient.fetchProductPrices(query, filters);
        UIManager.renderSearchResults(results, query, this.currentUser, this.handleAddFavorite.bind(this));
    },

    /**
     * Handles user login.
     * @async
     */
    handleLogin: async function() {
        const emailInput = document.getElementById('auth-email');
        const passwordInput = document.getElementById('auth-password');
        UIManager.showAuthMessage('Вход...');

        const response = await ApiClient.loginUser(emailInput.value, passwordInput.value);
        if (response.success) {
            this.currentUser = response.user;
            UIManager.showAuthMessage(`Добро пожаловать, ${this.currentUser.name}!`);
            await this.loadUserData(); // Load user-specific data
            UIManager.updateLoginDisplay(this.currentUser, this.handleLogout.bind(this));
            UIManager.toggleProfileSection(true);
            setTimeout(() => UIManager.toggleAuthModal(false), 1000);
        } else {
            UIManager.showAuthMessage(response.message || 'Ошибка входа.', true);
        }
    },

    /**
     * Handles user registration.
     * @async
     */
    handleRegister: async function() {
        const emailInput = document.getElementById('auth-email');
        const passwordInput = document.getElementById('auth-password');
        UIManager.showAuthMessage('Регистрация...');

        const response = await ApiClient.registerUser(emailInput.value, passwordInput.value);
        if (response.success) {
            this.currentUser = response.user;
            UIManager.showAuthMessage(`Регистрация успешна, ${this.currentUser.name}!`);
            await this.loadUserData();
            UIManager.updateLoginDisplay(this.currentUser, this.handleLogout.bind(this));
            UIManager.toggleProfileSection(true);
            setTimeout(() => UIManager.toggleAuthModal(false), 1000);
        } else {
            UIManager.showAuthMessage(response.message || 'Ошибка регистрации.', true);
        }
    },

    /**
     * Handles user logout.
     */
    handleLogout: function() {
        this.currentUser = null;
        this.userFavorites = [];
        UIManager.updateLoginDisplay(null, this.handleLogout.bind(this)); // Pass null for currentUser
        UIManager.renderFavoriteProducts(this.userFavorites, this.currentUser, this.handleRemoveFavorite.bind(this));
        UIManager.renderRecommendations(this.currentUser, this.userFavorites);
        UIManager.toggleProfileSection(false);
        // Potentially clear other user-specific UI elements or redirect
        console.log("App: User logged out.");
    },

    /**
     * Loads user-specific data like favorites and updates relevant UI parts.
     * @async
     */
    loadUserData: async function() {
        if (!this.currentUser) return;

        // Fetch and render favorites
        const favResponse = await ApiClient.fetchUserFavorites(this.currentUser.id);
        if (favResponse.success) {
            this.userFavorites = favResponse.data;
        } else {
            this.userFavorites = [];
            console.error("App: Could not fetch user favorites:", favResponse.message);
        }
        UIManager.renderFavoriteProducts(this.userFavorites, this.currentUser, this.handleRemoveFavorite.bind(this));

        // Render recommendations
        UIManager.renderRecommendations(this.currentUser, this.userFavorites);

        // Other user-specific UI updates can go here
        // e.g., UIManager.renderAlertForm might need re-rendering if it depends on currentUser being loaded
    },

    /**
     * Handles adding a product to favorites.
     * This function is passed as a callback to UIManager.renderSearchResults.
     * @async
     * @param {string} productId - The ID of the product to add.
     * @param {string} productName - The name of the product.
     * @returns {Promise<boolean>} True if successful, false otherwise.
     */
    handleAddFavorite: async function(productId, productName) {
        if (!this.currentUser) return false;
        const response = await ApiClient.addUserFavorite(productId, productName, this.currentUser.id);
        if (response.success) {
            await this.loadUserData(); // Reload favorites and update UI
            return true;
        }
        return false;
    },

    /**
     * Handles removing a product from favorites.
     * This function is passed as a callback to UIManager.renderFavoriteProducts.
     * @async
     * @param {string} productId - The ID of the product to remove.
     */
    handleRemoveFavorite: async function(productId) {
        if (!this.currentUser) return;
        const response = await ApiClient.removeUserFavorite(productId, this.currentUser.id);
        if (response.success) {
            await this.loadUserData(); // Reload favorites and update UI
        } else {
            alert("Не удалось удалить из избранного: " + (response.message || "Ошибка"));
        }
    },

    /**
     * Handles creation of a price alert.
     * This function is passed as a callback to UIManager.renderAlertForm.
     * @async
     * @param {string} productId - The ID of the product.
     * @param {string} targetPrice - The target price for the alert.
     * @returns {Promise<boolean>} True if successful, false otherwise.
     */
    handleCreateAlert: async function(productId, targetPrice) {
        if (!this.currentUser) return false;
        const response = await ApiClient.createPriceAlert(productId, targetPrice, this.currentUser.id);
        // UIManager.renderAlertForm handles showing the message from API response directly in its own callback
        return response.success;
    }
};

// Initialize the application once the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', () => {
    App.init();
    // Optional: Expose App globally for debugging, though it's better to avoid if not strictly necessary.
    // window.App = App;
});