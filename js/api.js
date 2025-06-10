// js/api.js
// Handles data fetching, user authentication, and other backend interactions.

// Base URL for all API calls.
// Change this to your actual backend API URL when deploying.
// For example: 'https://your-api.example.com/v1'
// Using a relative path like '/api' assumes the frontend is served from the same domain as the backend,
// or a proxy is set up to route /api requests to the backend.
const BASE_API_URL = '/api';

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

        // --- TEMPORARY MOCK DATA IMPLEMENTATION ---
        console.log(`Mock Fetch Product Prices - Query: ${query}, Filters:`, filters);
        // const params = new URLSearchParams(); // Original params logic commented for mock
        // if (query) params.append('q', query);
        // if (filters) {
        //     if (filters.category) params.append('category', filters.category);
        //     if (filters.brand) params.append('brand', filters.brand);
        //     if (filters.minPrice) params.append('min_price', filters.minPrice);
        //     if (filters.maxPrice) params.append('max_price', filters.maxPrice);
        // }

        // try {
            // REAL API CALL (commented out for mock data)
            // const response = await fetch(`${BASE_API_URL}/products?${params.toString()}`);
            // if (!response.ok) {
            //     const errorText = await response.text();
            //     console.error('API Error:', response.status, errorText);
            //     return { error: true, status: response.status, message: `API Error: ${response.status} ${errorText}`, data: [] };
            // }
            // return await response.json();

        // --- New mock implementation for simplicity ---
        await new Promise(resolve => setTimeout(resolve, 200)); // Simulate delay
        let responseData = { productId: query, productName: query, data: [] };
        if (query && query.toLowerCase().includes('молоко')) {
            responseData = {
                productId: 'milk123',
                productName: 'Молоко "Фермерское" 3.2%',
                data: [
                    { service: 'Самокат', price: 199, url: '#' },
                    { service: 'Яндекс Лавка', price: 205, url: '#' },
                    { service: 'Kuper', price: 210, url: '#' }
                ]
            };
        } else if (query && query.toLowerCase().includes('хлеб')) {
            responseData = {
                productId: 'bread456',
                productName: 'Хлеб "Бородинский"',
                data: [
                    { service: 'Самокат', price: 80, url: '#' },
                    { service: 'Яндекс Лавка', price: 85, url: '#' }
                ]
            };
        } else if (query) {
             responseData = { productId: query + '001', productName: `Продукт "${query}"`, data: [{service: 'Местный магазин', price: 150, url: '#'}] };
        }
        console.log("Returning mock product data:", responseData);
        return responseData; // This structure matches what renderSearchResults expects
        // } catch (error) { // Catch for original fetch
        //     console.error('Fetch failed (or mock generation failed):', error);
        //     return { error: true, message: error.message, data: [] };
        // }
    },

    /**
     * Fetches available product categories.
     * @async
     * @returns {Promise<object>} A promise that resolves to the API response (JSON).
     *                           Returns { error: true, message: string, data: [] } on failure.
     */
    fetchCategories: async function() {
        // --- TEMPORARY MOCK DATA IMPLEMENTATION ---
        console.log("Mock Fetch Categories");
        // try {
            // REAL API CALL (commented out for mock data)
            // const response = await fetch(`${BASE_API_URL}/categories`);
            // if (!response.ok) { /* ... error handling ... */ }
            // return await response.json();
        // } catch (error) { /* ... error handling ... */ }

        await new Promise(resolve => setTimeout(resolve, 100));
        return {
            data: [ // Ensure it returns an object with a 'data' property
                { id: 'dairy', name: 'Молочные продукты' },
                { id: 'bakery', name: 'Хлебобулочные изделия' },
                { id: 'drinks', name: 'Напитки' },
                { id: 'fruits', name: 'Фрукты' },
                { id: 'vegetables', name: 'Овощи' }
            ]
        };
    },

    /**
     * Fetches available product brands.
     * @async
     * @returns {Promise<object>} A promise that resolves to the API response (JSON).
     *                           Returns { error: true, message: string, data: [] } on failure.
     */
    fetchBrands: async function() {
        // --- TEMPORARY MOCK DATA IMPLEMENTATION ---
        console.log("Mock Fetch Brands");
        // try { /* ... REAL API CALL commented out ... */ } catch (error) { /* ... */ }

        await new Promise(resolve => setTimeout(resolve, 100));
        return {
            data: [ // Ensure it returns an object with a 'data' property
                { id: 'brandA', name: 'Веселый Молочник' },
                { id: 'brandB', name: 'Хлебный Дом' },
                { id: 'brandC', name: 'Фруктовый Сад' }
            ]
        };
    },

    /**
     * Fetches price history for a specific product.
     * @async
     * @param {string} productId - The ID of the product.
     * @returns {Promise<object>} A promise that resolves to the API response (JSON).
     *                           Returns { error: true, message: string, data: [] } on failure or if productId is missing.
     */
    fetchPriceHistory: async function(productId) {
        // --- TEMPORARY MOCK DATA IMPLEMENTATION ---
        console.log(`Mock Fetch Price History for productId: ${productId}`);
        // if (!productId) { // Original check still relevant if we were to mix
        //     console.error('fetchPriceHistory: productId is required');
        //     return { error: true, message: 'Product ID is required', data: [] };
        // }
        // try { /* ... REAL API CALL commented out ... */ } catch (error) { /* ... */ }

        await new Promise(resolve => setTimeout(resolve, 150));
        let history = [];
        if (productId === 'milk123') {
            history = [
              {"date": "2024-05-01T00:00:00Z", "price": 210},
              {"date": "2024-05-02T00:00:00Z", "price": 205},
              {"date": "2024-05-03T00:00:00Z", "price": 205},
              {"date": "2024-05-04T00:00:00Z", "price": 200},
              {"date": "2024-05-05T00:00:00Z", "price": 199},
              {"date": "2024-05-06T00:00:00Z", "price": 199},
              {"date": "2024-05-07T00:00:00Z", "price": 198}
            ];
        } else if (productId === 'bread456') {
             history = [
              {"date": "2024-05-01T00:00:00Z", "price": 85},
              {"date": "2024-05-02T00:00:00Z", "price": 82},
              {"date": "2024-05-07T00:00:00Z", "price": 80}
            ];
        }
        return { data: history }; // Ensure it returns an object with a 'data' property
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