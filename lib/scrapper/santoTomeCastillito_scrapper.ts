import { chromium, Page } from 'playwright';
import { Product, ProductPetition } from '@/domain/interface';

async function scrapeProducts(): Promise<ProductPetition[]> {
  const products: ProductPetition[] = [];
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://castillito.supermercadosantotome.com/tienda/');
  await page.waitForSelector('.product-grid');

  let previousHeight = 0;
  const maxAttempts = 5;
  let attempts = 0;
  while (attempts < maxAttempts) {
    await page.mouse.wheel(0, 2000);
    await page.waitForTimeout(2000);
    const height = await page.evaluate(() => document.body.scrollHeight);
    if (height === previousHeight) {
      attempts++;
    } else {
      attempts = 0;
    }
    previousHeight = height;
  }

  const productsElements = await page.$$('.product-grid .product-item');

  for (const product of productsElements) {
    const name = await product.$eval('.product-title', el => el.textContent?.trim() || '');
    const description = await product.$eval('.product-description', el => el.textContent?.trim() || '');
    const price = parseFloat(await product.$eval('.product-price', el => el.textContent?.trim() || ''));
    //const latitude = parseFloat(await supabase.from('user').select('latitude').eq('name', 'Santo Tomé Castillito').single().then(res => res.data?.latitude || 0));
    //const longitude = parseFloat(await supabase.from('user').select('longitude').eq('name', 'Santo Tomé Castillito').single().then(res => res.data?.longitude || 0));
    const category = await product.$eval('.product-category', el => el.textContent?.trim() || '');
    const link = await product.$eval('a', el => (el as HTMLAnchorElement).href);

    products.push({
      title: name,
      description,
      price,
      category,
      imagesPath: [""],
      user_id: "313f4245-e05a-4144-9905-dd0ff64e78a1"
    });
  }

  await browser.close();
  return products;
}

async function saveInSupabase(products: Product[]) {
  for (const product of products) {
    /*const { data, error } = await supabase.from('products').insert([product]);
    if (error) {
      console.error('Error inserting:', error);
    } else {
      console.log('Insertado:', data);
    }*/
  }
}

async function main() {
  console.log("Comienzo")
  const products = await scrapeProducts();
  console.log(`Se extrajeron ${products.length} productos.`);
  console.log(products)
}

main().catch(console.error);
