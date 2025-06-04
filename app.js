const puppeteer = require('puppeteer');
const { createLogger, transports, format } = require('winston');
const config = require('./config.json');
const locators = require('./locators');

// Setup logger
const logger = createLogger({
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`) // More readable format
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'game-bot.log' }) // Changed log file name
    ]
});

class Game {
    constructor(page) {
        this.page = page;
        this.logPrefix = '[Game]'; // Prefix for logs from this class
    }

    /**
     * Starts the game bot.
     * Navigates to the game page, sets language, and starts automated actions.
     */
    async start() {
        try {
            logger.info(`${this.logPrefix} Starting the game...`);
            await this.page.goto(config.baseUrl, { waitUntil: 'networkidle2' }); // Wait until network is idle
            logger.info(`${this.logPrefix} Navigated to ${config.baseUrl}`);

            await this.setGameLanguage();

            // Start clicking the cookie at a regular interval
            setInterval(async () => {
                await this.clickCookie();
            }, 100); // Click every 100 milliseconds

            // Start trying to buy products at a regular interval
            setInterval(async () => {
                await this.buyProduct();
            }, 5000); // Try to buy every 5 seconds

            logger.info(`${this.logPrefix} Game started and automation loops initiated.`);
        } catch (error) {
            logger.error(`${this.logPrefix} Error during game start: ${error.message}`, { stack: error.stack });
        }
    }

    /**
     * Sets the game language to English.
     */
    async setGameLanguage() {
        try {
            logger.info(`${this.logPrefix} Setting language to English...`);
            const langButton = await this.page.$(locators.ID_LANG_ENG);
            if (langButton) {
                await langButton.click();
                logger.info(`${this.logPrefix} Language set to English.`);
            } else {
                logger.warn(`${this.logPrefix} Language selector not found.`);
            }
        } catch (error) {
            logger.error(`${this.logPrefix} Error setting language: ${error.message}`, { stack: error.stack });
        }
    }

    /**
     * Clicks the main cookie.
     */
    async clickCookie() {
        try {
            const cookie = await this.page.$(locators.ID_COOKIE_SELECTOR);
            if (cookie) {
                await cookie.click();
                // logger.info(`${this.logPrefix} Cookie clicked.`); // Too frequent, can be enabled for debugging
            } else {
                // This might happen if the page is not fully loaded or the selector is incorrect
                // logger.warn(`${this.logPrefix} Cookie element not found.`); // Also potentially too frequent
            }
        } catch (error) {
            // Log error but continue, as intermittent issues might occur
            logger.warn(`${this.logPrefix} Error clicking cookie: ${error.message}`);
        }
    }

    /**
     * Attempts to buy the first available product.
     * This is a basic strategy and can be expanded.
     */
    async buyProduct() {
        try {
            // Find all product elements that are enabled (not greyed out)
            // This selector might need adjustment based on how "enabled" products are styled
            const products = await this.page.$$(locators.CLASS_PRODUCT + '.enabled');

            if (products && products.length > 0) {
                // Attempt to buy the first available (and presumably cheapest) product
                await products[0].click();
                // To get product details for logging, we might need to inspect its properties
                // For now, just log a generic message
                logger.info(`${this.logPrefix} Attempted to buy the first available product.`);
            } else {
                logger.info(`${this.logPrefix} No products available or enabled to buy at the moment.`);
            }
        } catch (error) {
            logger.error(`${this.logPrefix} Error buying product: ${error.message}`, { stack: error.stack });
        }
    }

    /**
     * Placeholder for clearing achievements. Not implemented.
     */
    async clearAchievements() {
        logger.info(`${this.logPrefix} clearAchievements() called, but not implemented.`);
        // Future implementation for clearing achievements if needed for testing or strategy
    }
}

// Main execution block
(async () => {
    logger.info('[App] Starting Cookie Clicker Bot...');
    let browser; // Declare browser outside try so it can be closed in catch/finally
    try {
        browser = await puppeteer.launch({
            headless: false, // Show browser UI
            args: ['--no-sandbox', '--disable-setuid-sandbox'] // Common args for running in containers/CI
        });
        const page = await browser.newPage();

        // Optional: Set viewport, user agent, etc.
        // await page.setViewport({ width: 1280, height: 800 });
        // await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36');

        const game = new Game(page);
        await game.start(); // Make sure to await the start method if it's fully async

        logger.info('[App] Bot is running. Close the browser window to stop.');

        // Keep the script running until the browser is closed by the user
        // This can be handled more gracefully with browser.on('disconnected', ...)
        await new Promise(resolve => browser.on('disconnected', resolve));
        logger.info('[App] Browser closed, shutting down bot.');

    } catch (error) {
        logger.error(`[App] Critical error during bot execution: ${error.message}`, { stack: error.stack });
    } finally {
        if (browser && !config.keepBrowserOpen) { // Assuming a config option to keep browser open for debugging
            // await browser.close(); // This line might cause issues if browser is already closed.
            // logger.info('[App] Browser closed.');
        }
        logger.info('[App] Bot execution finished.');
    }
})();






