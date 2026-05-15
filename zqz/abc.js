  // Tailwind script already included via CDN

function initTailwind() {
    // Already configured via CDN
}

// Sample products - load from localStorage if available (for admin sync)
const products = JSON.parse(localStorage.getItem('ecoshop_products')) || [
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
    },
    {
        id: 5,
        name: "Khăn giấy tái chế",
        price: 85000,
        image: "https://picsum.photos/id/669/600/600",
        badge: "ECO"
    },
    {
        id: 6,
        name: "Đèn LED tiết kiệm năng lượng",
        price: 195000,
        image: "https://picsum.photos/id/870/600/600",
        badge: "SALE"
    },
    {
        id: 7,
        name: "Hộp cơm trưa tre",
        price: 165000,
        image: "https://picsum.photos/id/431/600/600"
    },
    {
        id: 8,
        name: "Sữa rửa mặt thiên nhiên",
        price: 285000,
        image: "https://picsum.photos/id/201/600/600",
        badge: "NEW"
    },
    {
        id: 9,
        name: "Ví da tái chế",
        price: 395000,
        image: "https://picsum.photos/id/251/600/600",
        badge: "HOT"
    },
    {
        id: 10,
        name: "Ống hút tre (50 cái)",
        price: 75000,
        image: "https://picsum.photos/id/1005/600/600"
    },
    {
        id: 11,
        name: "Balo dã ngoại bền vững",
        price: 525000,
        image: "https://picsum.photos/id/669/600/600",
        badge: "BEST"
    },
    {
        id: 12,
        name: "Dầu gội thảo mộc",
        price: 320000,
        image: "https://picsum.photos/id/870/600/600"
    }
];;

// Render products
function renderProducts() {
    const container = document.getElementById('products-grid')
    container.innerHTML = ''

    products.forEach(product => {
        const cardHTML = `
            <div class="product-card bg-white rounded-3xl overflow-hidden shadow group">
                <div class="relative">
                    <img src="${product.image}" alt="${product.name}"
                         class="w-full aspect-square object-cover transition-transform group-hover:scale-105">
                    ${product.badge ? `
                    <div class="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-4 py-1 rounded-3xl">
                        ${product.badge}
                    </div>` : ''}
                </div>
                <div class="p-6">
                    <div class="font-semibold text-lg mb-1">${product.name}</div>
                    <div class="flex justify-between items-end">
                        <div>
                          <span class="text-2xl font-semibold text-emerald-700">${(product.price / 1000).toFixed(0)}k</span>
                        </div>
                        <button onclick="addToCart(${product.id})"
                                class="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-6 py-3 rounded-2xl text-sm font-medium transition">
                            Thêm giỏ
                        </button>
                    </div>
                </div>
            </div>
        `
        container.innerHTML += cardHTML
    })
}

// Cart
let cart = JSON.parse(localStorage.getItem('ecoshop_cart')) || []

function addToCart(id) {
    const product = products.find(p => p.id === id)
    if (!product) return

    cart.push({...product})
    saveCart()
    updateCartCount()

    // Toast
    showToast(`${product.name} đã được thêm vào giỏ hàng!`)
}

function updateCartCount() {
    document.getElementById('cart-count').textContent = cart.length
}

function toggleCart() {
    const modal = document.getElementById('cart-modal')
    modal.classList.toggle('hidden')

    if (!modal.classList.contains('hidden')) {
        renderCartItems()
    }
}

function renderCartItems() {
    const container = document.getElementById('cart-items')
    let html = ''

    if (cart.length === 0) {
        html = `
            <div class="text-center py-20 text-gray-400">
                <i class="fa-solid fa-bag-shopping text-7xl mb-6"></i>
                <p class="text-lg">Giỏ hàng của bạn đang trống</p>
            </div>
        `
    } else {
        html = cart.map((item, index) => `
            <div class="flex gap-4 mb-6 last:mb-0">
                <img src="${item.image}" class="w-20 h-20 object-cover rounded-2xl" alt="">
                <div class="flex-1">
                    <div class="font-medium">${item.name}</div>
                    <div class="text-emerald-600">${(item.price / 1000).toFixed(0)}k ₫</div>
                </div>
                <button onclick="removeFromCart(${index})" class="text-red-400 hover:text-red-600">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `).join('')
    }

    container.innerHTML = html
    document.getElementById('cart-total').textContent =
        cart.reduce((sum, item) => sum + item.price, 0).toLocaleString('vi-VN') + ' ₫'
}

function removeFromCart(index) {
    cart.splice(index, 1)
    saveCart()
    renderCartItems()
    updateCartCount()
}

function saveCart() {
    localStorage.setItem('ecoshop_cart', JSON.stringify(cart))
}

