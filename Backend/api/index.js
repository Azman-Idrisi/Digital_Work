const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    let browser = null;

    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        // Launch browser
        browser = await puppeteer.launch({
            args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
            defaultViewport: {
                width: 1920,
                height: 1080,
                deviceScaleFactor: 1
            },
            executablePath: await chromium.executablePath,
            headless: true,
            ignoreHTTPSErrors: true
        });

        // Create new page
        const page = await browser.newPage();

        // Navigate to URL
        await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        // Take screenshot
        const screenshot = await page.screenshot({
            type: 'png',
            fullPage: true
        });

        // Set response headers
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', 'attachment; filename=webpage-screenshot.png');

        // Send the screenshot
        res.status(200).send(screenshot);

    } catch (error) {
        console.error('Screenshot error:', error);
        res.status(500).json({
            error: 'Failed to take screenshot',
            details: error.message
        });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}; 