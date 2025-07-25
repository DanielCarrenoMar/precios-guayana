import { chromium, Page } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: 'credentials.env', override: true });

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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

async function scrapeInstagram() {
const browser = await chromium.launch({ headless: false });
const context = await browser.newContext();
const page = await context.newPage();

await loginInstagram(page);

await page.goto('https://www.instagram.com/explore/tags/oferta/');
await page.waitForSelector("a[href^='/p/']", { timeout: 60000 });
const links: string[] = await page.$$eval("a[href^='/p/']", els => els.map(e => (e as HTMLAnchorElement).href));
console.log(`Se encontraron ${links.length} publicaciones.`);

for (let i = 0; i < 6; i++) {
    await page.mouse.wheel(0, Math.floor(Math.random() * 1000) + 500);
await humanWait(2000, 5000);
}

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

const offerData = {
    url,
    imagePath: img_url,
description,
};

const { error } = await supabase.from('offer').insert([offerData]);
if (error) {
console.log('Error al guardar en Supabase:', error.message);
} else {
console.log('¡Datos guardados exitosamente en Supabase!');
}
await humanWait(500, 1500);
}

await browser.close();
}

scrapeInstagram().catch(e => console.error(`Ocurrió un error: ${e}`));