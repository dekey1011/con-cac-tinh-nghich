// Admin page JavaScript for EcoShop

// Products data - sync with main site
let products = JSON.parse(localStorage.getItem('ecoshop_products')) || [
    {
        id: 1,
        name: "Túi Canvas Eco",
        price: 189000,
        image: "https://picsum.photos/id/201/600/600",
        badge: "BEST"
    },
    {
        id: 2,
        name: "Bàn chải tre hữu cơ",
        price: 45000,
        image: "https://picsum.photos/id/251/600/600",
        badge: "NEW"
    },
    {
        id: 3,
        name: "Bình nước giữ nhiệt 750ml",
        price: 329000,
        image: "https://picsum.photos/id/431/600/600"
    },
    {
        id: 4,
        name: "Áo thun Organic Cotton",
        price: 425000,
        image: "https://picsum.photos/id/1005/600/600",
        badge: "HOT"
    }
];

let currentEditingId = null;
let productToDelete = null;

// Initialize admin page
function initializeAdmin() {
    updateStats();
    renderProductsTable();
    setupEventListeners();
    updateCurrentTime();

    // Update time every minute
    setInterval(updateCurrentTime, 60000);
}

// Update statistics
function updateStats() {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, product) => sum + product.price, 0);
    const hotProducts = products.filter(p => p.badge === 'HOT').length;
    const newProducts = products.filter(p => p.badge === 'NEW').length;

    document.getElementById('total-products').textContent = totalProducts;
    document.getElementById('total-value').textContent = formatCurrency(totalValue);
    document.getElementById('hot-products').textContent = hotProducts;
    document.getElementById('new-products').textContent = newProducts;
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// Render products table
function renderProductsTable(filterBadge = '', searchTerm = '') {
    const tbody = document.getElementById('products-table-body');
    const emptyState = document.getElementById('empty-state');

    let filteredProducts = products;

    // Filter by badge
    if (filterBadge) {
        filteredProducts = filteredProducts.filter(p => p.badge === filterBadge);
    }

    // Filter by search term
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    if (filteredProducts.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    tbody.innerHTML = filteredProducts.map(product => `
        <tr class="admin-table-row">
            <td class="px-6 py-4 whitespace-nowrap">
                <img src="${product.image}" alt="${product.name}" class="product-image">
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">${product.name}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                ${formatCurrency(product.price)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                ${product.badge ? `<span class="badge-${product.badge.toLowerCase()} px-2 py-1 text-xs font-medium rounded-full">${product.badge}</span>` : '<span class="text-gray-400">Không có</span>'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="editProduct(${product.id})" class="text-indigo-600 hover:text-indigo-900 mr-3">
                    <i class="fa-solid fa-edit"></i> Sửa
                </button>
                <button onclick="deleteProduct(${product.id})" class="text-red-600 hover:text-red-900">
                    <i class="fa-solid fa-trash"></i> Xóa
                </button>
            </td>
        </tr>
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    document.getElementById('search-admin').addEventListener('input', function() {
        const searchTerm = this.value;
        const filterBadge = document.getElementById('filter-badge').value;
        renderProductsTable(filterBadge, searchTerm);
    });

    // Product form submission
    document.getElementById('product-form').addEventListener('submit', handleProductSubmit);
}

// Show add product modal
function showAddProductModal() {
    currentEditingId = null;
    document.getElementById('modal-title').textContent = 'Thêm sản phẩm mới';
    document.getElementById('product-form').reset();
    document.getElementById('product-modal').classList.remove('hidden');
}

// Edit product
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    currentEditingId = id;
    document.getElementById('modal-title').textContent = 'Chỉnh sửa sản phẩm';
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-image').value = product.image;
    document.getElementById('product-badge').value = product.badge || '';
    document.getElementById('product-modal').classList.remove('hidden');
}

// Handle product form submission
function handleProductSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('product-name').value.trim();
    const price = parseInt(document.getElementById('product-price').value);
    const image = document.getElementById('product-image').value.trim();
    const badge = document.getElementById('product-badge').value;

    if (!name || !price || !image) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }

    if (currentEditingId) {
        // Update existing product
        const index = products.findIndex(p => p.id === currentEditingId);
        if (index !== -1) {
            products[index] = { ...products[index], name, price, image, badge: badge || undefined };
        }
    } else {
        // Add new product
        const newId = Math.max(...products.map(p => p.id), 0) + 1;
        products.push({
            id: newId,
            name,
            price,
            image,
            badge: badge || undefined
        });
    }

    saveProducts();
    updateStats();
    renderProductsTable();
    closeModal();
    showToast(currentEditingId ? 'Sản phẩm đã được cập nhật!' : 'Sản phẩm mới đã được thêm!');
}

// Delete product
function deleteProduct(id) {
    productToDelete = id;
    document.getElementById('delete-modal').classList.remove('hidden');
}

// Confirm delete
function confirmDelete() {
    if (!productToDelete) return;

    products = products.filter(p => p.id !== productToDelete);
    saveProducts();
    updateStats();
    renderProductsTable();
    closeDeleteModal();
    showToast('Sản phẩm đã được xóa!');
}

// Close modals
function closeModal() {
    document.getElementById('product-modal').classList.add('hidden');
    currentEditingId = null;
}

function closeDeleteModal() {
    document.getElementById('delete-modal').classList.add('hidden');
    productToDelete = null;
}

// Save products to localStorage
function saveProducts() {
    localStorage.setItem('ecoshop_products', JSON.stringify(products));
}

// Export products data
function exportProducts() {
    const dataStr = JSON.stringify(products, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'ecoshop_products.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Dữ liệu đã được xuất!');
}

// Refresh products (reload from localStorage)
function refreshProducts() {
    products = JSON.parse(localStorage.getItem('ecoshop_products')) || products;
    updateStats();
    renderProductsTable();
    showToast('Đã làm mới danh sách sản phẩm!');
}

// Filter products
function filterProducts() {
    const filterBadge = document.getElementById('filter-badge').value;
    const searchTerm = document.getElementById('search-admin').value;
    renderProductsTable(filterBadge, searchTerm);
}

// Update current time
function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('current-time').textContent = timeString;
}

// Toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '30px';
    toast.style.right = '30px';
    toast.style.backgroundColor = '#10b981';
    toast.style.color = 'white';
    toast.style.padding = '16px 24px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 10px 15px -3px rgb(0 0 0 / 0.2)';
    toast.style.zIndex = '99999';
    toast.style.maxWidth = '300px';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.transition = 'all 0.4s ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// Initialize when page loads
window.onload = initializeAdmin;