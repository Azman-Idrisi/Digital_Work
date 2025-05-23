export function initializeScreenshot(screenshotBtn, modal, closeModal, screenshotImage, downloadBtn) {
    screenshotBtn.addEventListener('click', async () => {
        try {
            // Show loading state
            screenshotBtn.textContent = 'Taking screenshot...';
            screenshotBtn.disabled = true;
            
            // Get the infographic element
            const element = document.getElementById('infographic');
            
            // Use html2canvas to take the screenshot
            const canvas = await html2canvas(element, {
                scale: 2, // Higher quality
                useCORS: true, // Enable cross-origin images
                backgroundColor: '#ffffff', // White background
                height: element.scrollHeight, // Capture full height
                windowHeight: element.scrollHeight,
                logging: false, // Disable logging
                onclone: (clonedDoc) => {
                    // Ensure the cloned element is visible and hide the screenshot button
                    const clonedElement = clonedDoc.getElementById('infographic');
                    const clonedButton = clonedDoc.getElementById('screenshot-btn');
                    if (clonedElement) {
                        clonedElement.style.visibility = 'visible';
                        clonedElement.style.display = 'block';
                    }
                    if (clonedButton) {
                        clonedButton.style.display = 'none';
                    }
                }
            });
            
            // Display screenshot in modal
            const imageDataURL = canvas.toDataURL('image/png');
            screenshotImage.src = imageDataURL;
            modal.style.display = 'block';
            
            // Reset button state
            screenshotBtn.textContent = 'Take Screenshot';
            screenshotBtn.disabled = false;
            
        } catch (error) {
            console.error('Error taking screenshot:', error);
            screenshotBtn.textContent = 'Error! Try Again';
            setTimeout(() => {
                screenshotBtn.textContent = 'Take Screenshot';
                screenshotBtn.disabled = false;
            }, 3000);
        }
    });
    
    // Handle modal close button
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // Handle download button
    downloadBtn.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = screenshotImage.src;
        a.download = 'pinterest-infographic.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
} 