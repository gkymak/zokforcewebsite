// ZOKFORCE Website JavaScript

// DOM elements
let mobileMenuToggle, nav, navLinks, header;

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    nav = document.getElementById('nav');
    navLinks = document.querySelectorAll('.nav__link');
    header = document.querySelector('.header');
    
    initializeNavigation();
    initializeScrollEffects();
    initializeForms();
    initializeMobileMenu();
    initializeAnimations();
    initializeFloatingChatbot();
});

// Navigation functionality
function initializeNavigation() {
    // Handle navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only prevent default for anchor links (starting with #)
            // Allow normal navigation for external links (containing .html or full URLs)
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.replace('#', '');
                scrollToSection(targetId);
                
                // Update active state
                updateActiveNavLink(this);
            }
            
            // Close mobile menu if open
            closeMobileMenu();
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', throttle(updateActiveNavOnScroll, 100));
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = header ? header.offsetHeight : 80;
        const targetPosition = section.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Scroll to contact section (used by CTA buttons)
function scrollToContact() {
    scrollToSection('contact');
}

// Update active navigation link
function updateActiveNavLink(activeLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

// Update active nav link based on scroll position
function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('.section[id]');
    const scrollPosition = window.scrollY + (header ? header.offsetHeight : 80) + 100;
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    // Update active nav link
    if (currentSection) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
}

// Initialize scroll effects
function initializeScrollEffects() {
    // Header scroll effect
    window.addEventListener('scroll', throttle(handleHeaderScroll, 10));
    
    // Parallax and animation effects
    window.addEventListener('scroll', throttle(handleScrollAnimations, 16));
}

// Header scroll effect
function handleHeaderScroll() {
    if (!header) return;
    
    const scrolled = window.scrollY > 50;
    
    if (scrolled) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
}

