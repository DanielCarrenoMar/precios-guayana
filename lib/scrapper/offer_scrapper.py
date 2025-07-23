import os
import asyncio
import random
from playwright.async_api import async_playwright
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv(dotenv_path='supabase.env')
load_dotenv(dotenv_path='credentials.env', override=True)

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_ANON_KEY')
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

IG_USER = os.getenv('IG_USER')
IG_PASS = os.getenv('IG_PASS')

async def human_wait(min_s=1.0, max_s=3.0):
    delay = random.uniform(min_s, max_s)
    await asyncio.sleep(delay)

async def scrape_instagram():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()

        # Login
        try:
            await page.goto("https://www.instagram.com/accounts/login/")
            await human_wait(2, 4)

            await page.fill("input[name='username']", IG_USER)
            await human_wait(1, 3)

            await page.fill("input[name='password']", IG_PASS)
            await human_wait(1, 4)

            await page.click("button[type='submit']")
            await page.wait_for_url("https://www.instagram.com/accounts/onetap/?next=%2F", timeout=60000)

            await page.click("text='Not now'", timeout=60000)
            await human_wait(2, 4)
        finally:
            await page.goto("https://www.instagram.com/explore/tags/oferta/")
            await page.wait_for_selector("a[href^='/p/']", timeout=60000)
            links = await page.eval_on_selector_all("a[href^='/p/']",
                                                    "elements => elements.map(e => e.href)")
        print(f"Se encontraron {len(links)} publicaciones.")

        # Scroll
        for _ in range(6):
            await page.mouse.wheel(0, random.randint(500, 1500))
            await human_wait(2, 5)

        # Extraer imagen y descripción de cada publicación
        for url in links:
            await page.goto(url)
            await human_wait(1, 2)
            try:
                img_url = await page.get_attribute("img[src]", "src")
                description = await page.eval_on_selector("span", "el => el.innerText")
            except Exception as e:
                print(f"Error extrayendo datos de {url}: {e}")
                img_url = None
                description = None

            offer_data = {
                "url": url,
                "imagePath": img_url,
                "description": description,
            }
            supabase.table("offer").insert(offer_data).execute()
            await human_wait(0.5, 1.5)

        # Insertar en Supabase
        for url in links:
            offer_data = {"url": url, "imagePath": img_url, "description": description}
            supabase.table("offer").insert(offer_data).execute()
            await human_wait(0.5, 1.5)

        await browser.close()

def save_to_supabase(offer_data):
    if not offer_data:
        print("No hay datos nuevos para guardar.")
        return
    print("Guardando datos en Supabase...")
    response = supabase.table("offer").insert(offer_data).execute()
    if response.get("error"):
        print("Error al guardar en Supabase:", response["error"]["message"])
    else:
        print("¡Datos guardados exitosamente en Supabase!")

def main():
    try:
        scraped_data = asyncio.run(scrape_instagram())
        save_to_supabase(scraped_data)
    except Exception as e:
        print(f"Ocurrió un error: {e}")

if __name__ == '__main__':
    main()