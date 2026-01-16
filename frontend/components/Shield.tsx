import React from 'react'
import Image from 'next/image'

type Props = {
    imageSrc: string;
    className?: string;
}

const Shield = ({ imageSrc, className }: Props) => {
  return (
    <div className={className}>
      <div className="p-2 backdrop-blur-3xl bg-white/20 w-fit rounded-2xl border-2 border-white/30 hover:scale-105 transition-transform duration-300">
        <Image
          src={imageSrc}
          alt="Shield"
          width={100}
          height={100}
          className="w-16 h-16"
        />
      </div>
    </div>
  )
}

export default Shield