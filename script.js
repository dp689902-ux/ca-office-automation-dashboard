// DOM Elements
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const rememberMeCheckbox = document.getElementById('rememberMe');
const userTypeRadios = document.querySelectorAll('input[name="userType"]');
const tabLabels = document.querySelectorAll('.tab-label');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadSavedCredentials();
    setupUserTypeTabs();
});

// Event Listeners
function initializeEventListeners() {
    // Form submission
    loginForm.addEventListener('submit', handleFormSubmit);
    
    // Input validation on blur
    usernameInput.addEventListener('blur', validateUsername);
    passwordInput.addEventListener('blur', validatePassword);
    
    // Real-time validation on input
    usernameInput.addEventListener('input', clearError);
    passwordInput.addEventListener('input', clearError);
    
    // User type tab switching
    userTypeRadios.forEach(radio => {
        radio.addEventListener('change', handleUserTypeChange);
    });
    
    // Remember me functionality
    rememberMeCheckbox.addEventListener('change', handleRememberMeChange);
    
    // Social login buttons
    document.querySelector('.social-btn.google').addEventListener('click', handleGoogleLogin);
    document.querySelector('.social-btn.facebook').addEventListener('click', handleFacebookLogin);
    
    // Forgot password link
    document.querySelector('.forgot-password').addEventListener('click', handleForgotPassword);
    
    // Live support link
    document.querySelector('.support-link a').addEventListener('click', handleLiveSupport);
}

// Form Submission Handler
function handleFormSubmit(event) {
    event.preventDefault();
    
    const isValid = validateForm();
    
    if (isValid) {
        const formData = getFormData();
        submitLogin(formData);
    }
}

// Form Validation
function validateForm() {
    let isValid = true;
    
    if (!validateUsername()) {
        isValid = false;
    }
    
    if (!validatePassword()) {
        isValid = false;
    }
    
    return isValid;
}

function validateUsername() {
    const username = usernameInput.value.trim();
    const formGroup = usernameInput.closest('.form-group');
    
    if (!username) {
        showError(formGroup, 'Please provide a valid username.');
        return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
        showError(formGroup, 'Please provide a valid email address.');
        return false;
    }
    
    showSuccess(formGroup);
    return true;
}

function validatePassword() {
    const password = passwordInput.value;
    const formGroup = passwordInput.closest('.form-group');
    
    if (!password) {
        showError(formGroup, 'Please provide a valid password.');
        return false;
    }
    
    if (password.length < 6) {
        showError(formGroup, 'Password must be at least 6 characters long.');
        return false;
    }
    
    showSuccess(formGroup);
    return true;
}

function showError(formGroup, message) {
    formGroup.classList.remove('success');
    formGroup.classList.add('error');
    const errorElement = formGroup.querySelector('.error-message');
    errorElement.textContent = message;
}

function showSuccess(formGroup) {
    formGroup.classList.remove('error');
    formGroup.classList.add('success');
}

function clearError(event) {
    const formGroup = event.target.closest('.form-group');
    formGroup.classList.remove('error', 'success');
}

// Get Form Data
function getFormData() {
    return {
        username: usernameInput.value.trim(),
        password: passwordInput.value,
        userType: document.querySelector('input[name="userType"]:checked').value,
        rememberMe: rememberMeCheckbox.checked
    };
}

// Submit Login
function submitLogin(formData) {
    const loginBtn = document.querySelector('.login-btn');
    
    // Show loading state
    loginBtn.classList.add('loading');
    loginBtn.textContent = '';
    
    // Simulate API call
    setTimeout(() => {
        // Hide loading state
        loginBtn.classList.remove('loading');
        loginBtn.textContent = 'Login';
        
        // Save credentials if remember me is checked
        if (formData.rememberMe) {
            saveCredentials(formData);
        } else {
            clearSavedCredentials();
        }
        
        // Show success message
        showLoginSuccess(formData);
        
    }, 2000);
}

function showLoginSuccess(formData) {
    const message = `Login successful!\n\nUser Type: ${formData.userType}\nUsername: ${formData.username}`;
    alert(message);
    
    // In a real application, you would redirect to the dashboard
    // window.location.href = '/dashboard';
}

// User Type Tab Handling
function setupUserTypeTabs() {
    updateTabLabels();
}

function handleUserTypeChange(event) {
    updateTabLabels();
    
    // Update placeholder text based on user type
    const userType = event.target.value;
    if (userType === 'employee') {
        usernameInput.placeholder = 'employee@company.com';
    } else {
        usernameInput.placeholder = 'client@example.com';
    }
}

function updateTabLabels() {
    tabLabels.forEach(label => {
        label.classList.remove('active');
    });
    
    const checkedRadio = document.querySelector('input[name="userType"]:checked');
    const activeLabel = document.querySelector(`label[for="${checkedRadio.id}"]`);
    activeLabel.classList.add('active');
}

// Remember Me Functionality
function handleRememberMeChange(event) {
    if (!event.target.checked) {
        clearSavedCredentials();
    }
}

function saveCredentials(formData) {
    const credentials = {
        username: formData.username,
        userType: formData.userType,
        timestamp: Date.now()
    };
    
    localStorage.setItem('caoa_credentials', JSON.stringify(credentials));
}

