import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-muted/50 border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" className="max-h-8" alt="Precios Guayana" />
              <span className="text-lg font-semibold">Precios Guayana</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Tu plataforma confiable para encontrar los mejores precios en productos 
              y ofertas de la región de Guayana.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Link href="/auth/sign-up">Registrarse</Link>
              </Button>
              <Button size="sm">
                <Link href="/protected/create">Subir producto</Link>
              </Button>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="font-semibold mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/map" className="text-muted-foreground hover:text-foreground transition-colors">
                  Mapa de precios
                </Link>
              </li>
              <li>
                <Link href="/protected/profile" className="text-muted-foreground hover:text-foreground transition-colors">
                  Mi perfil
                </Link>
              </li>
              <li>
                <Link href="/protected/create" className="text-muted-foreground hover:text-foreground transition-colors">
                  Subir producto
                </Link>
              </li>
            </ul>
          </div>

          {/* Soporte */}
          <div>
            <h3 className="font-semibold mb-4">Soporte</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/auth/login" className="text-muted-foreground hover:text-foreground transition-colors">
                  Iniciar sesión
                </Link>
              </li>
              <li>
                <Link href="/auth/forgot-password" className="text-muted-foreground hover:text-foreground transition-colors">
                  Recuperar contraseña
                </Link>
              </li>
              <li>
                <a href="mailto:soporte@preciosguayana.com" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 Precios Guayana. Todos los derechos reservados.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacidad
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Términos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 