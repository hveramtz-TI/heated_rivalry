import Header from '@/components/Header';
import CharactersSection from '@/components/sections/CharactersSection';
import SeasonsSection from '@/components/sections/SeasonsSection';
import BooksSection from '@/components/sections/BooksSection';
import Footer from '@/components/sections/Footer';

export default function Home() {
  return (
    <div className='min-h-screen'>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-black focus:outline-none focus:ring-2 focus:ring-yellow-200"
      >
        Saltar al contenido principal
      </a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <CharactersSection />
        <SeasonsSection />
        <BooksSection />
      </main>
      <Footer />
    </div>
  );
}
