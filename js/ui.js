// js/ui.js
// Handles rendering UI components and updating the DOM.

/**
 * @namespace UIManager
 * @description Manages all UI rendering and DOM manipulation.
 */
const UIManager = {
    /**
     * @property {Array<object>} comparisonList - List of products currently in the comparison table.
     */
    comparisonList: [],
    /**
     * @property {object|null} currentPriceChart - Instance of the current Chart.js price history chart.
     */
    currentPriceChart: null,

    /**
     * Renders search results in the DOM.
     * @async
     * @param {object} apiResponse - The response from ApiClient.fetchProductPrices.
     * @param {string} query - The original search query.
     * @param {object|null} currentUser - The current logged-in user object (from App.currentUser).
     * @param {Function} onAddFavorite - Callback function to be called when 'add favorite' is clicked.
     *                                   It will receive (productId, productName). App.js will handle the API call and data refresh.
     */
    renderSearchResults: async function(apiResponse, query, currentUser, onAddFavorite) {
        const resultsContainer = document.getElementById('search-results');

        if (!query && (!apiResponse || !apiResponse.data || apiResponse.data.length === 0)) {
            resultsContainer.innerHTML = '<p>Введите название продукта для поиска.</p>';
            return;
        }
        resultsContainer.innerHTML = '<p>Загрузка...</p>';

        try {
            if (apiResponse && apiResponse.error) {
                resultsContainer.innerHTML = `<p>Ошибка загрузки данных: ${apiResponse.message || 'Неизвестная ошибка'}. Пожалуйста, попробуйте позже.</p>`;
                return;
            }

            const productsData = apiResponse ? apiResponse.data : [];

            if (!productsData || productsData.length === 0) {
                resultsContainer.innerHTML = `<p>Товары по запросу "${query}" не найдены.</p>`;
                if (this.renderPriceHistory) this.renderPriceHistory(null, currentUser);
                if (this.renderAlertForm) this.renderAlertForm(null, currentUser);
                return;
            }

            const productId = apiResponse.productId || query;

            let listItems = productsData.map(
                p => `<li><a href="${p.url}" target="_blank">${p.service}</a>: ${p.price} ₽</li>`
            ).join('');

            resultsContainer.innerHTML = `
                <div class="search-result" data-product-id="${productId}">
                    <h3>Результаты для: "${query}"</h3>
                    <ul>${listItems}</ul>
                    <button class="add-favorite-btn">Добавить в избранное</button>
                    <button class="add-compare-btn">Добавить к сравнению</button>
                    <div class="favorite-message" style="margin-top:8px;color:var(--accent);font-size:0.98em;"></div>
                </div>
            `;

            const searchResultDiv = resultsContainer.querySelector('.search-result');
            const favBtn = searchResultDiv.querySelector('.add-favorite-btn');
            const favMsg = searchResultDiv.querySelector('.favorite-message');
            const compareBtn = searchResultDiv.querySelector('.add-compare-btn');

            if (favBtn) {
                favBtn.addEventListener('click', async () => {
                    if (!currentUser) {
                        favMsg.textContent = 'Войдите, чтобы добавить в избранное.';
                        setTimeout(() => { favMsg.textContent = ''; }, 2500);
                        return;
                    }
                    favMsg.textContent = 'Добавляем...';
                    const currentProductId = searchResultDiv.dataset.productId;
                    // Call the callback provided by App.js
                    if (onAddFavorite) {
                        const success = await onAddFavorite(currentProductId, query); // query is productName
                        if (success) {
                            favMsg.textContent = 'Добавлено в избранное!';
                        } else {
                            favMsg.textContent = 'Не удалось добавить в избранное.';
                        }
                    } else {
                         favMsg.textContent = 'Ошибка: Действие не настроено.';
                    }
                    setTimeout(() => { favMsg.textContent = ''; }, 2500);
                });
            }

            if (compareBtn) {
                compareBtn.addEventListener('click', () => {
                    const currentProductId = searchResultDiv.dataset.productId;
                    const itemToCompare = {
                        name: query,
                        prices: productsData,
                        id: currentProductId
                    };
                    if (!this.comparisonList.some(item => item.id === itemToCompare.id)) {
                        this.comparisonList.push(itemToCompare);
                    }
                    if (this.renderComparison) this.renderComparison();
                });
            }

            if (this.renderPriceHistory) this.renderPriceHistory(productId, currentUser);
            if (this.renderAlertForm) this.renderAlertForm(productId, currentUser);

        } catch (e) {
            console.error("Error in UIManager.renderSearchResults:", e);
            resultsContainer.innerHTML = '<p>Произошла ошибка при отображении результатов.</p>';
            if (this.renderPriceHistory) this.renderPriceHistory(null, currentUser);
            if (this.renderAlertForm) this.renderAlertForm(null, currentUser);
        }
    },

    /**
     * Renders the price history chart.
     * @async
     * @param {string|null} productId - The ID of the product, or null to clear the chart.
     * @param {object|null} currentUser - The current logged-in user.
     */
    renderPriceHistory: async function(productId, currentUser) {
        const chartArea = document.getElementById('price-chart-area');
        const canvasId = 'price-history-canvas';

        if (!productId) {
            if (!currentUser) {
                chartArea.innerHTML = '<p>Войдите, чтобы просматривать историю цен.</p>';
            } else {
                chartArea.innerHTML = '<p>Выберите товар, чтобы увидеть историю его цен.</p>';
            }
            if (this.currentPriceChart) { this.currentPriceChart.destroy(); this.currentPriceChart = null; }
            return;
        }
        chartArea.innerHTML = `<p>Загрузка графика...</p><canvas id="${canvasId}" height="120"></canvas>`;

        try {
            const historyResponse = await ApiClient.fetchPriceHistory(productId); // Use ApiClient

            if (historyResponse && historyResponse.error) {
                chartArea.innerHTML = `<p>Не удалось загрузить историю цен: ${historyResponse.message || 'Ошибка сервера'}</p>`;
                return;
            }
            const historyData = historyResponse ? historyResponse.data : [];
            if (!historyData || historyData.length === 0) {
                chartArea.innerHTML = '<p>История цен для этого товара недоступна.</p>';
                return;
            }

            if (!document.getElementById(canvasId)) {
                 chartArea.innerHTML = `<canvas id="${canvasId}" height="120"></canvas>`;
            }
            const ctx = document.getElementById(canvasId).getContext('2d');
            const labels = historyData.map(item => new Date(item.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short'}));
            const prices = historyData.map(item => item.price);

            if (this.currentPriceChart) {
                this.currentPriceChart.destroy();
            }

            this.currentPriceChart = new Chart(ctx, { /* ... chart config ... */
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: `История цен для: ${productId}`,
                        data: prices,
                        borderColor: 'var(--accent)',
                        backgroundColor: 'rgba(79,140,255,0.08)',
                        tension: 0.3,
                        fill: true,
                        pointRadius: 4,
                        pointBackgroundColor: '#fff'
                    }]
                },
                options: {
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: false } }
                }
            });
        } catch (e) {
            console.error("Error in UIManager.renderPriceHistory:", e);
            chartArea.innerHTML = '<p>Ошибка при построении графика истории цен.</p>';
        }
    },

    /**
     * Renders the price alert form.
     * @param {string|null} productId - The ID of the product, or null to clear the form.
     * @param {object|null} currentUser - The current logged-in user.
     * @param {Function} onCreateAlert - Callback after attempting to create an alert. App.js will handle API call.
     */
    renderAlertForm: function(productId, currentUser, onCreateAlert) {
        const alertsArea = document.getElementById('alerts-management');
        const formId = 'alert-form';
        const msgId = 'alert-msg';

        if (!productId) {
            alertsArea.innerHTML = `<p>${!currentUser ? 'Войдите, чтобы' : 'Выберите товар для'} настройки уведомлений.</p>`;
            return;
        }

        if (!currentUser) {
            alertsArea.innerHTML = '<p>Пожалуйста, <a href="#login" id="login-for-alert">войдите</a>, чтобы создавать уведомления.</p>';
            const loginLink = alertsArea.querySelector('#login-for-alert');
            if (loginLink) {
                loginLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const authModal = document.getElementById('auth-modal');
                    if (authModal) authModal.style.display = 'flex';
                });
            }
            return;
        }

        alertsArea.innerHTML = `
            <form id="${formId}">
                <label for="alert-price-${productId}">Создать уведомление для "${productId}" (ID)</label>
                <input type="number" id="alert-price-${productId}" placeholder="Желаемая цена, ₽" min="1" required>
                <button type="submit">Создать уведомление</button>
                <span id="${msgId}" style="margin-left:12px;color:var(--accent);"></span>
            </form>
        `;
        const form = document.getElementById(formId);
        const msg = document.getElementById(msgId);
        const priceInput = document.getElementById(`alert-price-${productId}`);

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const targetPrice = priceInput.value;
            if (!targetPrice) {
                msg.textContent = 'Введите цену.';
                return;
            }
            msg.textContent = 'Создаем уведомление...';
            if (onCreateAlert) {
                const success = await onCreateAlert(productId, targetPrice, currentUser.id);
                 if (success) {
                    msg.textContent = 'Уведомление создано (запрос отправлен)!';
                } else {
                    msg.textContent = 'Не удалось создать уведомление.';
                }
            } else {
                msg.textContent = 'Ошибка: Действие не настроено.';
            }
            setTimeout(() => { msg.textContent = ''; }, 2500);
            form.reset();
        });
    },

    /**
     * Renders the product comparison table.
     */
    renderComparison: function() {
        const area = document.getElementById('comparison-area');
        if (!this.comparisonList || this.comparisonList.length === 0) {
            area.innerHTML = '<p>Добавьте товары для сравнения.</p>';
            return;
        }
        const services = Array.from(
            new Set(this.comparisonList.flatMap(item => item.prices.map(p => p.service)))
        );
        let header = '<tr><th>Товар (ID)</th>' + services.map(s => `<th>${s}</th>`).join('') + '</tr>';
        let rows = this.comparisonList.map(item => {
            let cols = services.map(s => {
                const found = item.prices.find(p => p.service === s);
                return found ? `<td>${found.price} ₽</td>` : '<td>-</td>';
            }).join('');
            return `<tr><td>${item.name} ${item.id !== item.name ? '('+item.id+')' : ''}</td>${cols}</tr>`;
        }).join('');
        area.innerHTML = `
            <table class="comparison-table">
                <thead>${header}</thead>
                <tbody>${rows}</tbody>
            </table>
            <button id="clear-comparison" style="margin-top:12px;">Очистить сравнение</button>
        `;
        document.getElementById('clear-comparison').addEventListener('click', () => { // Changed from onclick
            this.comparisonList = [];
            this.renderComparison();
        });
    },

    /**
     * Populates filter dropdowns with data from ApiClient.
     * @async
     */
    populateFilters: async function() {
        const categoryFilter = document.getElementById('category-filter');
        const brandFilter = document.getElementById('brand-filter');

        try {
            const categoriesResponse = await ApiClient.fetchCategories(); // Use ApiClient
            if (categoriesResponse && !categoriesResponse.error && categoriesResponse.data) {
                categoriesResponse.data.forEach(cat => {
                    const option = document.createElement('option');
                    option.value = cat.id;
                    option.textContent = cat.name;
                    categoryFilter.appendChild(option);
                });
            } else {
                console.error("UIManager: Could not fetch categories:", categoriesResponse ? categoriesResponse.message : "No response");
            }

            const brandsResponse = await ApiClient.fetchBrands(); // Use ApiClient
            if (brandsResponse && !brandsResponse.error && brandsResponse.data) {
                brandsResponse.data.forEach(brand => {
                    const option = document.createElement('option');
                    option.value = brand.id;
                    option.textContent = brand.name;
                    brandFilter.appendChild(option);
                });
            } else {
                console.error("UIManager: Could not fetch brands:", brandsResponse ? brandsResponse.message : "No response");
            }
        } catch (e) {
            console.error("Error in UIManager.populateFilters:", e);
        }
    },

    /**
     * Renders the list of favorite products.
     * @param {Array<object>} favorites - List of favorite product objects.
     * @param {object|null} currentUser - The current logged-in user.
     * @param {Function} onRemoveFavorite - Callback when 'remove favorite' is clicked. App.js handles API call.
     */
    renderFavoriteProducts: function(favorites, currentUser, onRemoveFavorite) {
        const favContainer = document.getElementById('favorite-products');
        if (!favContainer) return;

        if (!currentUser) {
            favContainer.innerHTML = '<h3>Избранные товары</h3><p>Войдите, чтобы просматривать избранные товары.</p>';
            return;
        }
        if (!favorites || favorites.length === 0) {
            favContainer.innerHTML = '<h3>Избранные товары</h3><p>У вас пока нет избранных товаров.</p>';
            return;
        }
        let itemsHtml = favorites.map(fav => `
            <div class="favorite-item" data-product-id="${fav.id}">
                <span>${fav.name} (ID: ${fav.id})</span>
                <button class="remove-favorite-btn">Удалить</button>
            </div>
        `).join('');
        favContainer.innerHTML = `<h3>Избранные товары</h3>${itemsHtml}`;

        favContainer.querySelectorAll('.remove-favorite-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const productId = e.target.closest('.favorite-item').dataset.productId;
                if (onRemoveFavorite) {
                    await onRemoveFavorite(productId, currentUser.id); // App.js handles API and refresh
                }
            });
        });
    },

    /**
     * Renders recommendations based on user state.
     * @param {object|null} currentUser - The current logged-in user.
     * @param {Array<object>} userFavorites - The user's current list of favorites.
     */
    renderRecommendations: function(currentUser, userFavorites) {
        const recContainer = document.getElementById('recommendations');
        if (!recContainer) return;

        if (currentUser && userFavorites && userFavorites.length > 0) {
             recContainer.innerHTML = '<h3>Рекомендации</h3><p>Основываясь на ваших избранных товарах, мы думаем, вам может понравиться "Рекомендованный Товар X".</p>';
        } else if (currentUser) {
             recContainer.innerHTML = '<h3>Рекомендации</h3><p>Добавьте товары в избранное, чтобы мы могли дать вам рекомендации.</p>';
        } else {
            recContainer.innerHTML = '<h3>Рекомендации</h3><p>Войдите, чтобы увидеть персональные рекомендации.</p>';
        }
    },

    /**
     * Updates the login status display in the header.
     * @param {object|null} currentUser - The current user object, or null if logged out.
     * @param {Function} onLogout - Callback function to be executed when logout is clicked.
     */
    updateLoginDisplay: function(currentUser, onLogout) {
        const userAccountDiv = document.querySelector('.user-account');
        const userAccountLink = userAccountDiv.querySelector('a'); // Original "Войти" link

        let logoutBtn = userAccountDiv.querySelector('#logout-btn');
        if (!logoutBtn) {
            logoutBtn = document.createElement('button');
            logoutBtn.id = 'logout-btn';
            logoutBtn.textContent = 'Выйти';
            logoutBtn.style.marginLeft = '10px';
            userAccountDiv.appendChild(logoutBtn);
        }

        if (currentUser) {
            userAccountLink.textContent = currentUser.name;
            userAccountLink.href = '#user-profile-section';
            logoutBtn.style.display = 'inline-block';
            logoutBtn.onclick = onLogout; // Assign the onLogout callback from App.js
        } else {
            userAccountLink.textContent = 'Войти';
            userAccountLink.href = '#login';
            logoutBtn.style.display = 'none';
        }
    },

    /**
     * Toggles the visibility of the user profile section.
     * @param {boolean} show - True to show, false to hide.
     */
    toggleProfileSection: function(show) {
        const profileSection = document.getElementById('user-profile-section');
        if (profileSection) {
            profileSection.style.display = show ? 'block' : 'none';
        }
    },

    /**
     * Displays a message in the authentication modal.
     * @param {string} messageText - The message to display.
     * @param {boolean} [isError=false] - True if the message is an error.
     */
    showAuthMessage: function(messageText, isError = false) {
        const authMessageEl = document.getElementById('auth-message');
        if (authMessageEl) {
            authMessageEl.textContent = messageText;
            authMessageEl.style.color = isError ? 'red' : 'var(--accent)';
        }
    },

    /**
     * Toggles the display of the authentication modal.
     * @param {boolean} show - True to show, false to hide.
     */
    toggleAuthModal: function(show) {
        const authModal = document.getElementById('auth-modal');
        if (authModal) {
            authModal.style.display = show ? 'flex' : 'none';
            if(show) this.showAuthMessage(''); // Clear previous messages when showing
        }
    }
};