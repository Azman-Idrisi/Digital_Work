document.addEventListener('DOMContentLoaded', () => {
    const screenshotBtn = document.getElementById('screenshot-btn');
    
    screenshotBtn.addEventListener('click', async () => {
        try {
            // Show loading state
            screenshotBtn.textContent = 'Taking screenshot...';
            screenshotBtn.disabled = true;
            
            // Get the API URL based on environment
            const apiUrl = window.location.hostname === 'localhost' 
                ? 'http://localhost:3000/api/screenshot'
                : '/api/screenshot';
            
            // Call the backend endpoint to take a screenshot
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    selector: '#infographic' 
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || 'Failed to take screenshot');
            }
            
            // Get the screenshot as blob
            const blob = await response.blob();
            
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
            
            // Reset button with success message
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