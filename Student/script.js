// Simulated user database
const users = [
    { username: "student1@dssc.edu.ph", password: "pass123", name: "Alice Smith" },
     { username: "123@g", password: "123", name: "dess" },
    { username: "student2@dssc.edu.ph", password: "pass456", name: "Bob Johnson" },
    { username: "student3@dssc.edu.ph", password: "pass789", name: "Clara Lee" }
];

// Simulated login state
let isLoggedIn = false;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize elements
    const studentLoginButton = document.getElementById('student-login-button');
    const studentLoginModal = document.getElementById('student-login-modal');
    const studentLoginForm = document.getElementById('student-login-form');
    const roomCards = document.querySelectorAll('.room-card');
    const roomDetailsModal = document.getElementById('room-details-modal');
    const loginToBookLink = document.getElementById('login-to-book-link');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const modals = document.querySelectorAll('.modal');
    const passwordToggles = document.querySelectorAll('.password-toggle');
    const forgotPasswordLinks = document.querySelectorAll('.forgot-password a');
    const forgotPasswordModal = document.getElementById('forgot-password-modal');
    const signInLink = document.getElementById('sign-in-link');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const seeSampleLink = document.getElementById('see-sample-link');
    const samplePictureModal = document.getElementById('sample-picture-modal');
    const loginModal = document.getElementById('login-modal');
    const loginButton = document.getElementById('login-button');
    // Room data
    const roomData = {
        'single-study': {
            title: 'Single Study Room',
            description: 'A private room ideal for students who prefer solitude and focus, offering a quiet space for studying and personal growth.',
            amenities: [
                '<i class="fas fa-bed"></i> Single bed with comfortable mattress and bedding',
                '<i class="fas fa-desktop"></i> Study desk with ergonomic chair',
                '<i class="fas fa-fan"></i> Ceiling fan for ventilation',
                '<i class="fas fa-wifi"></i> High-speed Wi-Fi for academic research',
                '<i class="fas fa-archive"></i> Personal wardrobe and lockable storage',
                '<i class="fas fa-bath"></i> Private bathroom with hot water',
                '<i class="fas fa-book"></i> Small bookshelf for textbooks and study materials',
                '<i class="fas fa-lightbulb"></i> Desk lamp for late-night studying'
            ],
            price: 'P3,500/month',
            availability: '3 Available'
        },
        'twin-sharing': {
            title: 'Twin Sharing Room',
            description: 'A cozy room designed for two students, promoting collaboration and camaraderie while maintaining personal space.',
            amenities: [
                '<i class="fas fa-bed"></i> Two single beds with mattresses',
                '<i class="fas fa-desktop"></i> Shared study desk with two chairs',
                '<i class="fas fa-fan"></i> Ceiling fan and ample ventilation',
                '<i class="fas fa-wifi"></i> High-speed Wi-Fi access',
                '<i class="fas fa-archive"></i> Individual lockers for secure storage',
                '<i class="fas fa-bath"></i> Shared bathroom (within the boarding house)',
                '<i class="fas fa-utensils"></i> Access to communal kitchenette with microwave and kettle',
                '<i class="fas fa-book"></i> Wall-mounted shelf for books and personal items'
            ],
            price: 'P2,800/month',
            availability: '8 Available'
        },
        'quad-dorm': {
            title: 'Quad Dorm Room',
            description: 'A budget-friendly room for four students, perfect for fostering a sense of community and teamwork among peers.',
            amenities: [
                '<i class="fas fa-bed"></i> Two bunk beds (four sleeping spaces)',
                '<i class="fas fa-desktop"></i> Shared study table with chairs',
                '<i class="fas fa-fan"></i> Electric fan for air circulation',
                '<i class="fas fa-wifi"></i> High-speed Wi-Fi for group projects',
                '<i class="fas fa-archive"></i> Personal storage cubbies for each student',
                '<i class="fas fa-bath"></i> Access to shared bathroom facilities',
                '<i class="fas fa-couch"></i> Communal lounge access for relaxation',
                '<i class="fas fa-chalkboard"></i> Whiteboard for study notes and brainstorming'
            ],
            price: 'P1,300/month',
            availability: '5 Available'
        },
        'premium-studio': {
            title: 'Premium Studio Room',
            description: 'A spacious, upscale room for one or two students seeking extra comfort and convenience, ideal for a premium boarding experience.',
            amenities: [
                '<i class="fas fa-bed"></i> Double bed or two single beds with premium bedding',
                '<i class="fas fa-desktop"></i> Private study nook with desk and chair',
                '<i class="fas fa-snowflake"></i> Air conditioning unit',
                '<i class="fas fa-wifi"></i> High-speed Wi-Fi (dedicated bandwidth)',
                '<i class="fas fa-bath"></i> Private bathroom with hot/cold shower',
                '<i class="fas fa-utensils"></i> Mini fridge and microwave',
                '<i class="fas fa-lock"></i> Personal safe for valuables',
                '<i class="fas fa-kitchen-set"></i> Access to a fully equipped communal kitchen'
            ],
            price: 'P4,500/month',
            availability: '2 Available'
        }
    };

    // Utility function to show notifications
    function showNotification(modalType, message, isWarning = false) {
        const notification = document.getElementById(`${modalType}login-notification`);
        const messageElement = document.getElementById(`${modalType}login-notification-message`);
        if (notification && messageElement) {
            notification.classList.toggle('warning-notification', isWarning);
            messageElement.textContent = message;
            notification.style.display = 'flex';
            setTimeout(() => hideNotification(modalType), 4000);
        }
    }

    function hideNotification(modalType) {
        const notification = document.getElementById(`${modalType}login-notification`);
        if (notification) {
            notification.style.display = 'none';
            notification.classList.remove('warning-notification');
        }
    }

    // Student login button
    if (studentLoginButton && studentLoginModal) {
        studentLoginButton.addEventListener('click', (e) => {
            e.preventDefault();
            studentLoginModal.style.display = 'flex';
        });
    }

    // Student login form handling
   if (studentLoginForm) {
    studentLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('student-email').value.trim();
        const password = document.getElementById('student-password').value.trim();
        const user = {"name": "TEST", "username": "username"}
        
        if (user) {
            isLoggedIn = true;
            window.location.href = '/Portfolio/Student/student.html';

            localStorage.setItem('currentUser', JSON.stringify({ name: user.name, email: user.username }));
            localStorage.setItem('justLoggedIn', 'true'); // Set flag for animation
            showNotification('student-', `Welcome, ${user.name}! Redirecting...`);
            studentLoginForm.reset();
            setTimeout(() => {
                studentLoginModal.style.display = 'none';
                window.location.href = '/Portfolio/Student/student.html';
            }, 1000); // 1-second delay for notification
        } else {
            showNotification('student-', 'Invalid email or password.', true);
        }
    });
}

    // Admin login button
    if (loginButton && loginModal) {
        loginButton.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'flex';
        });
    }

    // Admin login form handling
    const adminLoginForm = document.getElementById('modal-login-form');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('admin-email').value.trim();
            const password = document.getElementById('admin-password').value.trim();
            if (email && password) {
                showNotification('', 'Admin login successful!');
                adminLoginForm.reset();
                loginModal.style.display = 'none';
                window.location = "/Portfolio/Admin/admin.html"
            } else {
                showNotification('', 'Please enter both email and password.', true);
            }
        });
    }

    // Room card click handler
    if (roomCards && roomDetailsModal) {
        roomCards.forEach(card => {
            card.addEventListener('click', () => {
                const roomType = card.getAttribute('data-type');
                const data = roomData[roomType];
                if (data) {
                    document.getElementById('room-details-title').textContent = data.title;
                    document.getElementById('room-details-description').textContent = data.description;
                    document.getElementById('room-details-amenities').innerHTML = data.amenities.map(item => `<li>${item}</li>`).join('');
                    document.getElementById('room-details-price').textContent = `Price: ${data.price}`;
                    document.getElementById('room-details-availability').textContent = `Availability: ${data.availability}`;
                    document.getElementById('login-to-book').style.display = isLoggedIn ? 'none' : 'block';
                    roomDetailsModal.style.display = 'flex';
                }
            });
        });
    }

    // Login to book link
    if (loginToBookLink && studentLoginModal) {
        loginToBookLink.addEventListener('click', (e) => {
            e.preventDefault();
            roomDetailsModal.style.display = 'none';
            studentLoginModal.style.display = 'flex';
        });
    }

    // Mobile menu toggle
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('mobile-nav-open');
        });
    }

    // Close modals
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                if (modal.id === 'forgot-password-modal' && window.previousModal) {
                    window.previousModal.style.display = 'flex';
                }
            }
        });
        const closeButton = modal.querySelector('.close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                modal.style.display = 'none';
                if (modal.id === 'forgot-password-modal' && window.previousModal) {
                    window.previousModal.style.display = 'flex';
                }
            });
        }
    });

    // Password toggle
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const passwordInput = toggle.previousElementSibling;
            const icon = toggle.querySelector('i');
            passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
            icon.classList.toggle('fa-eye', passwordInput.type === 'password');
            icon.classList.toggle('fa-eye-slash', passwordInput.type === 'text');
        });
    });

    // Forgot password functionality
    let previousModal = null;
    forgotPasswordLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            previousModal = link.closest('.modal');
            if (previousModal && forgotPasswordModal) {
                previousModal.style.display = 'none';
                const studentIdGroup = document.getElementById('student-id-group');
                const emailGroup = document.getElementById('email-group');
                const forgotSubmitButton = document.getElementById('forgot-submit-button');
                if (previousModal.id === 'student-login-modal') {
                    studentIdGroup.style.display = 'block';
                    emailGroup.style.display = 'block';
                    forgotSubmitButton.textContent = 'Send Password Reset Link';
                } else {
                    studentIdGroup.style.display = 'none';
                    emailGroup.style.display = 'block';
                    forgotSubmitButton.textContent = 'Submit';
                }
                forgotPasswordModal.style.display = 'flex';
            }
        });
    });

    if (signInLink) {
        signInLink.addEventListener('click', (e) => {
            e.preventDefault();
            forgotPasswordModal.style.display = 'none';
            if (previousModal) previousModal.style.display = 'flex';
        });
    }

    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const studentId = document.getElementById('forgot-student-id').value.trim();
            const email = document.getElementById('forgot-email').value.trim();
            if (previousModal.id === 'student-login-modal') {
                if (studentId && email && users.some(u => u.username === email)) {
                    showNotification('forgot-password-', 'Password reset instructions sent! Check your email.');
                    forgotPasswordForm.reset();
                    setTimeout(() => {
                        forgotPasswordModal.style.display = 'none';
                        if (previousModal) previousModal.style.display = 'flex';
                    }, 2000);
                } else {
                    showNotification('forgot-password-', 'Invalid Student ID or email.', true);
                }
            } else {
                if (email) {
                    showNotification('forgot-password-', 'Password reset instructions sent! Check your email.');
                    forgotPasswordForm.reset();
                    setTimeout(() => {
                        forgotPasswordModal.style.display = 'none';
                        if (previousModal) previousModal.style.display = 'flex';
                    }, 2000);
                } else {
                    showNotification('forgot-password-', 'Please enter your email.', true);
                }
            }
        });
    }

    // Sample picture modal
    if (seeSampleLink && samplePictureModal) {
        seeSampleLink.addEventListener('click', (e) => {
            e.preventDefault();
            samplePictureModal.style.display = 'flex';
        });
        samplePictureModal.querySelector('.close')?.addEventListener('click', () => {
            samplePictureModal.style.display = 'none';
        });
    }

    // Notification close buttons
    ['login-notification-close', 'student-login-notification-close', 'forgot-password-notification-close'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', () => hideNotification(id.split('-')[0] + '-'));
        }
    });

    // Highlight menu
    const menuLinks = document.querySelectorAll('#nav-menu a[href^="#"]');
    function updateActiveMenu() {
        const fromTop = window.scrollY + 100;
        menuLinks.forEach(link => {
            const section = document.querySelector(link.getAttribute('href'));
            if (section && section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    window.addEventListener('scroll', updateActiveMenu);
    updateActiveMenu();
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = document.querySelector(link.getAttribute('href'));
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                history.pushState(null, null, link.getAttribute('href'));
            }
        });
    });

    // Address to map
    const addressCard = document.getElementById('address-card');
    if (addressCard) {
        addressCard.addEventListener('click', () => {
            document.getElementById('location')?.scrollIntoView({ behavior: 'smooth' });
        });
        addressCard.style.cursor = 'pointer';
    }
});

