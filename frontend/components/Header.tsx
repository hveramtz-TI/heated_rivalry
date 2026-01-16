"use client";
import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VideoBackground from "./Videobackground";

const Header = () => {
  const videoBgRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // 1) Define estado inicial para evitar saltos
    gsap.set(videoBgRef.current, { filter: "brightness(1) blur(0px)" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: headerRef.current,
        start: "1% top",
        end: "bottom 50%",
        scrub: true,
      },
    });

    // 2) Animaciones principales al inicio
    tl.to(logoRef.current, {
      height: "80px",
      width: "150px",
      ease: "power1.out",
    }, 0)
    .to(headerRef.current, {
      height: "100px",
      ease: "power1.out",
      top: 0,
      left: 0,
      right: 0,
      margin: "0 auto",
      zIndex: 50,
    }, 0)
    .to(videoBgRef.current, {
      height: "100px",
      ease: "power1.out",
    }, 0)
    .to(videoBgRef.current, {
      filter: "brightness(0) blur(0px)",
      ease: "none",
      duration: 0.2,
    }, 0)
    .to(".hollander", {
        marginTop:"55vh",
        ease: "power1.out",
    }, 0);


    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 m-auto flex items-center justify-center min-w-screen h-screen overflow-hidden bg-black"
    >
      <div ref={videoBgRef} className="absolute w-full h-full inset-0">
        <VideoBackground />
      </div>

      <Image
        ref={logoRef}
        src="/logo.png"
        alt="Logo Heated Rivalry"
        width={500}
        height={500}
        className="absolute"
      />
    </header>
  );
};

export default Header;
