import Header from '@/components/Header';
import CharactersSection from '@/components/sections/CharactersSection';
import SeasonsSection from '@/components/sections/SeasonsSection';
import BooksSection from '@/components/sections/BooksSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className='min-h-screen'>
      <Header />
      <div className='mt-[60dvh]'></div>
      <main id="main-content">
        <CharactersSection />
        <SeasonsSection />
        <BooksSection />
      </main>
      <Footer />
    </div>
  );
}
