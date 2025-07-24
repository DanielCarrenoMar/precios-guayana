import { DeployButton } from "@/components/deploy-button";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { OfferSection } from "@/app/(home)/components/offerSection";
import NavBarMobile from "@/components/NavBarMobile";

export default function Home() {

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <AuthButton />
          </div>
        </nav>
        <section className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <h1 className="text-primary text-4xl">Precios Guayana</h1>
        </section>
        <section className="">
          <h2 className="text-primary text-2xl">Ofertas Recientes</h2>
          <OfferSection/>
        </section>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
      <NavBarMobile />
    </main>
  );
}
