import React from 'react'

type Props = {}

const VideoBackground = (props: Props) => {
  return (
    <div className="relative inset-0 w-screen h-screen -z-10 overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover"
      >
        <source src="/H2.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/50" />
    </div>
  )
}

export default VideoBackground