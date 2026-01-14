import React from 'react'
import Image from 'next/image'

type Props = {
  imageSrc?: string;
}

const Profile = (props: Props) => {
  return (
    <div className='h-screen'>
      <Image src={props.imageSrc || "/profile.jpg"} alt="Profile Image" width={200} height={200} />
    </div>
  )
}

export default Profile