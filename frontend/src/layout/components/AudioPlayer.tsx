import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect, useRef } from "react";

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const prevSongUrlRef = useRef<string | null>(null);

  const { currentSong, isPlaying, playNext } = usePlayerStore();

  // Effect to handle current song changes
  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => playNext();

    audio?.addEventListener("ended", handleEnded);
    return () => audio?.removeEventListener("ended", handleEnded);
  }, [playNext]);

  // MERGED EFFECT: Handles both source change AND play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    // Use the renamed ref for clarity
    const isSongChanged = prevSongUrlRef.current !== currentSong.audioUrl;

    if (isSongChanged) {
      // 1. Update the source immediately
      audio.src = currentSong.audioUrl;
      audio.currentTime = 0;
      prevSongUrlRef.current = currentSong.audioUrl;
    }

    // 2. Manage play state after ensuring source is correct/updated
    if (isPlaying) {
      // We catch the AbortError here, which is expected behavior for React
      audio.play().catch((e) => {
        if (e.name !== "AbortError") {
          console.error("Audio playback failed:", e);
        }
      });
    } else {
      audio.pause();
    }
  }, [currentSong, isPlaying]);

  return <audio ref={audioRef} />;
};

export default AudioPlayer;
