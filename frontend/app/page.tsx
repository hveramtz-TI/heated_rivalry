import Header from '@/components/Header';
import Hollander from '@/components/Hollander';
import Rozanov from '@/components/Rozanov';
import Hunter from '@/components/Hunter';
import Bio from '@/components/Bio';
import Separator from '@/components/Separator';

export default function Home() {
  return (
    <div className='min-h-screen'>
      <Header />
      <Hollander />
      <Separator />
      <Rozanov />
      <Separator />
      <Hunter />
    </div>
  );
}
