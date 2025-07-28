import Starfield from "./starfield";

export default function HeroSection() {
  return (
    <section className="py-16 mb-3 mt-16">
      <Starfield />
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Encuentra los mejores precios en Guayana
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Compara precios de productos y ofertas en toda la región. 
            Ahorra tiempo y dinero con nuestra plataforma confiable.
          </p>

        </div>
      </div>
    </section>
  );
} 