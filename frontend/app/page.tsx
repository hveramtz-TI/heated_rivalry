import Header from '@/components/Header';
import CharactersSection from '@/components/sections/CharactersSection';
import SeasonsSection from '@/components/sections/SeasonsSection';
import BooksSection from '@/components/sections/BooksSection';
import Footer from '@/components/sections/Footer';

export default function Home() {
  return (
    <div className='min-h-screen'>
      <Header />
      <CharactersSection />
      <SeasonsSection />
      <BooksSection />
      <Footer />
    </div>
  );
}
