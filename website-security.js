// ===== WEBSITE SECURITY SYSTEM =====
// This script adds multiple layers of protection to your website:
// 1. PIN-based access control (822775)
// 2. Protection against right-click
// 3. Developer tools detection and blocking
// 4. Keyboard shortcut prevention for developer tools
// 5. Session timeout security

// ===== PIN AUTHENTICATION SYSTEM =====
<script>
(function() {
    // Create and append the PIN authentication overlay
    function createPinOverlay() {
        // Create the overlay container
        const overlay = document.createElement('div');
        overlay.id = 'security-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
        overlay.style.zIndex = '999999';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.color = 'white';
        overlay.style.fontFamily = 'Arial, sans-serif';
        
        // Create the lock icon
        const lockIcon = document.createElement('div');
        lockIcon.innerHTML = `
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
        `;
        overlay.appendChild(lockIcon);
        
        // Create the title
        const title = document.createElement('h2');
        title.textContent = 'Protected Content';
        title.style.margin = '20px 0';
        title.style.fontSize = '24px';
        overlay.appendChild(title);
        
        // Create the subtitle
        const subtitle = document.createElement('p');
        subtitle.textContent = 'Please enter the security PIN to continue';
        subtitle.style.marginBottom = '30px';
        subtitle.style.fontSize = '16px';
        overlay.appendChild(subtitle);
        
        // Create the PIN input container
        const pinContainer = document.createElement('div');
        pinContainer.style.display = 'flex';
        pinContainer.style.justifyContent = 'center';
        pinContainer.style.marginBottom = '30px';
        overlay.appendChild(pinContainer);
        
        // Create the individual PIN input boxes
        const PIN_LENGTH = 6; // 822775 is 6 digits
        const inputs = [];
        
        for (let i = 0; i < PIN_LENGTH; i++) {
            const input = document.createElement('input');
            input.type = 'password';
            input.maxLength = 1;
            input.style.width = '50px';
            input.style.height = '60px';
            input.style.margin = '0 5px';
            input.style.fontSize = '24px';
            input.style.textAlign = 'center';
            input.style.borderRadius = '5px';
            input.style.border = '2px solid #3a3a3a';
            input.style.backgroundColor = '#222';
            input.style.color = 'white';
            
            // Focus the next input when a digit is entered
            input.addEventListener('input', function() {
                if (this.value.length === 1) {
                    const nextIndex = inputs.indexOf(this) + 1;
                    if (nextIndex < inputs.length) {
                        inputs[nextIndex].focus();
                    } else {
                        // Check PIN when the last digit is entered
                        checkPin();
                    }
                }
            });
            
            // Handle backspace key
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Backspace' && this.value.length === 0) {
                    const prevIndex = inputs.indexOf(this) - 1;
                    if (prevIndex >= 0) {
                        inputs[prevIndex].focus();
                        inputs[prevIndex].value = '';
                    }
                }
            });
            
            inputs.push(input);
            pinContainer.appendChild(input);
        }
        
        // Create error message element
        const errorMessage = document.createElement('p');
        errorMessage.id = 'pin-error';
        errorMessage.style.color = '#ff4d4d';
        errorMessage.style.margin = '10px 0';
        errorMessage.style.fontSize = '16px';
        errorMessage.style.visibility = 'hidden';
        errorMessage.textContent = 'Incorrect PIN. Please try again.';
        overlay.appendChild(errorMessage);
        
        // Check if entered PIN matches the correct one
        function checkPin() {
            const enteredPin = inputs.map(input => input.value).join('');
            const correctPin = '822775'; // Your specified PIN
            
            if (enteredPin === correctPin) {
                localStorage.setItem('securityPinValidated', 'true');
                localStorage.setItem('securityPinTimestamp', Date.now().toString());
                overlay.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(overlay);
                }, 500);
            } else {
                document.getElementById('pin-error').style.visibility = 'visible';
                inputs.forEach(input => {
                    input.value = '';
                });
                inputs[0].focus();
                
                // Add subtle shake animation to the inputs
                pinContainer.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    pinContainer.style.animation = '';
                }, 500);
            }
        }
        
        // Add shake animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shake {
                0% { transform: translateX(0); }
                20% { transform: translateX(-10px); }
                40% { transform: translateX(10px); }
                60% { transform: translateX(-10px); }
                80% { transform: translateX(10px); }
                100% { transform: translateX(0); }
            }
        `;
        document.head.appendChild(style);
        
        // Add transition for overlay
        overlay.style.transition = 'opacity 0.5s ease';
        
        document.body.appendChild(overlay);
        
        // Focus the first input
        inputs[0].focus();
    }
    
    // Check if PIN validation is needed
    function checkPinValidation() {
        const isPinValidated = localStorage.getItem('securityPinValidated') === 'true';
        const timestamp = parseInt(localStorage.getItem('securityPinTimestamp') || '0');
        const currentTime = Date.now();
        const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
        
        // If PIN hasn't been validated or the session has expired
        if (!isPinValidated || (currentTime - timestamp > SESSION_TIMEOUT)) {
            createPinOverlay();
        }
    }
    
    // Run on page load
    window.addEventListener('DOMContentLoaded', checkPinValidation);
})();

// ===== DEVELOPER TOOLS PROTECTION =====
(function() {
    // Detect and respond to DevTools opening
    let devToolsOpen = false;
    
    // Method 1: Window size detection
    const threshold = 160;
    const devToolsDetection = {
        isOpen: false,
        orientation: null
    };
    
    // Check window size differences
    function checkWindowSize() {
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        
        if (widthThreshold || heightThreshold) {
            handleDevToolsOpen();
        } else if (devToolsOpen) {
            devToolsOpen = false;
        }
    }
    
    // Method 2: Console clear and debug detection
    function setupConsoleProtection() {
        const originalConsole = { ...console };
        
        // Override console methods to detect usage
        const protectedMethods = ['log', 'debug', 'info', 'warn', 'error', 'clear'];
        protectedMethods.forEach(method => {
            console[method] = function() {
                handleDevToolsOpen();
                originalConsole[method].apply(console, arguments);
            };
        });
        
        // Additional protection for console.clear
        Object.defineProperty(console, 'clear', {
            get: function() {
                handleDevToolsOpen();
                return function() {
                    originalConsole.clear.apply(console);
                };
            }
        });
    }
    
    // Method 3: Custom debugger statements
    function setupDebuggerDetection() {
        setInterval(function() {
            const startTime = performance.now();
            debugger;
            const endTime = performance.now();
            
            if (endTime - startTime > 100) {
                handleDevToolsOpen();
            }
        }, 1000);
    }
    
    // Handle when DevTools is detected
    function handleDevToolsOpen() {
        if (!devToolsOpen) {
            devToolsOpen = true;
            
            // Clear local storage to force pin re-entry
            localStorage.removeItem('securityPinValidated');
            
            // Display warning and reload
            document.body.innerHTML = `
                <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:#111;color:white;display:flex;flex-direction:column;justify-content:center;align-items:center;z-index:99999;font-family:Arial,sans-serif;">
                    <h1 style="color:#ff4d4d;font-size:28px;">Security Alert</h1>
                    <p style="font-size:18px;margin:20px 0;text-align:center;max-width:500px;">Developer tools detected.<br>For security reasons, access to this content has been restricted.</p>
                    <p style="margin-top:20px;font-size:16px;">Redirecting back to security check...</p>
                </div>
            `;
            
            setTimeout(function() {
                window.location.reload();
            }, 3000);
        }
    }
    
    // Setup event listeners for window size changes
    window.addEventListener('resize', checkWindowSize);
    setInterval(checkWindowSize, 1000);
    
    // Set up console protection
    setupConsoleProtection();
    
    // Setup debugger detection (uncomment if needed)
    // setupDebuggerDetection();
})();

// ===== RIGHT-CLICK PREVENTION =====
(function() {
    // Prevent right-click context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Prevent other mouse events that could be used for examination
    document.addEventListener('mousedown', function(e) {
        if (e.button === 2) {
            e.preventDefault();
            return false;
        }
    });
    
    // Prevent keyboard shortcuts that open developer tools
    document.addEventListener('keydown', function(e) {
        // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, F12
        if (
            (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) ||
            (e.keyCode === 123)
        ) {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+U (View Source)
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            return false;
        }
    });
    
    // Disables text selection for more security
    document.addEventListener('selectstart', function(e) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            return false;
        }
    });

    // Prevent drag and drop actions on images
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });
})();

// ===== SESSION MANAGEMENT =====
(function() {
    // Check for session timeout every minute
    setInterval(function() {
        const timestamp = parseInt(localStorage.getItem('securityPinTimestamp') || '0');
        const currentTime = Date.now();
        const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
        
        if (currentTime - timestamp > SESSION_TIMEOUT) {
            localStorage.removeItem('securityPinValidated');
            window.location.reload();
        }
    }, 60000);
    
    // Update timestamp on user activity
    const updateTimestamp = function() {
        if (localStorage.getItem('securityPinValidated') === 'true') {
            localStorage.setItem('securityPinTimestamp', Date.now().toString());
        }
    };
    
    // Attach listeners to update timestamp on activity
    ['click', 'touchstart', 'mousemove', 'keypress'].forEach(function(event) {
        document.addEventListener(event, updateTimestamp, { passive: true });
    });
})();
</script>
