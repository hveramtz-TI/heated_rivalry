import Image from "next/image";

const CURRENT_YEAR = new Date().getFullYear();

/** 44px (min-h-11) touch target for every footer link (T4). */
const FOOTER_LINK_CLASS =
  "inline-flex min-h-11 items-center rounded text-sm font-semibold tracking-wide text-white/80 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none";

/** In-page destinations; the labels mirror the rendered section headings. */
const FOOTER_SECTIONS = [
  { href: "#personajes", label: "Personajes" },
  { href: "#temporadas", label: "Temporadas" },
  { href: "#libros", label: "Libros" },
] as const;

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Image
                src="/logo.webp"
                alt="Logo Heated Rivalry"
                width={64}
                height={64}
              />
              <p className="text-lg font-bold tracking-wide">Heated Rivalry</p>
            </div>
            <p className="max-w-prose text-sm text-white/70">
              Sitio de fans dedicado a la serie.
            </p>
          </div>

          <nav
            aria-label="Navegación del sitio"
            className="flex flex-col gap-2"
          >
            <h2 className="text-sm font-semibold text-white">Secciones</h2>
            <ul className="flex flex-col gap-1">
              {FOOTER_SECTIONS.map((section) => (
                <li key={section.href}>
                  <a href={section.href} className={FOOTER_LINK_CLASS}>
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-2 text-sm text-white/70">
            <h2 className="text-sm font-semibold text-white">Créditos</h2>
            <p>
              Las imágenes y los audios pertenecen a sus respectivos titulares.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 pt-4 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <p>© {CURRENT_YEAR} Heated Rivalry. Todos los derechos reservados.</p>
          <a href="#main-content" className={FOOTER_LINK_CLASS}>
            Volver arriba
          </a>
        </div>
      </div>
    </footer>
  );
}
