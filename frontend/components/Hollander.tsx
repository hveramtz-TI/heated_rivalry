import React from 'react'
import Bio from './Bio'
import Image from 'next/image'

type Props = {}

const Hollander = (props: Props) => {
  return (
    <div className="hollander bg-white mt-screen">
      <Bio>
        <div className="flex flex-col md:flex-row items-center justify-center min-h-screen md:gap-16 gap-8 p-4 md:p-12">
          <div className="mb-6 md:mb-0 flex-shrink-0">
            <Image
              src="/hollander.png"
              alt="Hollander"
              width={400}
              height={600}
              className="rounded-lg shadow-lg w-full md:w-[400px] h-auto"
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