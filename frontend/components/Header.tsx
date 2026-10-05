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
  const navRef = useRef<HTMLElement>(null);
  const navVisibleRef = useRef(false);
  const navHidePendingRef = useRef(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const setCompactNavVisible = (visible: boolean) => {
      const nav = navRef.current;
      if (!nav) return;

      if (visible) {
        navHidePendingRef.current = false;
        if (navVisibleRef.current) return;

        nav.style.visibility = "visible";
        nav.style.pointerEvents = "auto";
        nav.inert = false;
        nav.removeAttribute("aria-hidden");
        navVisibleRef.current = true;
        return;
      }

      if (nav.contains(document.activeElement)) {
        navHidePendingRef.current = true;
        return;
      }

      navHidePendingRef.current = false;
      if (!navVisibleRef.current) return;

      nav.style.visibility = "hidden";
      nav.style.pointerEvents = "none";
      nav.inert = true;
      nav.setAttribute("aria-hidden", "true");
      navVisibleRef.current = false;
    };

    const nav = navRef.current;
    const handleNavFocusOut = (event: FocusEvent) => {
      if (
        event.relatedTarget instanceof Node &&
        nav?.contains(event.relatedTarget)
      ) {
        return;
      }

      if (navHidePendingRef.current) {
        queueMicrotask(() => {
          if (navHidePendingRef.current) setCompactNavVisible(false);
        });
      }
    };

    nav?.addEventListener("focusout", handleNavFocusOut);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const setupAnimated = () => {
      // 1) Define estado inicial para evitar saltos
      gsap.set(videoBgRef.current, { filter: "brightness(1) blur(0px)" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: headerRef.current,
          start: "1% top",
          end: "bottom 50%",
          scrub: true,
          onUpdate: (self) => setCompactNavVisible(self.progress >= 0.999),
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
      }, 0)
      .to(videoBgRef.current, {
        height: "100px",
        ease: "power1.out",
      }, 0)
      .to(videoBgRef.current, {
        filter: "brightness(0) blur(0px)",
        ease: "none",
        duration: 0.2,
      }, 0);

      setCompactNavVisible(
        Boolean(tl.scrollTrigger && tl.scrollTrigger.progress >= 0.999),
      );

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        gsap.set([logoRef.current, headerRef.current, videoBgRef.current], {
          clearProps: "all",
        });
      };
    };

    const setupReduced = () => {
      gsap.set(logoRef.current, { width: "150px", height: "80px" });
      gsap.set(headerRef.current, {
        height: "100px",
        top: 0,
        left: 0,
        right: 0,
        margin: "0 auto",
      });
      gsap.set(videoBgRef.current, {
        height: "100px",
        filter: "brightness(0) blur(0px)",
      });
      setCompactNavVisible(true);

      return () => {
        gsap.set([logoRef.current, headerRef.current, videoBgRef.current], {
          clearProps: "all",
        });
      };
    };

    let disposeSetup = reduceMotion.matches
      ? setupReduced()
      : setupAnimated();

    const handleMotionPreferenceChange = () => {
      disposeSetup();
      disposeSetup = reduceMotion.matches ? setupReduced() : setupAnimated();
    };

    reduceMotion.addEventListener("change", handleMotionPreferenceChange);

    return () => {
      nav?.removeEventListener("focusout", handleNavFocusOut);
      reduceMotion.removeEventListener("change", handleMotionPreferenceChange);
      disposeSetup();
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="z-100 fixed top-0 left-0 m-auto flex items-center justify-center min-w-screen h-screen overflow-hidden bg-black"
    >
      <div ref={videoBgRef} className="absolute w-full h-full inset-0">
        <VideoBackground />
      </div>

      <h1 className="absolute inset-0 m-0 flex items-center justify-center">
        <Image
          ref={logoRef}
          src="/logo.png"
          alt="Heated Rivalry"
          width={500}
          height={500}
          className="absolute"
        />
      </h1>

      <nav
        ref={navRef}
        aria-hidden="true"
        aria-label="Navegación principal"
        inert
        className="invisible pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 flex-col gap-2 text-[10px] font-semibold text-white sm:right-6 sm:flex-row sm:gap-4 sm:text-sm"
      >
        <a
          className="inline-flex min-h-11 items-center justify-center rounded px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-200"
          href="#personajes"
        >
          Personajes
        </a>
        <a
          className="inline-flex min-h-11 items-center justify-center rounded px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-200"
          href="#temporadas"
        >
          Temporadas
        </a>
        <a
          className="inline-flex min-h-11 items-center justify-center rounded px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-200"
          href="#libros"
        >
          Libros
        </a>
      </nav>
    </header>
  );
};

export default Header;
