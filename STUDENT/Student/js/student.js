$(document).ready(function() {
    try {
        console.log('student.js loaded');

        // Check if user just logged in
        const justLoggedIn = localStorage.getItem('justLoggedIn') === 'true';

        // Initialize animation visibility
        if (justLoggedIn) {
            console.log('Showing login animation');
            $('#loginAnimation').removeClass('hide').css({
                display: 'flex',
                opacity: 1,
                visibility: 'visible'
            });
            $('#studentContainer').css({ display: 'none' });
            
            setTimeout(() => {
                $('.student-icon').addClass('show-icon');
            }, 100);

            setTimeout(() => {
                $('#loginAnimation').addClass('hide').css({ display: 'none' });
                localStorage.removeItem('justLoggedIn');
                $('#studentContainer').addClass('show').css({ display: 'block' });
            }, 2000);
        } else {
            console.log('Skipping login animation');
            $('#loginAnimation').addClass('hide').css({ display: 'none' });
            $('#studentContainer').addClass('show').css({ display: 'block' });
        }

        // Initialize student data
        const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { name: 'Guest', email: 'guest@dssc.edu.ph' };
        const selectedRoom = JSON.parse(localStorage.getItem('selectedRoom'));

        window.studentData = {
            name: currentUser.name,
            email: currentUser.email,
            room: selectedRoom,
            payments: [],
            announcements: [
                {
                    id: 0,
                    title: 'Water Supply Maintenance',
                    content: 'Scheduled maintenance on water supply systems will occur on October 5, 2025, from 8 AM to 12 PM. Please plan accordingly and store water if needed.',
                    date: 'Sep 25, 2025'
                },
                {
                    id: 1,
                    title: 'New Payment Policy',
                    content: 'Starting October 2025, all payments are due by the 15th of each month. Late payments will incur a ₱200 fee. Check the Payments page for details.',
                    date: 'Sep 20, 2025'
                },
                {
                    id: 2,
                    title: 'New Student Orientation',
                    content: 'Join us on October 1, 2025, at 2 PM in the DSSC Multi-Purpose Hall for a boarding house orientation. Learn about dorm policies, facilities, and meet fellow students!',
                    date: 'Sep 15, 2025'
                }
            ]
        };

        console.log('Current user:', currentUser);
        console.log('Student data initialized:', window.studentData);

        // Update UI with user data
        $('#student-name, #student-name-dropdown, #student-name-card').text(currentUser.name);
        $('#student-email-dropdown').text(currentUser.email);
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=4361ee&color=fff`;
        $('#student-profile-img, #student-profile-img-dropdown').attr('src', avatarUrl);

        // Dynamic Welcome Hub
        const $welcomeTitle = $('#welcome-title');
        const $welcomeMessage = $('#welcome-message');
        if (!window.studentData.room) {
            $welcomeMessage.text('Welcome to DSSC Boarding House! Pick your room to get started.');
        } else {
            $welcomeMessage.text(`Welcome back, ${window.studentData.name}! You're all set for your ${window.studentData.room.type} (${window.studentData.room.roomCode}).`);
        }

        // My Room Section
        const $roomContent = $('#room-content');
        const $roomAction = $('#room-action');
        if (!window.studentData.room) {
            $roomContent.html('<p>No room booked yet.</p>');
            $roomAction.text('Book Now').show().on('click', () => {
                window.location.href = 'room.html';
            });
        } else {
            $roomContent.html(`
                <div class="room-info-container">
                    <div class="room-info-item">
                        <i class="fas fa-bed icon"></i>
                        <div class="info-text">
                            <strong>Type:</strong> ${window.studentData.room.type}
                        </div>
                    </div>
                    <div class="room-info-item">
                        <i class="fas fa-money-bill-wave icon"></i>
                        <div class="info-text">
                            <strong>Rent:</strong> ₱${window.studentData.room.price}/month
                        </div>
                    </div>
                    <div class="room-info-item">
                        <i class="fas fa-info-circle icon"></i>
                        <div class="info-text">
                            <strong>Status:</strong> <span class="status-${window.studentData.room.status.toLowerCase()}">${window.studentData.room.status}</span>
                        </div>
                    </div>
                </div>
            `);
            $roomAction.text('Manage Booking').show().on('click', () => {
                window.location.href = 'room.html';
            });
        }

        // Announcements
        const $announcementsList = $('#announcements-list');
        let announcementHtml = '';
        window.studentData.announcements.forEach(announcement => {
            const truncatedContent = announcement.content.length > 100 
                ? announcement.content.substring(0, 100) + '...' 
                : announcement.content;
            announcementHtml += `
                <div class="announcement-item" data-id="${announcement.id}">
                    <a href="announcements.html?id=${announcement.id}">
                        <div class="announcement-content">
                            <i class="fas fa-bullhorn icon"></i>
                            <div class="announcement-text">
                                <h4>${announcement.title}</h4>
                                <p>${truncatedContent}</p>
                                <p><small>Posted on ${announcement.date}</small></p>
                            </div>
                        </div>
                    </a>
                </div>
            `;
        });
        $announcementsList.html(announcementHtml);

        // Sidebar toggle
        $('#sidebarToggle').on('click', function() {
            $('.sidebar').toggleClass('hidden');
            $('.admin-content').toggleClass('expanded');
            const isHidden = $('.sidebar').hasClass('hidden');
            $(this).find('i').removeClass('fa-bars fa-times').addClass(isHidden ? 'fa-bars' : 'fa-times');
        });

        // Profile dropdown
        $('.admin-profile').on('click', function(e) {
            e.stopPropagation();
            const $dropdown = $('#studentProfileDropdown');
            $dropdown.toggleClass('show');
            
            if ($dropdown.hasClass('show')) {
                const profileOffset = $('.admin-profile').offset();
                const profileHeight = $('.admin-profile').outerHeight();
                $dropdown.css({
                    top: profileHeight + 10,
                    right: $(window).width() - (profileOffset.left + $('.admin-profile').outerWidth())
                });
            }
        });

        // Close dropdown when clicking outside
        $(document).on('click', function(event) {
            const $dropdown = $('#studentProfileDropdown');
            const $profile = $('.admin-profile');
            if (!$dropdown.is(event.target) && !$dropdown.has(event.target).length &&
                !$profile.is(event.target) && !$profile.has(event.target).length) {
                $dropdown.removeClass('show');
            }
        });

        // ========== PROFILE MODAL FUNCTIONALITY ==========
        
        // View Profile Modal Functionality
        function initializeProfileModal() {
            // Remove existing modal if any
            $('#profileModal').remove();
            
            // Get current user data directly from localStorage
            const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { name: 'Guest', email: 'guest@dssc.edu.ph' };
            const selectedRoom = JSON.parse(localStorage.getItem('selectedRoom'));
            
            // Create profile modal HTML with current user data
            const profileModalHTML = `
                <div id="profileModal" class="modal-overlay">
                    <div class="modal profile-modal">
                        <div class="profile-header">
                            <div class="profile-avatar-container">
                                <img id="profile-avatar-img" src="https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=4361ee&color=fff" alt="Profile picture" class="profile-avatar">
                                <button class="change-avatar-btn" title="Change profile picture">
                                    <i class="fas fa-camera"></i>
                                </button>
                            </div>
                            <div class="profile-info-header">
                                <h2 id="profile-modal-name">${currentUser.name}</h2>
                                <p id="profile-modal-email">${currentUser.email}</p>
                                <div class="profile-badges">
                                    <span class="profile-badge">Student</span>
                                    <span class="profile-badge" id="profile-room-badge">${selectedRoom ? `Room ${selectedRoom.roomCode}` : 'No Room'}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="profile-tabs">
                            <button class="profile-tab active" data-tab="personal">Personal Info</button>
                            <button class="profile-tab" data-tab="preferences">Preferences</button>
                            <button class="profile-tab" data-tab="activity">Activity</button>
                        </div>
                        
                        <!-- Personal Info Tab -->
                        <div class="tab-content active" id="personal-tab">
                            <form id="profile-form">
                                <div class="form-grid">
                                    <div class="form-group">
                                        <label class="form-label">Full Name</label>
                                        <input type="text" class="form-input" id="profile-name" value="${currentUser.name}" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Email</label>
                                        <input type="email" class="form-input" id="profile-email" value="${currentUser.email}" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Student ID</label>
                                        <input type="text" class="form-input" id="profile-student-id" value="STU-${Math.random().toString(36).substr(2, 8).toUpperCase()}" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Phone Number</label>
                                        <input type="tel" class="form-input" id="profile-phone" value="+63 912 345 6789" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Emergency Contact</label>
                                        <input type="text" class="form-input" id="profile-emergency-contact" value="Maria Santos" readonly>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Emergency Phone</label>
                                        <input type="tel" class="form-input" id="profile-emergency-phone" value="+63 923 456 7890" readonly>
                                    </div>
                                    <div class="form-group full-width">
                                        <label class="form-label">Address</label>
                                        <input type="text" class="form-input" id="profile-address" value="123 Main Street, Dasmariñas City, Cavite" readonly>
                                    </div>
                                </div>
                                
                                <div class="profile-stats">
                                    <div class="stat-item">
                                        <div class="stat-icon">
                                            <i class="fas fa-home"></i>
                                        </div>
                                        <span class="stat-number" id="stat-days-stayed">${selectedRoom ? '45' : '0'}</span>
                                        <span class="stat-label">Days Stayed</span>
                                    </div>
                                    <div class="stat-item">
                                        <div class="stat-icon">
                                            <i class="fas fa-money-bill-wave"></i>
                                        </div>
                                        <span class="stat-number" id="stat-total-paid">₱${selectedRoom ? selectedRoom.price * 2 : '0'}</span>
                                        <span class="stat-label">Total Paid</span>
                                    </div>
                                    <div class="stat-item">
                                        <div class="stat-icon">
                                            <i class="fas fa-star"></i>
                                        </div>
                                        <span class="stat-number" id="stat-rating">4.8</span>
                                        <span class="stat-label">Rating</span>
                                    </div>
                                    <div class="stat-item">
                                        <div class="stat-icon">
                                            <i class="fas fa-calendar-check"></i>
                                        </div>
                                        <span class="stat-number" id="stat-bookings">${selectedRoom ? '1' : '0'}</span>
                                        <span class="stat-label">Bookings</span>
                                    </div>
                                </div>
                            </form>
                        </div>
                        
                        <!-- Preferences Tab -->
                        <div class="tab-content" id="preferences-tab">
                            <div class="preferences-grid">
                                <div class="preference-item">
                                    <span>Email Notifications</span>
                                    <label class="toggle-switch">
                                        <input type="checkbox" class="toggle-checkbox" checked>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                                <div class="preference-item">
                                    <span>SMS Notifications</span>
                                    <label class="toggle-switch">
                                        <input type="checkbox" class="toggle-checkbox">
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                                <div class="preference-item">
                                    <span>Payment Reminders</span>
                                    <label class="toggle-switch">
                                        <input type="checkbox" class="toggle-checkbox" checked>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                                <div class="preference-item">
                                    <span>Maintenance Updates</span>
                                    <label class="toggle-switch">
                                        <input type="checkbox" class="toggle-checkbox" checked>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Activity Tab -->
                        <div class="tab-content" id="activity-tab">
                            <div class="activity-list">
                                <div class="activity-item">
                                    <div class="activity-icon">
                                        <i class="fas fa-key"></i>
                                    </div>
                                    <div class="activity-content">
                                        <div class="activity-title">Room Check-in</div>
                                        <div class="activity-time">${selectedRoom ? selectedRoom.bookedDate : 'Not booked yet'}</div>
                                    </div>
                                </div>
                                <div class="activity-item">
                                    <div class="activity-icon">
                                        <i class="fas fa-money-bill-wave"></i>
                                    </div>
                                    <div class="activity-content">
                                        <div class="activity-title">Payment Made</div>
                                        <div class="activity-time">Sep 15, 2025 - ₱${selectedRoom ? selectedRoom.price : '0'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="action-buttons">
                            <button type="button" class="btn btn-outline" id="cancel-edit-btn" style="display: none;">
                                <i class="fas fa-times"></i> Cancel
                            </button>
                            <button type="button" class="btn btn-secondary" id="edit-profile-btn">
                                <i class="fas fa-edit"></i> Edit Profile
                            </button>
                            <button type="button" class="btn btn-primary" id="save-profile-btn" style="display: none;">
                                <i class="fas fa-save"></i> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            // Append modal to body
            $('body').append(profileModalHTML);
            
            // Set up event handlers
            setupProfileModalHandlers();
        }

        function setupProfileModalHandlers() {
            // Tab switching
            $(document).on('click', '.profile-tab', function() {
                const tabId = $(this).data('tab');
                
                // Update active tab
                $('.profile-tab').removeClass('active');
                $(this).addClass('active');
                
                // Show corresponding content
                $('.tab-content').removeClass('active');
                $(`#${tabId}-tab`).addClass('active');
            });
            
            // Edit profile button
            $(document).on('click', '#edit-profile-btn', function() {
                enableEditMode();
            });
            
            // Cancel edit button
            $(document).on('click', '#cancel-edit-btn', function() {
                disableEditMode();
                resetFormData();
            });
            
            // Save profile button
            $(document).on('click', '#save-profile-btn', function() {
                saveProfileChanges();
            });
            
            // Close modal when clicking outside
            $(document).on('click', '#profileModal', function(e) {
                if ($(e.target).hasClass('modal-overlay')) {
                    closeProfileModal();
                }
            });
            
            // Change avatar button
            $(document).on('click', '.change-avatar-btn', function() {
                // Avatar change functionality
            });
        }

        function enableEditMode() {
            $('#profile-form').addClass('edit-mode');
            $('#profile-name, #profile-phone, #profile-emergency-contact, #profile-emergency-phone, #profile-address').prop('readonly', false);
            
            $('#edit-profile-btn').hide();
            $('#cancel-edit-btn').show();
            $('#save-profile-btn').show();
        }

        function disableEditMode() {
            $('#profile-form').removeClass('edit-mode');
            $('#profile-name, #profile-phone, #profile-emergency-contact, #profile-emergency-phone, #profile-address').prop('readonly', true);
            
            $('#edit-profile-btn').show();
            $('#cancel-edit-btn').hide();
            $('#save-profile-btn').hide();
        }

        function resetFormData() {
            // Get current user data
            const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { name: 'Guest', email: 'guest@dssc.edu.ph' };
            
            // Reset form to original values
            $('#profile-name').val(currentUser.name);
            $('#profile-phone').val('+63 912 345 6789');
            $('#profile-emergency-contact').val('Maria Santos');
            $('#profile-emergency-phone').val('+63 923 456 7890');
            $('#profile-address').val('123 Main Street, Dasmariñas City, Cavite');
        }

        function saveProfileChanges() {
            // Get updated values
            const updatedName = $('#profile-name').val();
            const updatedPhone = $('#profile-phone').val();
            const updatedEmergencyContact = $('#profile-emergency-contact').val();
            const updatedEmergencyPhone = $('#profile-emergency-phone').val();
            const updatedAddress = $('#profile-address').val();
            
            // Update localStorage with new name
            const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
            currentUser.name = updatedName;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Update student data
            window.studentData.name = updatedName;
            
            // Update UI throughout the app
            $('#student-name').text(updatedName); // Header name
            $('#student-name-dropdown').text(updatedName); // Dropdown name
            $('#student-name-card').text(updatedName); // Welcome card name
            
            // Update avatar with new name - ALL locations
            const newAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(updatedName)}&background=4361ee&color=fff`;
            
            // Update avatar in ALL locations:
            $('#student-profile-img').attr('src', newAvatarUrl); // Header avatar
            $('#student-profile-img-dropdown').attr('src', newAvatarUrl); // Dropdown avatar
            $('#profile-avatar-img').attr('src', newAvatarUrl); // Profile modal avatar
            
            // Exit edit mode
            disableEditMode();
            
            // Close modal after saving
            closeProfileModal();
        }

        function openProfileModal() {
            // Reinitialize modal with latest user data
            initializeProfileModal();
            $('#profileModal').css('display', 'flex');
        }

        function closeProfileModal() {
            $('#profileModal').css('display', 'none');
            disableEditMode();
        }

        // Initialize profile modal
        initializeProfileModal();
        
        // View Profile button handler
        $('#view-profile-btn').on('click', function(e) {
            e.preventDefault();
            openProfileModal();
            $('#studentProfileDropdown').removeClass('show');
        });

        // ========== DARK MODE FUNCTIONALITY ==========
        
        function initializeDarkMode() {
            const savedTheme = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                document.body.classList.add('dark-mode');
            }
            updateDarkModeIcon();
        }

        function toggleDarkMode() {
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
            updateDarkModeIcon();
        }

        function updateDarkModeIcon() {
            const isDarkMode = document.body.classList.contains('dark-mode');
            const darkModeIcon = $('#dark-mode-icon');
            
            if (darkModeIcon.length) {
                darkModeIcon.removeClass('fa-moon fa-sun');
                darkModeIcon.addClass(isDarkMode ? 'fa-sun' : 'fa-moon');
                $('#dark-mode-item span').text(isDarkMode ? 'Light Mode' : 'Dark Mode');
            }
        }

        // Initialize when page loads
        initializeDarkMode();

        // Add click handler
        $(document).on('click', '#dark-mode-item', function(e) {
            e.preventDefault();
            toggleDarkMode();
            $('#studentProfileDropdown').removeClass('show');
        });

        // Logout
        $('#student-logout').on('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            localStorage.removeItem('justLoggedIn');
            localStorage.removeItem('selectedRoom');
            window.location.href = '../index.html';
        });

    } catch (error) {
        console.error('Error in student.js:', error);
        $('#loginAnimation').addClass('hide').css({ display: 'none' });
        $('#studentContainer').addClass('show').css({ display: 'block' });
    }
});