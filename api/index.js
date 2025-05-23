const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

const handler = async (req, res) => {
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

    let browser = null;

    try {
        const { selector } = req.body;
        
        // Get the deployment URL from request headers
        const deploymentUrl = req.headers.referer || 
            (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

        console.log('Taking screenshot of URL:', deploymentUrl);

        // Launch browser with chrome-aws-lambda
        browser = await puppeteer.launch({
            args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: true,
            ignoreHTTPSErrors: true
        });
        
        // Create a new page
        const page = await browser.newPage();
        
        // Set viewport size for better capture
        await page.setViewport({
            width: 1200,
            height: 1800,
            deviceScaleFactor: 2
        });
        
        console.log('Navigating to page...');
        
        // Navigate to the page
        await page.goto(deploymentUrl, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        console.log('Waiting for selector:', selector);
        
        // Wait for the selector to be available
        await page.waitForSelector(selector || 'body', { timeout: 10000 });
        
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
        
        console.log('Screenshot taken successfully');
        
        // Set response headers
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', 'attachment; filename=pinterest-infographic.png');
        
        // Send the screenshot
        res.status(200).send(screenshot);
        
    } catch (error) {
        console.error('Error taking screenshot:', error);
        res.status(500).json({ 
            error: 'Failed to take screenshot',
            details: error.message,
            stack: error.stack
        });
    } finally {
        if (browser) {
            try {
                await browser.close();
            } catch (error) {
                console.error('Error closing browser:', error);
            }
        }
    }
};

module.exports = handler; 