function checkout() {
    if (cart.length === 0) {
        alert('Giỏ hàng của bạn đang trống!')
        return
    }

    // Save cart and redirect to payment page
    saveCart()
    window.location.href = 'payment.html'

// Toast notification
function showToast(message) {
    const toast = document.createElement('div')
    toast.style.position = 'fixed'
    toast.style.bottom = '30px'
    toast.style.left = '50%'
    toast.style.transform = 'translateX(-50%)'
    toast.style.backgroundColor = '#10b981'
    toast.style.color = 'white'
    toast.style.padding = '16px 24px'
    toast.style.borderRadius = '9999px'
    toast.style.boxShadow = '0 10px 15px -3px rgb(0 0 0 / 0.2)'
    toast.style.zIndex = '99999'
    toast.style.whiteSpace = 'nowrap'
    toast.textContent = message
    document.body.appendChild(toast)

    setTimeout(() => {
        toast.style.transition = 'all 0.4s ease'
        toast.style.opacity = '0'
        toast.style.transform = 'translateX(-50%) translateY(20px)'
        setTimeout(() => toast.remove(), 400)
    }, 2800)
}

// Navbar scroll effect
function handleNavbarScroll() {
    const navbar = document.getElementById('navbar')
    if (window.scrollY > 80) {
        navbar.classList.add('nav-scrolled')
    } else {
        navbar.classList.remove('nav-scrolled')
    }
}

// Mobile menu
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu')
    menu.classList.toggle('hidden')
}

// Smooth scroll helper
function smoothScrollTo(sectionId) {
    const element = document.getElementById(sectionId)
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
    }
    // Close mobile menu if open
    const mobileMenu = document.getElementById('mobile-menu')
    if (!mobileMenu.classList.contains('hidden')) mobileMenu.classList.add('hidden')
}

// Scroll reveal
function initScrollReveal() {
    const reveals = document.querySelectorAll('.scroll-reveal')

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active')
            }
        })
    }, {
        threshold: 0.15
    })

    reveals.forEach(el => observer.observe(el))
}

// Keyboard support
function handleKeyboard(e) {
    if (e.metaKey && e.key === "k") {
        e.preventDefault()
        document.getElementById('search-input').focus()
    }
}

// Fake search
function initSearch() {
    const searchInput = document.getElementById('search-input')
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = this.value.trim()
            if (query) {
                showToast(`Đang tìm kiếm: "${query}"...`)
                // In real app, filter products
                setTimeout(() => {
                    document.getElementById('featured').scrollIntoView({ behavior: 'smooth' })
                }, 800)
            }
        }
    })
}

// Initialize everything
function initialize() {
    renderProducts()
    updateCartCount()
    initScrollReveal()
    initSearch()
    initUserAuth()

    // Navbar scroll
    window.addEventListener('scroll', handleNavbarScroll)

    // Keyboard shortcut hint
    document.addEventListener('keydown', handleKeyboard)

    // Demo: add one item to cart after 3 seconds
    setTimeout(() => {
        if (cart.length === 0) {
            // cart.push(products[0])
            // updateCartCount()
        }
    }, 3200)

    // Make hero more dynamic
    console.log('%cEcoShop website demo loaded successfully 🌍', 'color:#10b981; font-family:monospace')
}

// Initialize user authentication
function initUserAuth() {
    const user = getCurrentUser()
    updateAuthUI(user)
}

// Update authentication UI
function updateAuthUI(user) {
    const desktopMenu = document.querySelector('.hidden.md\\:flex.items-center.gap-x-8')
    const mobileMenu = document.getElementById('mobile-menu')

    if (user) {
        // User is logged in - show user menu
        const userMenu = `
            <div class="flex items-center gap-x-4 ml-4 pl-4 border-l border-gray-300">
                <div class="flex items-center gap-x-2 text-gray-700">
                    <i class="fa-solid fa-user-circle text-lg"></i>
                    <span class="text-sm font-medium">${user.firstName} ${user.lastName}</span>
                </div>
                <button onclick="logoutUser()" class="text-gray-600 hover:text-red-600 transition-colors text-sm">
                    <i class="fa-solid fa-sign-out-alt mr-1"></i>Đăng xuất
                </button>
            </div>
        `

        // Update desktop menu
        if (desktopMenu) {
            const authSection = desktopMenu.querySelector('.flex.items-center.gap-x-4.ml-4')
            if (authSection) {
                authSection.outerHTML = userMenu
            }
        }

        // Update mobile menu
        if (mobileMenu) {
            const mobileAuthSection = mobileMenu.querySelector('.pt-4.border-t.space-y-3')
            if (mobileAuthSection) {
                mobileAuthSection.innerHTML = `
                    <div class="px-6 py-3 bg-gray-50 rounded-2xl">
                        <div class="flex items-center gap-x-3">
                            <i class="fa-solid fa-user-circle text-emerald-600 text-lg"></i>
                            <div>
                                <div class="font-medium text-gray-900">${user.firstName} ${user.lastName}</div>
                                <div class="text-xs text-gray-500">${user.email}</div>
                            </div>
                        </div>
                    </div>
                    <button onclick="logoutUser()" class="block w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl font-medium text-center transition-colors">
                        <i class="fa-solid fa-sign-out-alt mr-2"></i>Đăng xuất
                    </button>
                `
            }
        }
    }
}

// Auto start
window.onload = initialize