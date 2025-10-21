// Function to handle mode choice and redirect
function chooseMode(mode) {
    // Optional: Save preference to localStorage for future visits
    localStorage.setItem('preferredMode', mode);
    
    // Redirect based on choice
    if (mode === 'interactive') {
        window.location.href = 'Interactive/';
    } else if (mode === 'normal') {
        window.location.href = 'Normal/';
    }
}

// Optional: On load, check saved preference and auto-redirect (uncomment if desired)
// document.addEventListener('DOMContentLoaded', () => {
//     const preferredMode = localStorage.getItem('preferredMode');
//     if (preferredMode) {
//         chooseMode(preferredMode);
//     }
// });