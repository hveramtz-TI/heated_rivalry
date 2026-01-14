"use client";
import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


const Header: React.FC = () => {
	const headerRef = useRef<HTMLHeadElement>(null);
	const logoRef = useRef<HTMLImageElement>(null);
    
    const setupAnimation = () => {
        if (headerRef.current && logoRef.current) {
            gsap.registerPlugin(ScrollTrigger);
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: headerRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                    markers: true,
                },
            });
            tl.to(logoRef.current, {
                height: '80px',
                width: '150px',
                ease: 'power1.out',
            }, 0) // el 0 indica que inicia al mismo tiempo
            .to(headerRef.current, {
                height: "100px",
                ease: 'power1.out',
                top: 0,
                left: 0,
                right: 0,
                margin: '0 auto',
                position: 'fixed',
            }, 0); // también inicia al mismo tiempo
        }
    };

    useEffect(() => {
        setupAnimation();
    }, []);


	return (
		<header ref={headerRef} className=" flex items-center justify-center h-screen gap-4 overflow-hidden">
			<Image
				ref={logoRef}
				src="/logo.png"
				alt="Logo Heated Rivalry"
				width={500}
				height={500}
			/>
		</header>
	);
};

export default Header;
