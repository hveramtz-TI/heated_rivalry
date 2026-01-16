'use client'
import React, { use } from 'react'
import Bio from './Bio'
import Image from 'next/image'
import hollander from '@/public/hollander.png'
import holladnerCard from '@/public/hollanderCard.png'
import gsap from 'gsap'
import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Shield from './Shield'

type Props = {}

const Hollander = (props: Props) => {
  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    // Estado inicial para los shields y la imagen
    gsap.set([".shield-hollander-1", ".shield-hollander-2"], { opacity: 0, y: -40 });
    gsap.set(".imageHollander", { opacity: 0, x: '-100%' });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hollander",
        start: "20% top",
        end: "90% 55%",
        scrub: true,
        markers: false,
      }
    });

    tl
    .to(
      ".shield-hollander-1",
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      },
      0
    )
    .to(
      ".shield-hollander-2",
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      }, 0.2
    )
    .to(
      ".imageHollander",
      {
        opacity: 1,
        x: "-32%",
        duration:2,
        ease: "power2.out"
      },
      0.3
    );

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);


  return (
    <div className="hollander bg-gradient-to-tl from-[#FF002A] to-[#280408]  mt-screen">
      <Bio>
        <div className="flex md:flex-row items-center justify-center min-h-screen">
           <div className="flex-shrink-0">
            <Image
              src={hollander}
              alt="Hollander"
              width={1500}
              height={1500}
              className="imageHollander w-screen md:w-[90vh] opacity-0"
            />
          </div>
          <div className="flex flex-col text-center gap-7 md:text-left">
            <div className='flex flex-row gap-4'>
              <Shield className='shield-hollander-1' imageSrc='https://static.wikia.nocookie.net/game-changers-series/images/f/f9/Montreal_Metros_Logo.png/revision/latest?cb=20260102102951' />
              <Shield className='shield-hollander-2' imageSrc='https://upload.wikimedia.org/wikipedia/commons/d/d9/Flag_of_Canada_%28Pantone%29.svg' />
            </div>
            <h1 className="text-4xl md:text-6xl text-white font-bold">Hollander</h1>
            <p className="text-white max-w-lg md:max-w-xl text-base md:text-lg">
              Hollander is a seasoned competitor known for his strategic mind and relentless determination. With years of experience under his belt, he has honed his skills to perfection, making him a formidable opponent in any challenge. His calm demeanor and analytical approach allow him to stay composed under pressure, often outsmarting his rivals with well-thought-out tactics. Off the field, Hollander is respected for his sportsmanship and dedication to mentoring up-and-coming talent in the community.
            </p>
          </div>
        </div>
      </Bio>
    </div>
  )
}

export default Hollander