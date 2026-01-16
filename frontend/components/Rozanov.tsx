
'use client'
import React, { use } from 'react'
import Bio from './Bio'
import Image from 'next/image'
import rozanov from '@/public/rozanov.png'
import gsap from 'gsap'
import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type Props = {}

const Rozanov = (props: Props) => {
  gsap.registerPlugin(ScrollTrigger);
  const tlrozanov = gsap.timeline();

  useEffect(() => {
    tlrozanov.to(".imageRozanov", {
      opacity: 1,
      x: "32%",
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".rozanov",
        start: "20% top",
        end: "90% 50%",
        scrub: true,
        markers:true,
      },
    });
  }, []);

  return (
    <div className="rozanov bg-gradient-to-tr from-[#002AFF] to-[#080428] mt-screen max-w-screen overflow-hidden">
      <Bio>
        <div className="flex md:flex-row items-center justify-center min-h-screen max-w-screen">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl text-white font-bold mb-4">Rozanov</h1>
            <p className="text-white max-w-lg md:max-w-xl text-base md:text-lg">
              Rozanov es un competidor audaz, reconocido por su enfoque innovador y su capacidad para adaptarse rápidamente a cualquier situación. Su agilidad mental y física lo convierten en un rival impredecible, capaz de sorprender con movimientos inesperados. Siempre busca superar sus propios límites y desafiar las expectativas, inspirando a otros con su pasión y energía. Fuera de la competencia, Rozanov es admirado por su espíritu colaborativo y su compromiso con el desarrollo de nuevas estrategias en la comunidad.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Image
              src={rozanov}
              alt="Rozanov"
              width={1000}
              height={1000}
              className="imageRozanov w-full md:w-[90vh] translate-x-100 opacity-0"
            />
          </div>
        </div>
      </Bio>
    </div>
  )
}

export default Rozanov