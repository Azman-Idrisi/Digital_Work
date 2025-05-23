const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { selector } = req.body;
        
        // Get the deployment URL from Vercel environment
        const deploymentUrl = process.env.VERCEL_URL 
            ? `https://${process.env.VERCEL_URL}`
            : 'http://localhost:3000';

        // Launch browser with chrome-aws-lambda
        const browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
        });
        
        // Create a new page
        const page = await browser.newPage();
        
        // Set viewport size for better capture
        await page.setViewport({
            width: 1200,
            height: 1800,
            deviceScaleFactor: 2
        });
        
        // Navigate to the page
        await page.goto(deploymentUrl, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        // Wait for the selector to be available
        await page.waitForSelector(selector || 'body', { timeout: 5000 });
        
        // Take a screenshot of the specific element or the entire page
        let screenshot;
        if (selector) {
            const element = await page.$(selector);
            if (!element) {
                throw new Error(`Element with selector "${selector}" not found`);
            }
            screenshot = await element.screenshot({
                type: 'png',
                omitBackground: false
            });
        } else {
            screenshot = await page.screenshot({
                type: 'png',
                fullPage: true
            });
        }
        
        // Close the browser
        await browser.close();
        
        // Set response headers
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', 'attachment; filename=pinterest-infographic.png');
        
        // Send the screenshot
        res.status(200).send(screenshot);
        
    } catch (error) {
        console.error('Error taking screenshot:', error);
        res.status(500).json({ 
            error: 'Failed to take screenshot',
            details: error.message
        });
    }
}; 