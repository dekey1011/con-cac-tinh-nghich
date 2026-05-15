// Authentication JavaScript for EcoShop

// User session management
let currentUser = null;

// Initialize auth page
function initializeAuth() {
    checkCurrentUser();
    setupFormValidation();
}

// Check if user is already logged in
function checkCurrentUser() {
    const user = localStorage.getItem('ecoshop_current_user');
    if (user) {
        currentUser = JSON.parse(user);
        // If on login/signup page and user is logged in, redirect to main page
        if (window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html')) {
            showToast('Bạn đã đăng nhập!', 'success');
            setTimeout(() => {
                window.location.href = 'abc.html';
            }, 1500);
        }
    }
}

// Setup form validation and event listeners
function setupFormValidation() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Signup form
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);

        // Password strength indicator
        const passwordInput = document.getElementById('signup-password');
        if (passwordInput) {
            passwordInput.addEventListener('input', updatePasswordStrength);
        }

        // Confirm password validation
        const confirmPasswordInput = document.getElementById('confirm-password');
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', validateConfirmPassword);
        }
    }
}

// Handle login
function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading-spinner mr-2"></span>Đang đăng nhập...';
    submitBtn.disabled = true;

    // Simulate API call delay
    setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('ecoshop_users')) || [];

        // Check for demo credentials
        if (email === 'demo@ecoshop.vn' && password === 'demo123') {
            const demoUser = {
                id: 'demo',
                firstName: 'Demo',
                lastName: 'User',
                email: 'demo@ecoshop.vn',
                phone: '0123456789',
                role: 'user'
            };
            loginUser(demoUser, rememberMe);
            return;
        }

        // Find user
        const user = users.find(u => (u.email === email || u.phone === email) && u.password === password);

        if (user) {
            loginUser(user, rememberMe);
        } else {
            showError('Email/SĐT hoặc mật khẩu không đúng!');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }, 1500);
}

// Handle signup
function handleSignup(e) {
    e.preventDefault();

    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const phone = document.getElementById('signup-phone').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validation
    if (password !== confirmPassword) {
        showError('Mật khẩu xác nhận không khớp!');
        return;
    }

    if (password.length < 6) {
        showError('Mật khẩu phải có ít nhất 6 ký tự!');
        return;
    }

    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading-spinner mr-2"></span>Đang tạo tài khoản...';
    submitBtn.disabled = true;

    // Simulate API call delay
    setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('ecoshop_users')) || [];

        // Check if email or phone already exists
        const existingUser = users.find(u => u.email === email || u.phone === phone);
        if (existingUser) {
            showError('Email hoặc số điện thoại đã được sử dụng!');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            firstName,
            lastName,
            email,
            phone,
            password,
            role: 'user',
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('ecoshop_users', JSON.stringify(users));

        // Auto login after signup
        loginUser(newUser, false);
    }, 2000);
}

// Login user
function loginUser(user, rememberMe) {
    currentUser = user;
    localStorage.setItem('ecoshop_current_user', JSON.stringify(user));

    if (rememberMe) {
        localStorage.setItem('ecoshop_remember_login', 'true');
    }

    showToast('Đăng nhập thành công!', 'success');
    setTimeout(() => {
        window.location.href = 'abc.html';
    }, 1500);
}

// Logout user
function logoutUser() {
    currentUser = null;
    localStorage.removeItem('ecoshop_current_user');
    localStorage.removeItem('ecoshop_remember_login');
    showToast('Đã đăng xuất!');
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const eyeIcon = document.getElementById(inputId + '-eye-icon') || document.getElementById(inputId.replace('-password', '-eye-icon'));

    if (input.type === 'password') {
        input.type = 'text';
        eyeIcon.className = 'fa-solid fa-eye-slash';
    } else {
        input.type = 'password';
        eyeIcon.className = 'fa-solid fa-eye';
    }
}

// Update password strength indicator
function updatePasswordStrength() {
    const password = document.getElementById('signup-password').value;
    const strengthBars = document.querySelectorAll('.strength-bar');

    if (!strengthBars.length) return;

    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;

    strengthBars.forEach((bar, index) => {
        bar.className = 'strength-bar';
        if (index < strength) {
            if (strength <= 1) bar.classList.add('weak');
            else if (strength <= 3) bar.classList.add('medium');
            else bar.classList.add('strong');
        }
    });
}

// Validate confirm password
function validateConfirmPassword() {
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const confirmInput = document.getElementById('confirm-password');

    if (confirmPassword && password !== confirmPassword) {
        confirmInput.setCustomValidity('Mật khẩu xác nhận không khớp');
    } else {
        confirmInput.setCustomValidity('');
    }
}

// Social login/signup (demo)
function loginWithGoogle() {
    showToast('Tính năng đăng nhập Google đang được phát triển...', 'info');
}

function signupWithGoogle() {
    showToast('Tính năng đăng ký Google đang được phát triển...', 'info');
}

function loginWithFacebook() {
    showToast('Tính năng đăng nhập Facebook đang được phát triển...', 'info');
}

function signupWithFacebook() {
    showToast('Tính năng đăng ký Facebook đang được phát triển...', 'info');
}

// Show error message
function showError(message) {
    const errorDiv = document.querySelector('.error-message') || createMessageDiv('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    errorDiv.className = 'error-message';

    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

// Show success message
function showSuccess(message) {
    const successDiv = document.querySelector('.success-message') || createMessageDiv('success');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    successDiv.className = 'success-message';

    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 5000);
}

// Create message div
function createMessageDiv(type) {
    const div = document.createElement('div');
    div.className = type + '-message';
    div.style.display = 'none';

    const form = document.querySelector('form');
    if (form) {
        form.insertBefore(div, form.firstChild);
    }

    return div;
}

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '30px';
    toast.style.right = '30px';
    toast.style.backgroundColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';
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

// Get current user info
function getCurrentUser() {
    return currentUser || JSON.parse(localStorage.getItem('ecoshop_current_user'));
}

// Check if user is logged in
function isLoggedIn() {
    return getCurrentUser() !== null;
}

// Initialize when page loads
window.onload = initializeAuth;