function loadSavedCredentials() {
    const saved = localStorage.getItem('caoa_credentials');
    
    if (saved) {
        try {
            const credentials = JSON.parse(saved);
            
            // Check if credentials are not older than 30 days
            const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
            
            if (credentials.timestamp > thirtyDaysAgo) {
                usernameInput.value = credentials.username;
                document.querySelector(`input[value="${credentials.userType}"]`).checked = true;
                rememberMeCheckbox.checked = true;
                updateTabLabels();
            } else {
                clearSavedCredentials();
            }
        } catch (error) {
            console.error('Error loading saved credentials:', error);
            clearSavedCredentials();
        }
    }
}

function clearSavedCredentials() {
    localStorage.removeItem('caoa_credentials');
}

// Password Toggle Functionality
function togglePassword() {
    const passwordField = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password');
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleBtn.textContent = '🙈';
    } else {
        passwordField.type = 'password';
        toggleBtn.textContent = '👁️';
    }
}

// Social Login Handlers
function handleGoogleLogin(event) {
    event.preventDefault();
    
    // In a real application, you would integrate with Google OAuth
    alert('Google login functionality would be implemented here.\n\nThis would redirect to Google OAuth flow.');
}

function handleFacebookLogin(event) {
    event.preventDefault();
    
    // In a real application, you would integrate with Facebook Login
    alert('Facebook login functionality would be implemented here.\n\nThis would redirect to Facebook Login flow.');
}

// Forgot Password Handler
function handleForgotPassword(event) {
    event.preventDefault();
    
    const email = prompt('Please enter your email address to reset your password:');
    
    if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (emailRegex.test(email)) {
            alert(`Password reset instructions have been sent to ${email}`);
        } else {
            alert('Please enter a valid email address.');
        }
    }
}

// Live Support Handler
function handleLiveSupport(event) {
    event.preventDefault();
    
    // In a real application, this would open a chat widget or redirect to support
    const supportOptions = [
        '📞 Call Support: +1-800-CAOA-HELP',
        '💬 Live Chat: Available 24/7',
        '📧 Email: support@caoasoftware.com',
        '📚 Help Center: Browse our knowledge base'
    ].join('\n\n');
    
    alert(`CAOA Support Options:\n\n${supportOptions}`);
}

// Keyboard Navigation
document.addEventListener('keydown', function(event) {
    // Enter key on form elements
    if (event.key === 'Enter') {
        const activeElement = document.activeElement;
        
        if (activeElement === usernameInput) {
            passwordInput.focus();
        } else if (activeElement === passwordInput) {
            loginForm.dispatchEvent(new Event('submit'));
        }
    }
    
    // Escape key to clear form
    if (event.key === 'Escape') {
        clearForm();
    }
});

// Clear Form Function
function clearForm() {
    usernameInput.value = '';
    passwordInput.value = '';
    rememberMeCheckbox.checked = false;
    document.getElementById('employee').checked = true;
    
    // Clear validation states
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error', 'success');
    });
    
    updateTabLabels();
    usernameInput.focus();
}

// Form Auto-save (draft functionality)
let autoSaveTimeout;

function autoSaveForm() {
    clearTimeout(autoSaveTimeout);
    
    autoSaveTimeout = setTimeout(() => {
        const formData = {
            username: usernameInput.value,
            userType: document.querySelector('input[name="userType"]:checked').value,
            timestamp: Date.now()
        };
        
        sessionStorage.setItem('caoa_form_draft', JSON.stringify(formData));
    }, 1000);
}

// Load form draft on page load
function loadFormDraft() {
    const draft = sessionStorage.getItem('caoa_form_draft');
    
    if (draft) {
        try {
            const formData = JSON.parse(draft);
            
            // Only load if draft is less than 1 hour old
            const oneHourAgo = Date.now() - (60 * 60 * 1000);
            
            if (formData.timestamp > oneHourAgo && !usernameInput.value) {
                usernameInput.value = formData.username;
                document.querySelector(`input[value="${formData.userType}"]`).checked = true;
                updateTabLabels();
            }
        } catch (error) {
            console.error('Error loading form draft:', error);
        }
    }
}

// Add auto-save listeners
usernameInput.addEventListener('input', autoSaveForm);
userTypeRadios.forEach(radio => {
    radio.addEventListener('change', autoSaveForm);
});

// Load draft when page loads
document.addEventListener('DOMContentLoaded', loadFormDraft);

// Clear draft when form is submitted successfully
loginForm.addEventListener('submit', function() {
    sessionStorage.removeItem('caoa_form_draft');
});

// Accessibility improvements
function enhanceAccessibility() {
    // Add ARIA labels
    usernameInput.setAttribute('aria-describedby', 'username-error');
    passwordInput.setAttribute('aria-describedby', 'password-error');
    
    // Add role attributes
    document.querySelector('.error-message').setAttribute('role', 'alert');
    document.querySelector('.login-btn').setAttribute('aria-describedby', 'login-status');
    
    // Focus management
    const firstFocusableElement = usernameInput;
    firstFocusableElement.focus();
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', enhanceAccessibility);

// Performance monitoring
function trackPerformance() {
    // Track form completion time
    const startTime = Date.now();
    
    loginForm.addEventListener('submit', function() {
        const completionTime = Date.now() - startTime;
        console.log(`Form completion time: ${completionTime}ms`);
        
        // In a real application, you would send this data to analytics
        // analytics.track('form_completion_time', { duration: completionTime });
    });
}

// Initialize performance tracking
document.addEventListener('DOMContentLoaded', trackPerformance);
