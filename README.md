# Price Comparison Web Service

This project is a frontend for a web service designed to compare product prices across major Russian quick-commerce delivery platforms (e.g., Samokat, Yandex Lavka, Kuper). It aims to provide a clean, intuitive interface for users to find the best prices.

## Features (Frontend Implementation)

*   **Product Search:** Search for products by name.
*   **Filtering:** Filter search results by category, brand, and price range (UI elements are present; mock data currently doesn't reflect live filtering).
*   **Price Comparison:** View prices for a searched product from different (mocked) delivery services.
*   **Side-by-Side Comparison:** Add multiple products to a comparison list to see their prices across services in a table.
*   **Price History:** View a mock price history graph for products (using Chart.js and mock data).
*   **User Accounts (Mock):**
    *   Simulated user registration and login.
    *   Ability to add products to a mock "Favorites" list (in-memory).
    *   View favorite products in a dedicated profile section.
    *   Mock personalized recommendations.
*   **Price Alerts (Mock):**
    *   Form to create a price drop alert for a product (simulated backend call).
    *   Requires user login to create alerts.
*   **Responsive Design:** The UI is designed to be responsive across different screen sizes.
*   **Modern UI:** Clean and modern aesthetic with a neutral color palette.
*   **Configurable API Base URL:** Easy configuration for pointing to a backend API.

## Project Structure

*   `index.html`: The main HTML file for the single-page application.
*   `css/style.css`: Contains all styles for the application.
*   `js/`: JavaScript files:
    *   `api.js`: Contains the `ApiClient` object. This module is responsible for all communication with backend services. It includes a `BASE_API_URL` constant that should be configured to point to your actual backend API. Currently, API calls for core product data are temporarily configured to return mock data for demonstration purposes.
    *   `ui.js`: Contains the `UIManager` object, responsible for all DOM manipulation and UI rendering.
    *   `app.js`: Contains the `App` object, which initializes the application, manages state (like current user, favorites), and coordinates between `ApiClient` and `UIManager`.
*   `README.md`: This file.

## How to Run & Development Notes

1.  **Clone this repository.**
2.  **Open `index.html` in a modern web browser.** No build step or special server is required for the current frontend mock implementation.
3.  **Mock Data:** The application currently uses mock data for product listings, categories, brands, and price history to allow UI demonstration without a live backend. This is configured within `js/api.js`. The actual `fetch` calls for these are temporarily commented out.
4.  **Backend Integration:**
    *   To connect to a real backend, you will need to:
        1.  Uncomment the `fetch` calls within the methods of `ApiClient` in `js/api.js`.
        2.  Update the `BASE_API_URL` constant at the top of `js/api.js` to point to your backend API's base URL (e.g., `https://your-api.example.com/v1`).
    *   The frontend expects the backend API to adhere to certain structures for requests and responses, as can be inferred from the `ApiClient` methods and the data they process.

## Expected Backend API Endpoints (Placeholder)

The `js/api.js` file (when using real `fetch` calls with `BASE_API_URL`) would target endpoints like:
*   `GET \${BASE_API_URL}/products`: For searching/filtering products.
*   `GET \${BASE_API_URL}/categories`: For fetching available product categories.
*   `GET \${BASE_API_URL}/brands`: For fetching available product brands.
*   `GET \${BASE_API_URL}/products/{productId}/history`: For fetching price history of a specific product.
*   `POST \${BASE_API_URL}/auth/login` (example path): For user login.
*   `POST \${BASE_API_URL}/auth/register` (example path): For user registration.
*   `GET/POST/DELETE \${BASE_API_URL}/user/favorites` (example path): For managing user's favorite products.
*   `POST \${BASE_API_URL}/alerts` (example path): For creating price alerts.
    *(Note: Paths like `/auth/...` or `/user/...` are examples; actual paths would depend on the backend API design).*

## Future Work

*   Full backend implementation for all API endpoints.
*   Real-time data scraping or API integration with actual delivery services (Samokat, Yandex Lavka, Kuper).
*   Implementation of the outlined testing strategy (unit, integration, E2E tests).
*   Deployment of the full-stack application.
