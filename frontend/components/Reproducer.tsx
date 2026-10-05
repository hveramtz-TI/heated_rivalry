"use client"
import React, { useRef, useState, useEffect } from "react";
import { FaPlay, FaPause } from "react-icons/fa";

const Reproducer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const playPendingRef = useRef(false);
  const hasStartedRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [pausedAt, setPausedAt] = useState<number | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  const togglePlay = async () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPausedAt(audioRef.current.currentTime);
      setPlaying(false);
      return;
    }

    if (playPendingRef.current) return;

    if (!hasStartedRef.current) {
      audioRef.current.currentTime = 5;
      hasStartedRef.current = true;
    } else if (pausedAt !== null) {
      audioRef.current.currentTime = pausedAt;
    }

    playPendingRef.current = true;
    try {
      await audioRef.current.play();
      setPlaying(true);
      setStatus("");
    } catch {
      setPlaying(false);
      setStatus("No se pudo iniciar el audio. Vuelve a intentarlo.");
    } finally {
      playPendingRef.current = false;
    }
  };

  const handleAudioError = () => {
    setPlaying(false);
    setStatus(
      "No se pudo cargar el audio. Comprueba la conexión e inténtalo de nuevo.",
    );
  };

  return (
    <div
      className="fixed z-200 flex flex-col items-center justify-center gap-2 bottom-[calc(env(safe-area-inset-bottom,0px)+1.5rem)] right-[calc(env(safe-area-inset-right,0px)+1.5rem)]"
    >
      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={
          status
            ? "max-w-56 rounded bg-black/90 px-3 py-2 text-center text-sm text-white shadow-lg"
            : "sr-only"
        }
      >
        {status}
      </p>
      <button
        onClick={togglePlay}
        className="flex items-center justify-center rounded-full border-1 border-yellow-100 bg-black/80 p-4 text-white shadow-lg transition-colors duration-200 hover:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-200 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
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
        className="h-11 w-28 accent-yellow-200 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-200 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        aria-label="Control de volumen"
      />
      <audio
        ref={audioRef}
        src="/soundtrack.mp3"
        loop
        onError={handleAudioError}
      />
    </div>
  );
};

export default Reproducer;
