export const metadata = {
  title: "Sobre Mí | Leandro Chena",
  description:
    "Conoce más sobre Leandro Chena, consultor comercial y capacitador con amplia experiencia en ventas y liderazgo.",
}

export default function SobreMiPage() {
  return (
    <div className="container mx-auto px-6 py-12 md:py-24">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Sobre Mí</h1>
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p>
          Con más de 15 años de experiencia en el mundo comercial, he ayudado a equipos a
          transformar su enfoque de ventas y liderazgo, logrando resultados extraordinarios.
        </p>
        <p>
          Mi metodología combina estrategias probadas con un enfoque humano y sensible, adaptado a las necesidades específicas de cada organización y equipo.
        </p>
      </div>
    </div>
  )
}

