const puppeteer = require('puppeteer');

async function handler(req, res) {
    try {
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Get URL from request or use default localhost in development
        const url = process.env.NODE_ENV === 'production' 
            ? req.body.url 
            : 'http://127.0.0.1:5500';
        
        console.log('Taking screenshot of:', url);

        // Set initial viewport
        await page.setViewport({
            width: 1200,
            height: 4000,
            deviceScaleFactor: 1
        });

        // Disable animations via CSS
        await page.addStyleTag({
            content: `
                * {
                    animation: none !important;
                    transition: none !important;
                    transform: none !important;
                }
                .timeline-item {
                    opacity: 1 !important;
                    transform: none !important;
                }
                .number-box {
                    opacity: 1 !important;
                    transform: none !important;
                }
                .content {
                    opacity: 1 !important;
                    transform: none !important;
                }
            `
        });

        // Navigate to page and wait for content
        await page.goto(url, { waitUntil: 'networkidle0' });
        await page.waitForSelector('#infographic', { visible: true });
        
        // Get the height of the infographic
        const height = await page.evaluate(() => {
            const element = document.getElementById('infographic');
            return element.getBoundingClientRect().height;
        });

        // Update viewport to match content height
        await page.setViewport({
            width: 1200,
            height: Math.ceil(height),
            deviceScaleFactor: 1
        });

        // Take screenshot of just the infographic element
        const element = await page.$('#infographic');
        const screenshot = await element.screenshot({
            type: 'png'
        });

        await browser.close();
        
        // Send the screenshot
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', 'attachment; filename=pinterest-infographic.png');
        res.send(screenshot);
        
    } catch (error) {
        console.error('Screenshot error:', error);
        res.status(500).json({ error: 'Failed to take screenshot', details: error.message });
    }
}

module.exports = handler; 