// Handle scroll-based animations
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.service-card, .case-study, .blog-post, .testimonial');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Mobile menu functionality
function initializeMobileMenu() {
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (nav && mobileMenuToggle && !nav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Close mobile menu on window resize if desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    if (!nav || !mobileMenuToggle) return;
    
    nav.classList.toggle('nav--open');
    mobileMenuToggle.classList.toggle('mobile-menu-toggle--open');
    document.body.classList.toggle('menu-open');
    
    // Animate hamburger menu
    const spans = mobileMenuToggle.querySelectorAll('span');
    spans.forEach((span, index) => {
        if (nav.classList.contains('nav--open')) {
            if (index === 0) span.style.transform = 'rotate(45deg) translate(6px, 6px)';
            if (index === 1) span.style.opacity = '0';
            if (index === 2) span.style.transform = 'rotate(-45deg) translate(6px, -6px)';
        } else {
            span.style.transform = '';
            span.style.opacity = '';
        }
    });
}

function closeMobileMenu() {
    if (!nav || !mobileMenuToggle) return;
    
    nav.classList.remove('nav--open');
    mobileMenuToggle.classList.remove('mobile-menu-toggle--open');
    document.body.classList.remove('menu-open');
    
    // Reset hamburger menu
    const spans = mobileMenuToggle.querySelectorAll('span');
    spans.forEach(span => {
        span.style.transform = '';
        span.style.opacity = '';
    });
}

// Form handling
function initializeForms() {
    // Contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
        
        // Fix form input issues
        const formInputs = contactForm.querySelectorAll('.form-control');
        formInputs.forEach(input => {
            // Prevent unexpected scrolling during input
            input.addEventListener('focus', function(e) {
                e.preventDefault();
                // Small delay to ensure focus is complete
                setTimeout(() => {
                    this.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            });
        });
    }
    

    
    // Form validation
    initializeFormValidation();
}

// Track form submission to prevent duplicates
let isSubmitting = false;

// Handle contact form submission
function handleContactForm(event) {
    event.preventDefault();
    
    // Prevent duplicate submissions
    if (isSubmitting) {
        console.log('Form submission already in progress, ignoring duplicate request');
        return;
    }
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'message'];
    const missingFields = requiredFields.filter(field => !data[field] || data[field].trim() === '');
    
    if (missingFields.length > 0) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // Validate email
    if (!isValidEmail(data.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Set submission flag and disable form
    isSubmitting = true;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    
    // Prepare form data for API
    const contactData = {
        name: data.name,
        email: data.email,
        message: data.message,
        company: data.company || '',
        service: data.service || ''
    };
    
    // Send to Cloudflare Worker API
    sendToContactAPI(contactData)
        .then(response => {
            console.log('Contact API response:', response);
            showNotification(response.message || 'Thank you for your message! We will get back to you soon.', 'success');
            form.reset();
        })
        .catch(error => {
            console.error('Contact API error:', error);
            // Show specific error message if available
            const errorMessage = error.message.includes('API error') 
                ? 'Sorry, there was an error sending your message. Please try again or contact us directly.'
                : error.message;
            showNotification(errorMessage, 'error');
        })
        .finally(() => {
            // Reset submission state and button
            isSubmitting = false;
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        });
}

// Function to send message to Cloudflare Worker API
async function sendToContactAPI(formData) {
    // Use relative URL for same-origin requests (Cloudflare Worker)
    const API_URL = '/api/contact';
    
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
}



// Form validation
function initializeFormValidation() {
    const inputs = document.querySelectorAll('.form-control');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    let isValid = true;
    
    // Remove existing error styling
    field.classList.remove('error');
    removeFieldError(field);
    
    // Check required fields
    if (isRequired && !value) {
        isValid = false;
        showFieldError(field, 'This field is required');
    }
    
    // Email validation
    if (field.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        showFieldError(field, 'Please enter a valid email address');
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
}

function removeFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Initialize animations
function initializeAnimations() {
    // Set initial states for animated elements
    const animatedElements = document.querySelectorAll('.service-card, .case-study, .blog-post, .testimonial');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });
    
    // Trigger initial animation check
    setTimeout(handleScrollAnimations, 100);
    
    // Initialize counters
    initializeCounters();
}

// Counter animation for stats
function initializeCounters() {
    const counters = document.querySelectorAll('.stat__number');
    
    const observerOptions = {
        threshold: 0.7,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                animateCounter(counter);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element) {
    const target = element.textContent.replace(/[^0-9]/g, '');
    const targetNum = parseInt(target);
    const suffix = element.textContent.replace(/[0-9]/g, '');
    let current = 0;
    const increment = targetNum / 30;
    const duration = 2000;
    const stepTime = duration / 30;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= targetNum) {
            current = targetNum;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, stepTime);
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification__content">
            <span class="notification__message">${message}</span>
            <button class="notification__close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
        background: ${type === 'error' ? '#fee2e2' : type === 'success' ? '#d1fae5' : '#dbeafe'};
        border: 1px solid ${type === 'error' ? '#fecaca' : type === 'success' ? '#a7f3d0' : '#bfdbfe'};
        border-radius: 8px;
        padding: 16px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
    `;
    
    const content = notification.querySelector('.notification__content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    `;
    
    const message_el = notification.querySelector('.notification__message');
    message_el.style.cssText = `
        color: ${type === 'error' ? '#991b1b' : type === 'success' ? '#065f46' : '#1e40af'};
        font-size: 14px;
        font-weight: 500;
        line-height: 1.4;
    `;
    
    const closeBtn = notification.querySelector('.notification__close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: ${type === 'error' ? '#991b1b' : type === 'success' ? '#065f46' : '#1e40af'};
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        line-height: 1;
        opacity: 0.7;
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Floating Chatbot functionality
function initializeFloatingChatbot() {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const floatingChatbot = document.getElementById('floating-chatbot');
    
    if (chatbotToggle && floatingChatbot) {
        chatbotToggle.addEventListener('click', function() {
            floatingChatbot.classList.toggle('open');
        });
    }
    
    // Close chatbot when clicking outside
    document.addEventListener('click', function(e) {
        if (floatingChatbot && floatingChatbot.classList.contains('open')) {
            if (!floatingChatbot.contains(e.target)) {
                floatingChatbot.classList.remove('open');
            }
        }
    });
}

// Global CTA functions (called from HTML)
window.scrollToContact = scrollToContact;
window.scrollToSection = scrollToSection;
window.handleContactForm = handleContactForm;

// Add CSS for mobile menu and form fixes
const additionalStyles = `
    @media (max-width: 768px) {
        .nav {
            position: fixed;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(10px);
            border-top: 1px solid var(--color-border);
            transform: translateY(0);
            transition: transform 0.3s ease-out;
            z-index: 999;
        }
        
        .nav--open {
            transform: translateY(-100%);
        }
        
        .nav__list {
            flex-direction: column;
            padding: 24px;
            gap: 16px;
        }
        
        .nav__link {
            padding: 12px 0;
            border-bottom: 1px solid var(--color-border);
            text-align: center;
        }
        
        .nav__link:last-child {
            border-bottom: none;
        }
        
        .menu-open {
            overflow: hidden;
        }
    }
    
    .field-error {
        color: #dc2626;
        font-size: 12px;
        margin-top: 4px;
        display: block;
    }
    
    .form-control.error {
        border-color: #dc2626;
        box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    }
    
    /* Fix form input focus issues */
    .form-control:focus {
        scroll-margin-top: 100px;
    }
    
    /* Smooth scroll behavior */
    html {
        scroll-behavior: smooth;
    }
    
    /* Fix for mobile viewport issues */
    @media (max-width: 768px) {
        .form-control:focus {
            transform: none;
            transition: none;
        }
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Ensure smooth scrolling works in all browsers
if (!CSS.supports('scroll-behavior', 'smooth')) {
    // Add polyfill for smooth scrolling
    window.scrollToSection = function(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = header ? header.offsetHeight : 80;
            const targetPosition = section.offsetTop - headerHeight - 20;
            
            // Manual smooth scroll implementation
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 800;
            let start = null;
            
            function animation(currentTime) {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const run = ease(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(animation);
            }
            
            function ease(t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            }
            
            requestAnimationFrame(animation);
        }
    };
}