"use client"
import React, { useRef, useState, useEffect } from "react";
import { FaPlay, FaPause } from "react-icons/fa";

type Props = {};

const Reproducer = (props: Props) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [pausedAt, setPausedAt] = useState<number | null>(null);
  // Actualizar el volumen del audio cuando cambie el estado volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  // Reproducir automáticamente tras 2 segundos de montar el componente
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (playing && audioRef.current) {
        // Si hay una posición pausada, reanudar desde ahí
        if (pausedAt !== null) {
          audioRef.current.currentTime = pausedAt;
        } else {
          audioRef.current.currentTime = 7;
        }
        audioRef.current.play().catch(() => {});
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [playing]);
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPausedAt(audioRef.current.currentTime); // Guardar posición de pausa
      setPlaying(false);
    } else {
      // Si hay una posición pausada, reanudar desde ahí
      if (pausedAt !== null) {
        audioRef.current.currentTime = pausedAt;
      } else {
        audioRef.current.currentTime = 5;
      }
      audioRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-200 flex flex-col justify-center items-center gap-2">
      <button
        onClick={togglePlay}
        className="bg-black/80 hover:bg-black/90 border-1 border-yellow-100 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition-colors duration-200"
        aria-label={playing ? "Pausar música" : "Reproducir música"}
      >
        {playing ? <FaPause size={28} /> : <FaPlay size={28} />}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
        className="w-28 accent-yellow-200"
        aria-label="Control de volumen"
      />
      <audio ref={audioRef} src="/soundtrack.mp3" loop />
    </div>
  );
};

export default Reproducer;