import Image from "next/image";

/**
 * Static site footer (site-footer spec, decision 5). It reads nothing from the
 * JSON data layer — its content is fixed site chrome, not catalog data. Every
 * link is an in-page anchor to a section rendered by the same route; no
 * external, social, or legal destination is invented.
 */
const CURRENT_YEAR = new Date().getFullYear();

const FOOTER_LINK_CLASS =
  "rounded text-sm font-semibold tracking-wide text-white/80 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 md:flex-row md:items-start md:justify-between md:px-8">
        <div className="flex items-center gap-4">
          <Image
            src="/logo.png"
            alt="Logo Heated Rivalry"
            width={64}
            height={64}
          />
          <p className="text-lg font-bold tracking-wide">Heated Rivalry</p>
        </div>

        <nav
          aria-label="Navegación del sitio"
          className="flex flex-col gap-3 md:flex-row md:gap-8"
        >
          <a href="#personajes" className={FOOTER_LINK_CLASS}>
            Personajes
          </a>
          <a href="#temporadas" className={FOOTER_LINK_CLASS}>
            Temporadas
          </a>
          <a href="#libros" className={FOOTER_LINK_CLASS}>
            Libros
          </a>
        </nav>

        <div className="flex flex-col gap-2 text-sm text-white/70">
          <p>© {CURRENT_YEAR} Heated Rivalry. Todos los derechos reservados.</p>
          <p>Sitio de fans dedicado a la serie.</p>
          <p>
            Las imágenes y los audios pertenecen a sus respectivos titulares.
          </p>
        </div>
      </div>
    </footer>
  );
}
