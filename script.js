document.addEventListener('DOMContentLoaded', () => {
    const screenshotBtn = document.getElementById('screenshot-btn');
    const SCREENSHOT_SERVER = 'http://localhost:3000';
    
    // Check if screenshot server is running
    async function checkServer() {
        try {
            const response = await fetch(`${SCREENSHOT_SERVER}/health`);
            const data = await response.json();
            return data.status === 'Server is running';
        } catch (error) {
            console.error('Screenshot server not available:', error);
            return false;
        }
    }
    
    screenshotBtn.addEventListener('click', async () => {
        try {
            // Show loading state
            screenshotBtn.textContent = 'Taking screenshot...';
            screenshotBtn.disabled = true;
            
            // Check if server is running
            const isServerRunning = await checkServer();
            if (!isServerRunning) {
                throw new Error('Screenshot server is not running. Please start the server with "npm start"');
            }
            
            // Call the backend endpoint
            const response = await fetch(`${SCREENSHOT_SERVER}/api/screenshot`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: window.location.href
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to take screenshot');
            }
            
            // Get the screenshot as blob
            const blob = await response.blob();
            if (!blob || blob.size === 0) {
                throw new Error('Received empty screenshot');
            }
            
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'pinterest-infographic.png';
            
            // Trigger download
            document.body.appendChild(a);
            a.click();
            
            // Clean up
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            // Show success message
            screenshotBtn.textContent = 'Screenshot saved!';
            setTimeout(() => {
                screenshotBtn.textContent = 'Take Screenshot';
                screenshotBtn.disabled = false;
            }, 2000);
            
        } catch (error) {
            console.error('Error taking screenshot:', error);
            screenshotBtn.textContent = error.message || 'Error! Try Again';
            setTimeout(() => {
                screenshotBtn.textContent = 'Take Screenshot';
                screenshotBtn.disabled = false;
            }, 3000);
        }
    });
}); 