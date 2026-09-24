import Header from '@/components/Header';
import CharactersSection from '@/components/sections/CharactersSection';
import SeasonsSection from '@/components/sections/SeasonsSection';

export default function Home() {
  return (
    <div className='min-h-screen'>
      <Header />
      <CharactersSection />
      <SeasonsSection />
    </div>
  );
}
