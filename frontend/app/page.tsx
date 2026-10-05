import Header from '@/components/Header';
import CharactersSection from '@/components/sections/CharactersSection';
import SeasonsSection from '@/components/sections/SeasonsSection';
import BooksSection from '@/components/sections/BooksSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className='min-h-screen pb-52 md:pb-44'>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-black focus:outline-none focus:ring-2 focus:ring-yellow-200"
      >
        Saltar al contenido principal
      </a>
      <Header />
      <div className='mt-[50dvh]'></div>
      <main id="main-content">
        <CharactersSection />
        <SeasonsSection />
        <BooksSection />
      </main>
      <Footer />
    </div>
  );
}
