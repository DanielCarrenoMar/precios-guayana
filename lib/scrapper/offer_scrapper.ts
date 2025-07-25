import { chromium, Page } from 'playwright';
import { insertOffer } from '@/lib/supabase/repository'
import { Offer } from '@/domain/interface'
import { config } from 'dotenv';
config({ path: 'data.env' });

const IG_USER = process.env.IG_USER!;
const IG_PASS = process.env.IG_PASS!;

function humanWait(min = 1000, max = 3000) {
    const delay = Math.random() * (max - min) + min;
    return new Promise(res => setTimeout(res, delay));
}

async function loginInstagram(page: Page) {
    await page.goto('https://www.instagram.com/accounts/login/');
    await humanWait(2000, 4000);
    await page.fill("input[name='username']", IG_USER);
    await humanWait(1000, 3000);
    await page.fill("input[name='password']", IG_PASS);
    await humanWait(1000, 4000);
    await page.click("button[type='submit']");
    await page.waitForURL('https://www.instagram.com/accounts/onetap/?next=%2F', { timeout: 60000 });
    await page.click("text=Not now", { timeout: 60000 });
    await humanWait(2000, 4000);
}

async function scrapeInstagramOffers() {
    const browser = await chromium.launch({ headless: false, args: ['--no-sandbox'] });
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginInstagram(page);

    await page.goto('https://www.instagram.com/explore/tags/oferta/');
    await page.waitForSelector("a[href^='/p/']", { timeout: 60000 });

    for (let i = 0; i < 6; i++) {
        await page.mouse.wheel(0, Math.floor(Math.random() * 1000) + 500);
        await humanWait(2000, 5000);
    }

    const links: string[] = await page.$$eval("a[href^='/p/']", els => els.map(e => (e as HTMLAnchorElement).href));
    console.log(`Se encontraron ${links.length} publicaciones.`);

    const offers: any[] = [];

    for (const url of links) {
        await page.goto(url);
        await humanWait(1000, 2000);
        let img_url: string | null = null;
        let description: string | null = null;
        try {
            img_url = await page.getAttribute("img[src]", "src");
            description = await page.$eval("span", el => el.textContent || '');
        } catch (e) {
            console.log(`Error extrayendo datos de ${url}: ${e}`);
        }

        offers.push({
            url,
            imagesPath: img_url ? [img_url] : [""],
            description,
            user_id: ""
        });
        await humanWait(500, 1500);
    }

    await browser.close();
    return offers;
}

async function saveOffersInSupabase(offers: any[]) {
    for (const offer of offers) {
        try {
            await insertOffer(offer);
            console.log('¡Oferta guardada exitosamente en Supabase!', offer.url);
        } catch (error) {
            console.log('Error al guardar en Supabase:', (error as Error).message);
        }
    }
}

async function main() {
    const offers = await scrapeInstagramOffers();
    await saveOffersInSupabase(offers);
}
console.log('About to run main...');
main().catch(e => console.error(`Ocurrió un error: ${e}`));