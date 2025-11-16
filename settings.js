// Initialize settings page
document.addEventListener('DOMContentLoaded', () => {
    const hoursInput = document.getElementById('hoursInput');
    const minutesInput = document.getElementById('minutesInput');
    const secondsInput = document.getElementById('secondsInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const previewTimer = document.getElementById('previewTimer');
    const previewDueDate = document.getElementById('previewDueDate');

    // Load current settings
    const savedCountdown = localStorage.getItem('countdownDuration');
    if (savedCountdown) {
        const duration = JSON.parse(savedCountdown);
        hoursInput.value = duration.hours || 0;
        minutesInput.value = duration.minutes || 0;
        secondsInput.value = duration.seconds || 0;
        updatePreview();
    } else {
        // Set default to 1 hour
        hoursInput.value = 1;
        minutesInput.value = 0;
        secondsInput.value = 0;
        updatePreview();
    }

    // Load saved due date
    const savedDueTime = localStorage.getItem('dueTime');
    if (savedDueTime) {
        const dueDate = new Date(savedDueTime);
        // Format for datetime-local input (YYYY-MM-DDTHH:mm)
        const year = dueDate.getFullYear();
        const month = String(dueDate.getMonth() + 1).padStart(2, '0');
        const day = String(dueDate.getDate()).padStart(2, '0');
        const hours = String(dueDate.getHours()).padStart(2, '0');
        const minutes = String(dueDate.getMinutes()).padStart(2, '0');
        dueDateInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
        updateDueDatePreview();
    }

    // Update preview when inputs change
    hoursInput.addEventListener('input', updatePreview);
    minutesInput.addEventListener('input', updatePreview);
    secondsInput.addEventListener('input', updatePreview);
    dueDateInput.addEventListener('input', updateDueDatePreview);

    function updatePreview() {
        const hours = parseInt(hoursInput.value) || 0;
        const minutes = parseInt(minutesInput.value) || 0;
        const seconds = parseInt(secondsInput.value) || 0;

        // Validate inputs
        if (minutes > 59) {
            minutesInput.value = 59;
        }
        if (seconds > 59) {
            secondsInput.value = 59;
        }

        const totalSeconds = hours * 3600 + (parseInt(minutesInput.value) || 0) * 60 + (parseInt(secondsInput.value) || 0);
        
        if (totalSeconds <= 0) {
            previewTimer.textContent = '00:00:00';
            saveBtn.disabled = true;
            saveBtn.style.opacity = '0.6';
            saveBtn.style.cursor = 'not-allowed';
            return;
        }

        saveBtn.disabled = false;
        saveBtn.style.opacity = '1';
        saveBtn.style.cursor = 'pointer';

        const displayHours = Math.floor(totalSeconds / 3600);
        const displayMinutes = Math.floor((totalSeconds % 3600) / 60);
        const displaySeconds = totalSeconds % 60;

        previewTimer.textContent = 
            `${String(displayHours).padStart(2, '0')}:${String(displayMinutes).padStart(2, '0')}:${String(displaySeconds).padStart(2, '0')}`;
    }

    function updateDueDatePreview() {
        if (dueDateInput.value) {
            const dueDate = new Date(dueDateInput.value);
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
            };
            previewDueDate.textContent = dueDate.toLocaleDateString('en-US', options);
        } else {
            previewDueDate.textContent = 'Not Set';
        }
    }

    // Save settings
    saveBtn.addEventListener('click', () => {
        const hours = parseInt(hoursInput.value) || 0;
        const minutes = parseInt(minutesInput.value) || 0;
        const seconds = parseInt(secondsInput.value) || 0;

        const totalSeconds = hours * 3600 + minutes * 60 + seconds;

        if (totalSeconds <= 0) {
            alert('Please set a countdown duration greater than 0.');
            return;
        }

        // Save countdown duration
        const countdownDuration = {
            hours: hours,
            minutes: minutes,
            seconds: seconds,
            totalSeconds: totalSeconds,
            startTime: new Date().toISOString() // Store when the countdown was set
        };

        localStorage.setItem('countdownDuration', JSON.stringify(countdownDuration));

        // Save due date if provided
        if (dueDateInput.value) {
            const dueDate = new Date(dueDateInput.value);
            localStorage.setItem('dueTime', dueDate.toISOString());
        } else {
            // Remove due date if cleared
            localStorage.removeItem('dueTime');
        }

        alert('Settings saved! Redirecting to assignment page...');
        window.location.href = 'index.html';
    });

    // Cancel button
    cancelBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});

