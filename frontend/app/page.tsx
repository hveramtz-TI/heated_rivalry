import Header from '@/components/Header';
import Hollander from '@/components/Hollander';
import Rozanov from '@/components/Rozanov';
import Hunter from '@/components/Hunter';
import Bio from '@/components/Bio';

export default function Home() {
  return (
    <div className='min-h-screen'>
      <Header />
      <Bio>
      </Bio>
      <Hollander />
      <Rozanov />
      <Hunter />
    </div>
  );
}
