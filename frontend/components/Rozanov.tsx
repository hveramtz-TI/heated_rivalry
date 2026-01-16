
'use client'
import React, { use } from 'react'
import Bio from './Bio'
import Image from 'next/image'
import rozanov from '@/public/rozanov.png'
import gsap from 'gsap'
import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Shield from './Shield'

type Props = {}

const Rozanov = (props: Props) => {
  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {

    // Estado inicial para los shields y la imagen
    gsap.set([".shield-3", ".shield-4"], { opacity: 0, y: -40 });
    gsap.set(".rozanov-description", { opacity: 0, y: -40 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".rozanov",
        start: "20% top",
        end: "90% 55%",
        scrub: true,
        markers: false,
      }
    });

    tl
    .to(
      ".shield-3",
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      },
      0
    )
    .to(
      ".shield-4",
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      }, 0.2
    )
    .to(
      ".rozanov-description",
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
      },
      0.3
    )
    .to(
      ".imageRozanov",
      {
        opacity: 1,
        x: "31%",
        duration:2,
        ease: "power2.out"
      },
      0.4
    );

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);

  return (
    <div className="rozanov bg-gradient-to-tr from-[#002AFF] to-[#080428] mt-screen max-w-screen overflow-hidden">
      <Bio>
        <div className="flex md:flex-row items-center justify-center min-h-screen max-w-screen">
          <div className="flex flex-col text-center gap-8 md:text-left">
            <div className='flex flex-row gap-4'>
              <Shield className='shield-3' imageSrc={'https://static.wikia.nocookie.net/game-changers-series/images/a/a1/Boston_Raiders_Logo.png/revision/latest?cb=20260102134316'} />
              <Shield className='shield-4' imageSrc={'https://upload.wikimedia.org/wikipedia/commons/f/f3/Flag_of_Russia.svg'} />
            </div>
            <div className='rozanov-description flex flex-col gap-8' >
              <h1 className="text-4xl md:text-6xl text-white font-bold">Rozanov</h1>
              <p className=" text-white max-w-lg md:max-w-xl text-base md:text-lg">
                Rozanov es un competidor audaz, reconocido por su enfoque innovador y su capacidad para adaptarse rápidamente a cualquier situación. Su agilidad mental y física lo convierten en un rival impredecible, capaz de sorprender con movimientos inesperados. Siempre busca superar sus propios límites y desafiar las expectativas, inspirando a otros con su pasión y energía. Fuera de la competencia, Rozanov es admirado por su espíritu colaborativo y su compromiso con el desarrollo de nuevas estrategias en la comunidad.
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Image
              src={rozanov}
              alt="Rozanov"
              width={1000}
              height={1000}
              className="imageRozanov w-full md:w-[90vh] opacity-0 translate-x-full"
            />
          </div>
        </div>
      </Bio>
    </div>
  )
}

export default Rozanov