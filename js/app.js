// app.js
// Main entry point: initializes app, sets up event listeners

// Wire up search input and button to trigger search results rendering
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    function handleSearch() {
        const query = searchInput.value.trim();
        // Placeholder: call UI function to render results
        if (window.renderSearchResults) {
            window.renderSearchResults(query);
        }
    }

    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Populate filter dropdowns on page load
    if (window.populateFilters) {
        window.populateFilters();
    }
    // Modal logic
    const userAccountLink = document.querySelector('.user-account a');
    const authModal = document.getElementById('auth-modal');
    const closeAuthModal = document.getElementById('close-auth-modal');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const authMessage = document.getElementById('auth-message');

    userAccountLink.addEventListener('click', (e) => {
        e.preventDefault();
        authModal.style.display = 'flex';
        authMessage.textContent = '';
    });

    closeAuthModal.addEventListener('click', () => {
        authModal.style.display = 'none';
    });

    loginBtn.addEventListener('click', () => {
        authMessage.textContent = 'Вход не реализован (заглушка).';
    });

    registerBtn.addEventListener('click', () => {
        authMessage.textContent = 'Регистрация не реализована (заглушка).';
    });

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.style.display = 'none';
        }
    });
});