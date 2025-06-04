const puppeteer = require('puppeteer');
const { createLogger, transports, format } = require('winston');
const config = require('./config.json');
const locators = require('./locators');

const logger = createLogger({
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'combined.log' })
    ]
})

class Game {
    constructor(page) {
        this.page = page
    }

    async start() {
        await this.page.goto(config.baseUrl)
        await this.page.waitForNetworkIdle()
        await this.setGameLanguage()
        // setInterval()
    }

    async setGameLanguage() {
        const lang = await this.page.$(locators.ID_LANG_ENG)
        await lang.click()
    }
    async buyProduct() { }
    async clearAchievements() { }

}

(async () => {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    game = new Game(page)
    game.start()
})()






