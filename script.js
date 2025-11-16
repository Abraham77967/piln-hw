// Timer functionality
let countdownInterval = null;
let countdownData = null;
let remainingSeconds = 0;

// Initialize timer from localStorage or set default
function initializeTimer() {
    const savedCountdown = localStorage.getItem('countdownDuration');
    if (savedCountdown) {
        countdownData = JSON.parse(savedCountdown);
        const startTime = new Date(countdownData.startTime);
        const now = new Date();
        const elapsedSeconds = Math.floor((now - startTime) / 1000);
        remainingSeconds = Math.max(0, countdownData.totalSeconds - elapsedSeconds);
        startCountdown();
    } else {
        // Set default to 1 hour
        countdownData = {
            hours: 1,
            minutes: 0,
            seconds: 0,
            totalSeconds: 3600,
            startTime: new Date().toISOString()
        };
        remainingSeconds = 3600;
        localStorage.setItem('countdownDuration', JSON.stringify(countdownData));
        startCountdown();
    }
    updateDueDateDisplay();
}

function startCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    countdownInterval = setInterval(() => {
        if (remainingSeconds <= 0) {
            clearInterval(countdownInterval);
            document.getElementById('timer').textContent = '00:00:00';
            document.getElementById('timer').className = 'timer danger';
            document.getElementById('status').textContent = 'Time Up';
            return;
        }

        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        const seconds = remainingSeconds % 60;

        const timerElement = document.getElementById('timer');
        timerElement.textContent = 
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        // Add warning class when less than 1 hour remaining
        if (remainingSeconds < 3600) {
            timerElement.className = 'timer danger';
        } else if (remainingSeconds < 3600 * 3) {
            timerElement.className = 'timer warning';
        } else {
            timerElement.className = 'timer';
        }

        remainingSeconds--;
    }, 1000);
}

function updateDueDateDisplay() {
    // Keep the due date display but it's now independent of the countdown
    const savedDueTime = localStorage.getItem('dueTime');
    if (savedDueTime) {
        const dueTime = new Date(savedDueTime);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        };
        document.getElementById('dueDate').textContent = dueTime.toLocaleDateString('en-US', options);
    } else {
        document.getElementById('dueDate').textContent = 'Not Set';
    }
}

// File upload functionality
const fileUploadArea = document.getElementById('fileUploadArea');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const removeFileBtn = document.getElementById('removeFile');
const submitBtn = document.getElementById('submitBtn');

fileUploadArea.addEventListener('click', () => {
    fileInput.click();
});

fileUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileUploadArea.classList.add('dragover');
});

fileUploadArea.addEventListener('dragleave', () => {
    fileUploadArea.classList.remove('dragover');
});

fileUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    fileUploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelect(files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
    }
});

function handleFileSelect(file) {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (allowedTypes.includes(fileExtension)) {
        fileName.textContent = file.name;
        fileInfo.style.display = 'flex';
        fileUploadArea.style.display = 'none';
        submitBtn.disabled = false;
    } else {
        alert('Please select a valid file type (PDF, DOC, DOCX, or TXT)');
    }
}

removeFileBtn.addEventListener('click', () => {
    fileInput.value = '';
    fileInfo.style.display = 'none';
    fileUploadArea.style.display = 'block';
    submitBtn.disabled = true;
});

submitBtn.addEventListener('click', () => {
    if (!submitBtn.disabled) {
        // Show success animation
        const successModal = document.getElementById('successModal');
        successModal.classList.add('show');
        
        // Update status
        document.getElementById('status').textContent = 'Submitted';
        submitBtn.disabled = true;
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            successModal.classList.remove('show');
        }, 3000);
    }
});

// Close success modal when clicking outside
document.getElementById('successModal').addEventListener('click', (e) => {
    if (e.target.id === 'successModal') {
        e.target.classList.remove('show');
    }
});

// Settings button
document.getElementById('settingsBtn').addEventListener('click', () => {
    window.location.href = 'settings.html';
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeTimer();
    
    // Listen for storage changes (when settings are updated)
    window.addEventListener('storage', (e) => {
        if (e.key === 'countdownDuration') {
            initializeTimer();
        }
        if (e.key === 'dueTime') {
            updateDueDateDisplay();
        }
    });
    
    // Also check for changes in the same window
    const checkStorage = setInterval(() => {
        const savedCountdown = localStorage.getItem('countdownDuration');
        if (savedCountdown) {
            const newCountdownData = JSON.parse(savedCountdown);
            if (!countdownData || newCountdownData.startTime !== countdownData.startTime || 
                newCountdownData.totalSeconds !== countdownData.totalSeconds) {
                initializeTimer();
            }
        }
        // Check for due date changes
        updateDueDateDisplay();
    }, 1000);
});

