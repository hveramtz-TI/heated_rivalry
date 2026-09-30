"use client";

import Image from "next/image";
import type { SpringOptions } from "motion/react";
import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { MISSING_CONTENT_LABEL } from "@/data/ui";

/**
 * next/image wrapped by Motion (design D4): the art still participates in the
 * tilt transform while the asset goes through the Next optimizer, so both
 * `public/`-rooted art and allowlisted remote shields are policy-checked.
 */
const MotionImage = motion.create(Image);

interface TiltedCardProps {
  /** Card face; `undefined` renders the missing-content placeholder (no <img>). */
  imageSrc?: string;
  altText?: string;
  captionText?: string;
  containerHeight?: React.CSSProperties["height"];
  containerWidth?: React.CSSProperties["width"];
  /** Intrinsic art dimensions handed to next/image (defaults to a 3:4 ratio). */
  imageHeight?: number;
  imageWidth?: number;
  /** Responsive sizes hint passed to next/image. */
  imageSizes?: string;
  loading?: "lazy" | "eager";
  scaleOnHover?: number;
  rotateAmplitude?: number;
  showMobileWarning?: boolean;
  /** Localized notice copy; the notice renders only when this is provided. */
  mobileWarningText?: string;
  showTooltip?: boolean;
  overlayContent?: React.ReactNode;
  displayOverlayContent?: boolean;
  /**
   * Optional slot rendered inside the tilting container in place of the
   * built-in image/placeholder block. When omitted, the component behaves
   * exactly as before.
   */
  content?: React.ReactNode;
}

const springValues: SpringOptions = {
  damping: 30,
  stiffness: 100,
  mass: 2
};

export default function TiltedCard({
  imageSrc,
  altText = "",
  captionText = "",
  containerHeight = "auto",
  containerWidth = "100%",
  imageHeight = 400,
  imageWidth = 300,
  imageSizes = "(min-width: 768px) 30vw, 90vw",
  loading = "lazy",
  scaleOnHover = 1.1,
  rotateAmplitude = 14,
  showMobileWarning = false,
  mobileWarningText,
  showTooltip = true,
  overlayContent = null,
  displayOverlayContent = false,
  content = null
}: TiltedCardProps) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1
  });

  const [lastY, setLastY] = useState(0);

  function handleMouse(e: React.MouseEvent<HTMLElement>) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    rotateX.set(rotationX);
    rotateY.set(rotationY);

    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);

    const velocityY = offsetY - lastY;
    rotateFigcaption.set(-velocityY * 0.6);
    setLastY(offsetY);
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
    opacity.set(1);
  }

  function handleMouseLeave() {
    opacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
  }

  return (
    <figure
      ref={ref}
      className="relative w-full [perspective:800px] flex flex-col items-center justify-center"
      style={{
        height: containerHeight,
        width: containerWidth
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showMobileWarning && mobileWarningText && (
        <div className="absolute top-4 text-center text-sm block sm:hidden">
          {mobileWarningText}
        </div>
      )}

      <motion.div
        className="relative w-full [transform-style:preserve-3d]"
        style={{
          rotateX,
          rotateY,
          scale
        }}
      >
        {content ? (
          content
        ) : imageSrc ? (
          <MotionImage
            src={imageSrc}
            alt={altText}
            width={imageWidth}
            height={imageHeight}
            sizes={imageSizes}
            loading={loading}
            className="w-full h-auto object-cover rounded-[15px] will-change-transform [transform:translateZ(0)]"
          />
        ) : (
          <div className="w-full aspect-[3/4] flex items-center justify-center rounded-[15px] bg-black/40 px-4 text-center text-sm text-white/70">
            {MISSING_CONTENT_LABEL}
          </div>
        )}

        {displayOverlayContent && overlayContent && (
          <motion.div className="absolute top-0 left-0 z-[2] will-change-transform [transform:translateZ(30px)]">
            {overlayContent}
          </motion.div>
        )}
      </motion.div>

      {showTooltip && (
        <motion.figcaption
          className="pointer-events-none absolute left-0 top-0 rounded-[4px] bg-white px-[10px] py-[4px] text-[10px] text-[#2d2d2d] opacity-0 z-[3] hidden sm:block"
          style={{
            x,
            y,
            opacity,
            rotate: rotateFigcaption
          }}
        >
          {captionText}
        </motion.figcaption>
      )}
    </figure>
  );
}
