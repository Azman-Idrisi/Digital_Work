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
                : `${window.location.origin}/api/screenshot`;
            
            console.log('Sending request to:', apiUrl);
            
            // Call the backend endpoint to take a screenshot
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'image/png'
                },
                body: JSON.stringify({ 
                    selector: '#infographic' 
                })
            });
            
            // Check if the response is JSON (error) or blob (screenshot)
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                throw new Error(errorData.details || errorData.error || 'Failed to take screenshot');
            }
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
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