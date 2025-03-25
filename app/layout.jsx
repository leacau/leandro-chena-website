import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Leandro Chena | Consultor Comercial & Capacitador",
  description:
    "Experto en ventas, consultoría comercial y capacitación de equipos de ventas. Descubre cómo puedo ayudarte a potenciar tu negocio.",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <style>{`
          :root {
            --primary-color: #3b82f6;
            --secondary-color: #f3f4f6;
            --text-color: #111827;
            --background-color: #ffffff;
          }
          
          /* Aplicar colores personalizados a elementos específicos */
          .btn-primary {
            background-color: var(--primary-color) !important;
          }
          
          .btn-secondary {
            background-color: var(--secondary-color) !important;
          }
          
          .custom-text {
            color: var(--text-color) !important;
          }
          
          .custom-bg {
            background-color: var(--background-color) !important;
          }
        `}</style>
      </head>
      <body className={`${inter.className} overflow-x-hidden`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col overflow-x-hidden">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'