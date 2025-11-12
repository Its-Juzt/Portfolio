 $(document).ready(function() {
            try {
                const currentAdmin = { name: 'Admin', email: 'admin@dssc.edu.ph' };
                $('#admin-name, #admin-name-dropdown').text(currentAdmin.name);
                $('#admin-email-dropdown').text(currentAdmin.email);

                setTimeout(() => {
                    $('.student-icon').addClass('show-icon');
                }, 1000);
                setTimeout(() => {
                    $('#loginAnimation').addClass('hide').css({ display: 'none' });
                    $('#studentContainer').addClass('show').css({ display: 'block' });
                }, 2500);

                $('#sidebarToggle').on('click', function() {
                    $('.sidebar').toggleClass('hidden');
                    $('.admin-content').toggleClass('expanded');
                    const isHidden = $('.sidebar').hasClass('hidden');
                    $(this).find('i').removeClass('fa-bars fa-times').addClass(isHidden ? 'fa-bars' : 'fa-times');
                    $(this).attr('aria-expanded', !isHidden);
                });

                $('.admin-profile').on('click', function(e) {
                    e.stopPropagation();
                    const $dropdown = $('#studentProfileDropdown');
                    $dropdown.toggleClass('show');
                    if ($dropdown.hasClass('show')) {
                        const profileOffset = $(this).offset();
                        const profileHeight = $(this).outerHeight();
                        $dropdown.css({
                            top: profileHeight + 10,
                            right: $(window).width() - (profileOffset.left + $(this).outerWidth()),
                            position: 'fixed'
                        });
                    }
                });

                $(document).on('click', function(event) {
                    if (!$(event.target).closest('#studentProfileDropdown, .admin-profile').length) {
                        $('#studentProfileDropdown').removeClass('show');
                    }
                });

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
                        darkModeIcon.removeClass('fa-moon fa-sun').addClass(isDarkMode ? 'fa-sun' : 'fa-moon');
                        $('#dark-mode-item span').text(isDarkMode ? 'Light Mode' : 'Dark Mode');
                    }
                }

                initializeDarkMode();
                $(document).on('click', '#dark-mode-item', function(e) {
                    e.preventDefault();
                    toggleDarkMode();
                    $('#studentProfileDropdown').removeClass('show');
                });

                $('#admin-logout').on('click', function(e) {
                    e.preventDefault();
                    localStorage.removeItem('currentUser');
                    localStorage.removeItem('justLoggedIn');
                    localStorage.removeItem('selectedRoom');
                    window.location.href = '../index.html';
                });

                // Profile Modal Functionality
                function initializeProfileModal() {
                    const currentAdmin = JSON.parse(localStorage.getItem('currentAdmin')) || { name: 'Admin', email: 'admin@dssc.edu.ph' };
                    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentAdmin.name)}&background=4361ee&color=fff`;
                    $('#profile-avatar-img').attr('src', avatarUrl);
                    $('#profile-name').val(currentAdmin.name);
                    $('#profile-email').text(currentAdmin.email);
                }

                function openProfileModal() {
                    initializeProfileModal();
                    $('#profileModal').css('display', 'flex');
                }

                function closeProfileModal() {
                    $('#profileModal').css('display', 'none');
                    disableEditMode();
                }

                function enableEditMode() {
                    $('#profile-form').addClass('edit-mode');
                    $('#profile-name').prop('readonly', false);
                    $('#edit-profile-btn').hide();
                    $('#cancel-edit-btn').show();
                    $('#save-profile-btn').show();
                }

                function disableEditMode() {
                    $('#profile-form').removeClass('edit-mode');
                    $('#profile-name').prop('readonly', true);
                    $('#edit-profile-btn').show();
                    $('#cancel-edit-btn').hide();
                    $('#save-profile-btn').hide();
                }

                function resetFormData() {
                    const currentAdmin = JSON.parse(localStorage.getItem('currentAdmin')) || { name: 'Admin', email: 'admin@dssc.edu.ph' };
                    $('#profile-name').val(currentAdmin.name);
                }

                function saveProfileChanges() {
                    const updatedName = $('#profile-name').val();
                    const currentAdmin = JSON.parse(localStorage.getItem('currentAdmin')) || {};
                    currentAdmin.name = updatedName;
                    localStorage.setItem('currentAdmin', JSON.stringify(currentAdmin));
                    $('#admin-name').text(updatedName);
                    $('#admin-name-dropdown').text(updatedName);
                    const newAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(updatedName)}&background=4361ee&color=fff`;
                    $('#admin-profile-img').attr('src', newAvatarUrl);
                    $('#admin-profile-img-dropdown').attr('src', newAvatarUrl);
                    $('#profile-avatar-img').attr('src', newAvatarUrl);
                    disableEditMode();
                    closeProfileModal();
                }

                initializeProfileModal();

                $('#view-profile-btn').on('click', function(e) {
                    e.preventDefault();
                    openProfileModal();
                    $('#studentProfileDropdown').removeClass('show');
                });

                $('#admin-settings').on('click', function(e) {
                    e.preventDefault();
                    openProfileModal();  // Assuming settings are part of profile modal
                    $('#studentProfileDropdown').removeClass('show');
                });

                $('#close-profile-modal').on('click', closeProfileModal);

                $(document).on('click', '#profileModal', function(e) {
                    if ($(e.target).is('#profileModal')) {
                        closeProfileModal();
                    }
                });

                $(document).on('click', '#edit-profile-btn', enableEditMode);

                $(document).on('click', '#cancel-edit-btn', function() {
                    disableEditMode();
                    resetFormData();
                });

                $(document).on('click', '#save-profile-btn', saveProfileChanges);

                // Preferences toggles (dummy)
                $('.toggle-checkbox').on('change', function() {
                    const preference = $(this).attr('id').replace('-toggle', '');
                    const enabled = $(this).is(':checked');
                    console.log(`${preference} notifications: ${enabled ? 'Enabled' : 'Disabled'}`);
                    // In real app, save to backend or localStorage
                });
            } catch (error) {
                console.error('Error in admin.js:', error);
                $('#loginAnimation').addClass('hide').css({ display: 'none' });
                $('#studentContainer').addClass('show').css({ display: 'block' });
            }
        });