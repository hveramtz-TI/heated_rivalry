'use client'
import React, { use } from 'react'
import Bio from './Bio'
import Image from 'next/image'
import hollander from '@/public/hollander.png'
import holladnerCard from '@/public/hollanderCard.png'
import gsap from 'gsap'
import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type Props = {}

const Hollander = (props: Props) => {
  gsap.registerPlugin(ScrollTrigger);
  const tlhollander = gsap.timeline();

  useEffect(() => {
    tlhollander.to(".imageHollander", {
      opacity: 1,
      x: "-32%",
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".hollander",
        start: "20% top",
        end: "bottom 50%",
        scrub: true,
        markers:false,
      },
    });
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
              className="imageHollander w-screen md:w-[90vh] -translate-x-100 opacity-0"
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl text-white font-bold mb-4">Hollander</h1>
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