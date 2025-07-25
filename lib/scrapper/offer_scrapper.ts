import { chromium, Page } from 'playwright';
import { insertOffer } from '@/lib/supabase/repository'
import { Offer, OfferPetition } from '@/domain/interface'
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

async function scrapeInstagramOffers(username: string, tag: string = 'oferta'): Promise<OfferPetition[]> {
    const browser = await chromium.launch({ headless: false, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await loginInstagram(page);

    await page.goto(`https://www.instagram.com/${username}/`, { waitUntil: 'networkidle' });
    await page.waitForSelector("a[href^='/p/']", { timeout: 60000 });

    for (let i = 0; i < 6; i++) {
        await page.mouse.wheel(0, Math.floor(Math.random() * 1000) + 500);
        await humanWait(2000, 5000);
    }

    const links: string[] = await page.$$eval("a[href^='/p/']", els => els.map(e => (e as HTMLAnchorElement).href));

    const results: OfferPetition[] = [];

    for (const postUrl of links) {
        await page.goto(postUrl, { waitUntil: 'networkidle' });
        await page.waitForTimeout(1000);

        const caption = await page.$eval(
            'div[role="dialog"] ul > div > li > div > div > div > span, article ul > div > li > div > div > div > span',
            el => el.textContent || ''
        );
        const matched = caption.includes(`#${tag}`);

        const imagesPath: string[] = await page.$$eval('article img', imgs =>
            imgs.map(img => (img as HTMLImageElement).src)
        );

        results.push({
            description: caption,
            url: postUrl,
            imagesPath,
            user_id: "5b247d1e-a080-486d-b21e-d48f1f4a2a0c",
        });
    }

    await browser.close();
    return results;
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
    const username = 'Rio Supermarket'; 
    const offers = await scrapeInstagramOffers(username, 'oferta');
    await saveOffersInSupabase(offers);
}
console.log('About to run main...');
main().catch(e => console.error(`Ocurrió un error: ${e}`));