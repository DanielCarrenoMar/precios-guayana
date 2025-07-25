import { chromium } from 'playwright';
import { Product, ProductPetition } from 'domain/interface';
import { insertProduct } from 'lib/supabase/repository';

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
    const category = await product.$eval('.product-category', el => el.textContent?.trim() || '');

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

async function saveInSupabase(products: ProductPetition[]) {
  for (const product of products) {
    try {
      await insertProduct(product);
      console.log('Insertado:', product.title);
    } catch (error) {
      console.error('Error inserting:', error);
    }
  }
}

async function main() {
  console.log("Comienzo")
  const products = await scrapeProducts();
  console.log(`Se extrajeron ${products.length} productos.`);
  console.log(products)
  await saveInSupabase(products);
}

main().catch(console.error);
