const puppeteer = require('puppeteer');

async function lookup(toCheckLink, domain) {
    let linkList = [];

    const browser = await puppeteer.launch({headless: false});
    // const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await loop(page, toCheckLink);

    async function loop(page, toCheckLink) {
        let response = await page.goto(toCheckLink);

        console.log(response.status());

        if(response.status() === 505){
            console.log('505 found, fatal error');
            return false;
        }

        let hrefs = await page.$$eval('a', as => as.map(a => a.href));

        for (const href of hrefs) {
            if (href.indexOf(domain) !== -1 && href.indexOf('#') === -1 && href.indexOf('@') === -1) {
                console.log(href.indexOf('#'));
                if (!linkList.includes(href)) {
                    linkList.push(href);
                    let LinkReplace = href.replace(/\//g, '-');
                    let screenshotName = LinkReplace.replace(/^.*\/\/[^\/]+/, '');
                    // await page.screenshot({ path: './screenshots/' + screenshotName +'.jpg', type: 'jpeg' });
                    await loop(page, href)
                }
            }
        }
    }

    await browser.close();
}

// lookup(toCheckLink, domain);
