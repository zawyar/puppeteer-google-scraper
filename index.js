const randomUseragent = require('random-useragent');
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36';


async function  getGoogleSearchResults (browser,url){
    const userAgent = randomUseragent.getRandom();
    const UA = userAgent || USER_AGENT;
    const page = await browser.newPage();

    await page.setViewport({
        width: 1920 + Math.floor(Math.random() * 100),
        height: 3000 + Math.floor(Math.random() * 100),
        deviceScaleFactor: 1,
        hasTouch: false,
        isLandscape: false,
        isMobile: false,
    });

    await page.setUserAgent(UA);
    await page.setJavaScriptEnabled(true);
    await page.setDefaultNavigationTimeout(0);

    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
            req.abort();
        } else {
            req.continue();
        }
    });

    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', {
            get: () => false,
        });
    });

    await page.evaluateOnNewDocument(() => {
        window.chrome = {
            runtime: {},
        };
    });

    await page.evaluateOnNewDocument(() => {
        const originalQuery = window.navigator.permissions.query;
        return window.navigator.permissions.query = (parameters) => (
            parameters.name === 'notifications' ?
                Promise.resolve({ state: Notification.permission }) :
                originalQuery(parameters)
        );
    });

    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'plugins', {
            get: () => [1, 2, 3, 4, 5],
        });
    });

    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'languages', {
            get: () => ['en-US', 'en'],
        });
    });

    await page.goto(url, { waitUntil: 'networkidle2',timeout: 0 } );
    return page;

}

puppeteer.launch().then(async browser=>{
    const url="https://www.google.com/search?q=how+to+make+a+windows+10+filter+driver&sca_esv=599503376&rlz=1C1GCEA_enPK1072PK1072&sxsrf=ACQVn0_9ed-WJGe57Fs2ze4nQRArxKOBlg%3A1705596156162&ei=_FSpZbK-Cebqi-gPr6eR4Ac&ved=0ahUKEwiyrJLosOeDAxVm9QIHHa9TBHwQ4dUDCBA&uact=5&oq=how+to+make+a+windows+10+filter+driver&gs_lp=Egxnd3Mtd2l6LXNlcnAiJmhvdyB0byBtYWtlIGEgd2luZG93cyAxMCBmaWx0ZXIgZHJpdmVyMgcQIRgKGKABMgcQIRgKGKABMgUQIRifBTIFECEYnwVIm1tQnAlYrlpwCngBkAECmAH3AqABtFqqAQYyLTQxLjS4AQPIAQD4AQHCAgoQABhHGNYEGLADwgINEAAYgAQYigUYQxiwA8ICExAuGIAEGIoFGEMYxwEY0QMYsAPCAgoQIxiABBiKBRgnwgIEECMYJ8ICChAAGIAEGIoFGEPCAgUQABiABMICBRAuGIAEwgIMEAAYgAQYChhGGPkBwgIHEAAYgAQYCsICIxAAGIAEGAoYRhj5ARiXBRiMBRjdBBhGGPQDGPUDGPYD2AEBwgIHECMYsQIYJ8ICCxAAGIAEGIoFGJECwgIHEC4YgAQYCsICChAAGIAEGBQYhwLCAgsQLhiABBjHARjRA8ICBhAAGBYYHsICCBAAGBYYHhgPwgIFECEYoAHCAgQQIRgV4gMEGAAgQYgGAZAGCroGBggBEAEYEw&sclient=gws-wiz-serp"

    getGoogleSearchResults(browser,url).then((p)=>{
        p.screenshot({
        path: 'browserstack-demo.png'
        });
    })
    
})
