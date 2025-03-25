import Link from "next/link"
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="space-y-8 md:w-1/2 lg:w-1/3">
          <div>
            <Link href="/" className="text-xl font-bold">
              Leandro Chena
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Consultor comercial, capacitador y experto en ventas con amplia experiencia ayudando a equipos a potenciar sus resultados.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Santa Fe, Argentina</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">+54 342 5051513</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">consultas@leandrochena.com</span>
            </div>
          </div>
          <div className="flex space-x-6">
            <Link
              href="https://www.facebook.com/people/Leandro-Chena/100071083136084/"
              className="text-muted-foreground hover:text-foreground"
            >
              <span className="sr-only">Facebook</span>
              <Facebook className="h-6 w-6" />
            </Link>
            <Link
              href="https://www.instagram.com/leandrochena/"
              className="text-muted-foreground hover:text-foreground"
            >
              <span className="sr-only">Instagram</span>
              <Instagram className="h-6 w-6" />
            </Link>
            <Link
              href="https://www.linkedin.com/in/leandro-chena/"
              className="text-muted-foreground hover:text-foreground"
            >
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-6 w-6" />
            </Link>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-8 md:mt-0 md:w-1/2 lg:w-2/3 lg:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold">Navegación</h3>
            <ul role="list" className="mt-4 space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/sobre-mi" className="text-sm text-muted-foreground hover:text-foreground">
                  Sobre Mí
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="text-sm text-muted-foreground hover:text-foreground">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-sm text-muted-foreground hover:text-foreground">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Servicios</h3>
            <ul role="list" className="mt-4 space-y-2">
              <li>
                <Link href="/servicios/capacitaciones" className="text-sm text-muted-foreground hover:text-foreground">
                  Capacitaciones
                </Link>
              </li>
              <li>
                <Link href="/servicios/consultoria" className="text-sm text-muted-foreground hover:text-foreground">
                  Consultoría
                </Link>
              </li>
              <li>
                <Link href="/servicios/charlas" className="text-sm text-muted-foreground hover:text-foreground">
                  Charlas Motivacionales
                </Link>
              </li>
              <li>
                <Link href="/servicios/mentorias" className="text-sm text-muted-foreground hover:text-foreground">
                  Mentorías 1:1
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-sm font-semibold">Suscribite</h3>
            <p className="mt-4 text-sm text-muted-foreground">
              Recibí las últimas novedades, artículos y recursos directamente en tu correo.
            </p>
            <form className="mt-4 sm:flex sm:max-w-md">
              <label htmlFor="email-address" className="sr-only">
                Correo electrónico
              </label>
              <input
                type="email"
                name="email-address"
                id="email-address"
                autoComplete="email"
                required
                className="w-full min-w-0 appearance-none rounded-md border border-input bg-background px-3 py-1.5 text-base text-foreground shadow-sm ring-0 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:w-64 sm:text-sm"
                placeholder="Ingresá tu mail"
              />
              <div className="mt-3 rounded-md sm:ml-3 sm:mt-0 sm:flex-shrink-0">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Suscribirme
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl border-t border-border/40 px-6 py-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="mt-8 md:mt-0 md:order-1">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Leandro Chena. Todos los derechos reservados.
          </p>
        </div>
        <div className="mt-4 flex justify-center space-x-6 md:mt-0 md:order-2">
          <Link href="/terminos" className="text-xs text-muted-foreground hover:text-foreground">
            Términos y Condiciones
          </Link>
          <Link href="/privacidad" className="text-xs text-muted-foreground hover:text-foreground">
            Política de Privacidad
          </Link>
        </div>
      </div>
    </footer>
  )
}

