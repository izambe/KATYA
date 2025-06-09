// js/api.js
// Handles data fetching, user authentication, and other backend interactions.

/**
 * @namespace ApiClient
 * @description Manages all API interactions for the application.
 */
const ApiClient = {
    /**
     * @property {Array<object>} _mockUserFavorites - In-memory store for user's favorite products.
     * @private
     */
    _mockUserFavorites: [
        { id: "product123", name: "Молоко (Избранное)", userId: "user123" }, // Assuming favorites could be user-specific
        { id: "product456", name: "Хлеб (Избранное)", userId: "user123" }
    ],

    /**
     * Fetches product prices based on a search query and filters.
     * @async
     * @param {string} query - The search term for products.
     * @param {object} [filters={}] - Optional filters for the search.
     * @param {string} [filters.category] - Category to filter by.
     * @param {number} [filters.minPrice] - Minimum price filter.
     * @param {number} [filters.maxPrice] - Maximum price filter.
     * @param {string} [filters.brand] - Brand to filter by.
     * @returns {Promise<object>} A promise that resolves to the API response (JSON).
     *                           Returns { error: true, message: string, data: [] } on failure.
     */
    fetchProductPrices: async function(query, filters = {}) {
        const params = new URLSearchParams();
        if (query) {
            params.append('q', query);
        }
        if (filters.category) {
            params.append('category', filters.category);
        }
        if (filters.minPrice) {
            params.append('min_price', filters.minPrice);
        }
        if (filters.maxPrice) {
            params.append('max_price', filters.maxPrice);
        }
        if (filters.brand) {
            params.append('brand', filters.brand);
        }

        try {
            const response = await fetch(`/api/products?${params.toString()}`);
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error in fetchProductPrices:', response.status, errorText);
                return { error: true, status: response.status, message: `API Error: ${response.status} ${errorText}`, data: [] };
            }
            return await response.json();
        } catch (error) {
            console.error('Fetch failed in fetchProductPrices:', error);
            return { error: true, message: error.message, data: [] };
        }
    },

    /**
     * Fetches available product categories.
     * @async
     * @returns {Promise<object>} A promise that resolves to the API response (JSON).
     *                           Returns { error: true, message: string, data: [] } on failure.
     */
    fetchCategories: async function() {
        try {
            const response = await fetch('/api/categories');
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error in fetchCategories:', response.status, errorText);
                return { error: true, status: response.status, message: `API Error: ${response.status} ${errorText}`, data: [] };
            }
            return await response.json();
        } catch (error) {
            console.error('Fetch failed in fetchCategories:', error);
            return { error: true, message: error.message, data: [] };
        }
    },

    /**
     * Fetches available product brands.
     * @async
     * @returns {Promise<object>} A promise that resolves to the API response (JSON).
     *                           Returns { error: true, message: string, data: [] } on failure.
     */
    fetchBrands: async function() {
        try {
            const response = await fetch('/api/brands');
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error in fetchBrands:', response.status, errorText);
                return { error: true, status: response.status, message: `API Error: ${response.status} ${errorText}`, data: [] };
            }
            return await response.json();
        } catch (error) {
            console.error('Fetch failed in fetchBrands:', error);
            return { error: true, message: error.message, data: [] };
        }
    },

    /**
     * Fetches price history for a specific product.
     * @async
     * @param {string} productId - The ID of the product.
     * @returns {Promise<object>} A promise that resolves to the API response (JSON).
     *                           Returns { error: true, message: string, data: [] } on failure or if productId is missing.
     */
    fetchPriceHistory: async function(productId) {
        if (!productId) {
            console.error('fetchPriceHistory: productId is required');
            return { error: true, message: 'Product ID is required', data: [] };
        }
        try {
            const response = await fetch(`/api/products/${productId}/history`);
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error in fetchPriceHistory:', response.status, errorText);
                return { error: true, status: response.status, message: `API Error: ${response.status} ${errorText}`, data: [] };
            }
            return await response.json();
        } catch (error) {
            console.error('Fetch failed in fetchPriceHistory:', error);
            return { error: true, message: error.message, data: [] };
        }
    },

    /**
     * Logs in a user.
     * @async
     * @param {string} email - The user's email.
     * @param {string} password - The user's password.
     * @returns {Promise<object>} Mock response: { success: true, user: object, token: string } or { success: false, message: string }.
     */
    loginUser: async function(email, password) {
        console.log(`ApiClient: Attempting login for ${email}`);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        if (email === "user@example.com" && password === "password") {
            return { success: true, user: { id: "user123", name: "Тестовый Пользователь", email: email }, token: "fake-jwt-token" };
        }
        return { success: false, message: "Неверные учетные данные." };
    },

    /**
     * Registers a new user.
     * @async
     * @param {string} email - The user's email.
     * @param {string} password - The user's password.
     * @returns {Promise<object>} Mock response: { success: true, user: object, token: string } or { success: false, message: string }.
     */
    registerUser: async function(email, password) {
        console.log(`ApiClient: Attempting registration for ${email}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        // In a real app, check if user exists, etc.
        return { success: true, user: { id: "newUser789", name: "Новый Пользователь", email: email }, token: "new-fake-jwt-token" };
    },

    /**
     * Fetches the current user's favorite products. (Assumes user context is handled, e.g., via token, or takes userId)
     * For this mock, it uses a specific userId for filtering if desired, or returns all for simplicity.
     * @async
     * @param {string} [userId] - Optional ID of the user whose favorites to fetch.
     * @returns {Promise<object>} Mock response: { success: true, data: Array<object> }.
     */
    fetchUserFavorites: async function(userId) { // Added optional userId for future use
        console.log(`ApiClient: Fetching user favorites (mock) for user ${userId || 'any'}`);
        await new Promise(resolve => setTimeout(resolve, 300));
        // If userId is provided, filter _mockUserFavorites. For now, returns all.
        // This simple mock doesn't truly segregate by user yet without more context.
        return { success: true, data: this._mockUserFavorites };
    },

    /**
     * Adds a product to the user's favorites.
     * @async
     * @param {string} productId - The ID of the product to add.
     * @param {string} productName - The name of the product.
     * @param {string} [userId] - Optional ID of the user.
     * @returns {Promise<object>} Mock response: { success: true, message: string }.
     */
    addUserFavorite: async function(productId, productName, userId) { // Added optional userId
        console.log(`ApiClient: Attempting to add product ${productId} (${productName}) to favorites for user ${userId || 'any'}.`);
        await new Promise(resolve => setTimeout(resolve, 300));
        if (!this._mockUserFavorites.some(fav => fav.id === productId)) {
            this._mockUserFavorites.push({ id: productId, name: productName, userId: userId }); // Store userId with favorite
        }
        return { success: true, message: "Добавлено в избранное" };
    },

    /**
     * Removes a product from the user's favorites.
     * @async
     * @param {string} productId - The ID of the product to remove.
     * @param {string} [userId] - Optional ID of the user (for validation if favorites are user-specific).
     * @returns {Promise<object>} Mock response: { success: true, message: string }.
     */
    removeUserFavorite: async function(productId, userId) { // Added optional userId
        console.log(`ApiClient: Attempting to remove product ${productId} from favorites for user ${userId || 'any'}.`);
        await new Promise(resolve => setTimeout(resolve, 300));
        this._mockUserFavorites = this._mockUserFavorites.filter(fav => fav.id !== productId);
        // In a real scenario, you'd ensure only the correct user's favorite is removed.
        return { success: true, message: "Удалено из избранного" };
    },

    /**
     * Creates a price alert for a product.
     * @async
     * @param {string} productId - The ID of the product.
     * @param {number} targetPrice - The target price for the alert.
     * @param {string} [userId] - The ID of the user creating the alert.
     * @returns {Promise<object>} Mock response: { success: true, message: string }.
     */
    createPriceAlert: async function(productId, targetPrice, userId) {
        console.log(`ApiClient: Attempting to create alert for product ${productId} at price ${targetPrice} for user ${userId || 'anonymous'}.`);
        await new Promise(resolve => setTimeout(resolve, 300));
        // Mock: just return success
        return { success: true, message: `Alert for product ${productId} at ${targetPrice} for user ${userId || 'anonymous'} created (mocked).` };
    }
};