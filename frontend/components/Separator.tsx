import React from 'react'
import Image from 'next/image'
import separator from '@/public/separator.jpg'

type Props = {}

const Separator = (props: Props) => {
  return (
    <div className="-translate-y-8 w-full h-0 flex justify-center">
      <Image
        src={separator}
        alt="Separador"
        className="w-full h-10 object-cover"
        priority
      />
    </div>
  )
}

export default Separator