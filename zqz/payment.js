// Payment page JavaScript for EcoShop

// Cart data - load from localStorage
let cart = JSON.parse(localStorage.getItem('ecoshop_cart')) || [];
let orderData = {};

// Initialize payment page
function initializePayment() {
    loadCartItems();
    setupEventListeners();
    updateOrderSummary();

    // Redirect if cart is empty
    if (cart.length === 0) {
        alert('Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm trước khi thanh toán.');
        window.location.href = 'abc.html';
        return;
    }
}

// Load cart items from localStorage
function loadCartItems() {
    const savedCart = localStorage.getItem('ecoshop_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Payment method selection
    document.querySelectorAll('.payment-method-option').forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            document.querySelectorAll('.payment-method-option').forEach(opt => {
                opt.classList.remove('selected');
            });

            // Add selected class to clicked option
            this.classList.add('selected');

            // Check the radio button
            const radio = this.querySelector('input[type="radio"]');
            radio.checked = true;

            // Show/hide bank details
            const bankDetails = document.getElementById('bank-details');
            if (this.dataset.method === 'bank') {
                bankDetails.classList.remove('hidden');
            } else {
                bankDetails.classList.add('hidden');
            }
        });
    });

    // Place order button
    document.getElementById('place-order-btn').addEventListener('click', handlePlaceOrder);

    // Form validation
    document.getElementById('shipping-form').addEventListener('submit', function(e) {
        e.preventDefault();
    });
}

// Update order summary
function updateOrderSummary() {
    const orderItemsContainer = document.getElementById('order-items');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total-amount');

    if (cart.length === 0) {
        orderItemsContainer.innerHTML = '<p class="text-gray-500 text-center py-4">Giỏ hàng trống</p>';
        subtotalElement.textContent = '0đ';
        totalElement.textContent = '0đ';
        return;
    }

    // Render order items
    orderItemsContainer.innerHTML = cart.map(item => `
        <div class="order-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="order-item-details">
                <div class="name">${item.name}</div>
                <div class="price">${formatCurrency(item.price)}</div>
            </div>
            <div class="text-right">
                <div class="font-medium">${formatCurrency(item.price)}</div>
            </div>
        </div>
    `).join('');

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const shippingFee = subtotal >= 500000 ? 0 : 30000; // Free shipping over 500k
    const total = subtotal + shippingFee;

    subtotalElement.textContent = formatCurrency(subtotal);
    document.getElementById('shipping-fee').textContent = shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee);
    totalElement.textContent = formatCurrency(total);
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// Handle place order
function handlePlaceOrder() {
    // Validate form
    const form = document.getElementById('shipping-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Get form data
    const shippingInfo = {
        fullName: document.getElementById('full-name').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        email: document.getElementById('email').value.trim(),
        address: document.getElementById('address').value.trim(),
        notes: document.getElementById('notes').value.trim()
    };

    // Get payment method
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const shippingFee = subtotal >= 500000 ? 0 : 30000;
    const total = subtotal + shippingFee;

    // Create order data
    orderData = {
        orderCode: generateOrderCode(),
        items: [...cart],
        shippingInfo,
        paymentMethod,
        subtotal,
        shippingFee,
        total,
        orderDate: new Date().toISOString(),
        status: 'pending'
    };

    // Show loading state
    const btn = document.getElementById('place-order-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i>Đang xử lý...';
    btn.disabled = true;

    // Simulate processing delay
    setTimeout(() => {
        // Save order to localStorage
        saveOrder(orderData);

        // Clear cart
        localStorage.removeItem('ecoshop_cart');

        // Show success modal
        showSuccessModal(orderData.orderCode);

        // Reset button
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 2000);
}

// Generate order code
function generateOrderCode() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ECO${timestamp}${random}`;
}

// Save order to localStorage
function saveOrder(order) {
    const orders = JSON.parse(localStorage.getItem('ecoshop_orders')) || [];
    orders.push(order);
    localStorage.setItem('ecoshop_orders', JSON.stringify(orders));
}

// Show success modal
function showSuccessModal(orderCode) {
    document.getElementById('order-code').textContent = orderCode;
    document.getElementById('success-modal').classList.remove('hidden');
}

// Print order (basic implementation)
function printOrder() {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Đơn hàng ${orderData.orderCode}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .info { margin-bottom: 20px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                .total { font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>EcoShop - Đơn hàng</h1>
                <p>Mã đơn: ${orderData.orderCode}</p>
                <p>Ngày đặt: ${new Date(orderData.orderDate).toLocaleString('vi-VN')}</p>
            </div>

            <div class="info">
                <h3>Thông tin khách hàng:</h3>
                <p>Họ tên: ${orderData.shippingInfo.fullName}</p>
                <p>SĐT: ${orderData.shippingInfo.phone}</p>
                <p>Email: ${orderData.shippingInfo.email}</p>
                <p>Địa chỉ: ${orderData.shippingInfo.address}</p>
                ${orderData.shippingInfo.notes ? `<p>Ghi chú: ${orderData.shippingInfo.notes}</p>` : ''}
            </div>

            <h3>Sản phẩm:</h3>
            <table>
                <thead>
                    <tr>
                        <th>Sản phẩm</th>
                        <th>Giá</th>
                    </tr>
                </thead>
                <tbody>
                    ${orderData.items.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${formatCurrency(item.price)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="total">
                <p>Tạm tính: ${formatCurrency(orderData.subtotal)}</p>
                <p>Phí vận chuyển: ${orderData.shippingFee === 0 ? 'Miễn phí' : formatCurrency(orderData.shippingFee)}</p>
                <p>Tổng cộng: ${formatCurrency(orderData.total)}</p>
            </div>

            <div class="info">
                <p>Phương thức thanh toán: ${getPaymentMethodName(orderData.paymentMethod)}</p>
                <p>Trạng thái: Chờ xử lý</p>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Get payment method name
function getPaymentMethodName(method) {
    const methods = {
        'cod': 'Thanh toán khi nhận hàng',
        'bank': 'Chuyển khoản ngân hàng',
        'momo': 'Ví điện tử MoMo'
    };
    return methods[method] || method;
}

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '30px';
    toast.style.right = '30px';
    toast.style.backgroundColor = type === 'success' ? '#10b981' : '#ef4444';
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
window.onload = initializePayment;