// ui.js
// Handles rendering UI components and updating the DOM

// Render search results in the #search-results container
window.renderSearchResults = async function(query) {
    const resultsContainer = document.getElementById('search-results');
    if (!query) {
        resultsContainer.innerHTML = '<p>Введите название продукта для поиска.</p>';
        return;
    }
    resultsContainer.innerHTML = '<p>Загрузка...</p>';
    try {
        const prices = await window.fetchProductPrices(query);
        if (!prices || prices.length === 0) {
            resultsContainer.innerHTML = '<p>Товары не найдены.</p>';
            return;
        }
        let listItems = prices.map(
            p => `<li><a href="${p.url}" target="_blank">${p.service}</a>: ${p.price} ₽</li>`
        ).join('');
        resultsContainer.innerHTML = `
            <div class="search-result">
                <h3>Результаты для: "${query}"</h3>
                <ul>${listItems}</ul>
                <button id="add-favorite-btn">Добавить в избранное</button>
                <button id="add-compare-btn">Добавить к сравнению</button>
                <div id="favorite-message" style="margin-top:8px;color:var(--accent);font-size:0.98em;"></div>
            </div>
        `;
        // Add event listener for favorite button
        const favBtn = document.getElementById('add-favorite-btn');
        const favMsg = document.getElementById('favorite-message');
        if (favBtn) {
            favBtn.addEventListener('click', () => {
                favMsg.textContent = 'Добавлено в избранное (заглушка)';
                setTimeout(() => { favMsg.textContent = ''; }, 1800);
            });
        }
        // Add event listener for compare button
        const compareBtn = document.getElementById('add-compare-btn');
        if (!window.comparisonList) window.comparisonList = [];
        if (compareBtn) {
            compareBtn.addEventListener('click', () => {
                // Prevent duplicates
                if (!window.comparisonList.some(item => item.name === query)) {
                    window.comparisonList.push({
                        name: query,
                        prices
                    });
                }
                if (window.renderComparison) window.renderComparison();
            });
        }
    } catch (e) {
        resultsContainer.innerHTML = '<p>Ошибка загрузки данных.</p>';
    }
    // Render price history chart for this product
    if (window.renderPriceHistory) {
        window.renderPriceHistory(query);
    }
    // Render price drop alert form for this product
    if (window.renderAlertForm) {
        window.renderAlertForm(query);
    }
};
// Render price history chart using Chart.js
window.renderPriceHistory = function(productName) {
    const ctxId = 'price-history-canvas';
    let chartArea = document.getElementById('price-chart-area');
    chartArea.innerHTML = `<canvas id="${ctxId}" height="120"></canvas>`;
    const ctx = document.getElementById(ctxId).getContext('2d');
    // Mock data: last 7 days
    const labels = ['6д', '5д', '4д', '3д', '2д', 'Вчера', 'Сегодня'];
    const data = [210, 205, 205, 200, 199, 199, 199];
    new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: `История цен: ${productName}`,
                data,
                borderColor: '#4f8cff',
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
};
// Render price drop alert form and handle submission
window.renderAlertForm = function(productName) {
    const alertsArea = document.getElementById('alerts-management');
    alertsArea.innerHTML = `
        <form id="alert-form">
            <label>Создать уведомление о снижении цены для "${productName}"</label>
            <input type="number" id="alert-price" placeholder="Цена, ₽" min="1" required>
            <button type="submit">Создать уведомление</button>
            <span id="alert-msg" style="margin-left:12px;color:var(--accent);"></span>
        </form>
    `;
    const form = document.getElementById('alert-form');
    const msg = document.getElementById('alert-msg');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        msg.textContent = 'Уведомление создано (заглушка)';
        setTimeout(() => { msg.textContent = ''; }, 1800);
        form.reset();
    });
};
// Render comparison table in #comparison-area
window.renderComparison = function() {
    const area = document.getElementById('comparison-area');
    const list = window.comparisonList || [];
    if (!list.length) {
        area.innerHTML = '<p>Добавьте товары для сравнения.</p>';
        return;
    }
    // Collect all unique services
    const services = Array.from(
        new Set(list.flatMap(item => item.prices.map(p => p.service)))
    );
    let header = '<tr><th>Товар</th>' + services.map(s => `<th>${s}</th>`).join('') + '</tr>';
    let rows = list.map(item => {
        let cols = services.map(s => {
            const found = item.prices.find(p => p.service === s);
            return found ? `<td>${found.price} ₽</td>` : '<td>-</td>';
        }).join('');
        return `<tr><td>${item.name}</td>${cols}</tr>`;
    }).join('');
    area.innerHTML = `
        <table class="comparison-table">
            <thead>${header}</thead>
            <tbody>${rows}</tbody>
        </table>
        <button id="clear-comparison" style="margin-top:12px;">Очистить сравнение</button>
    `;
    document.getElementById('clear-comparison').onclick = () => {
        window.comparisonList = [];
        window.renderComparison();
    };
};
// Populate filter dropdowns
window.populateFilters = async function() {
    const categoryFilter = document.getElementById('category-filter');
    const brandFilter = document.getElementById('brand-filter');

    try {
        const categories = await window.fetchCategories();
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            categoryFilter.appendChild(option);
        });

        const brands = await window.fetchBrands();
        brands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand.id;
            option.textContent = brand.name;
            brandFilter.appendChild(option);
        });
    } catch (e) {
        console.error("Error populating filters:", e);
        // Optionally, display an error message to the user in the UI
    }
};