'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface AudioPlayerCardProps {
  language: string;
  languageRegion?: string;
  audioSrc: string;
}

export default function AudioPlayerCard({
  language,
  languageRegion,
  audioSrc,
}: AudioPlayerCardProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (!isDragging) {
        setCurrentTime(audio.currentTime);
      }
    };
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    const handleDurationChange = () => {
      setDuration(audio.duration);
    };
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    // Try to get duration if already loaded
    if (audio.duration) {
      setDuration(audio.duration);
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isDragging]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skip = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const audioDuration = audio.duration || 0;
    const newTime = Math.max(0, Math.min(audioDuration, audio.currentTime + seconds));
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  }, []);

  const seekToPosition = useCallback((clientX: number) => {
    const audio = audioRef.current;
    const progressBar = progressRef.current;
    if (!audio || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = clickX / rect.width;
    const audioDuration = audio.duration || 0;
    const newTime = percentage * audioDuration;

    audio.currentTime = newTime;
    setCurrentTime(newTime);
  }, []);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    seekToPosition(e.clientX);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    seekToPosition(e.clientX);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      seekToPosition(moveEvent.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-[#252525] flex flex-col md:flex-row md:h-[138px] md:items-center md:justify-between p-4 md:pl-4 md:pr-5 md:py-4 rounded-[22px] gap-4 md:gap-0">
      <audio ref={audioRef} src={audioSrc} preload="metadata" />

      {/* Top (mobile) / Left (desktop): Logo and Language */}
      <div className="flex flex-row md:flex-col items-center md:items-start md:justify-between gap-[20px] md:gap-0 p-[10px] rounded-[12px] bg-[#2f2f2f] shrink-0 w-full md:w-[130px] h-[44px] md:h-[106px]">
        <img
          src="/logomark.svg"
          alt="AudioDigest"
          className="h-[20px] w-auto shrink-0 hidden md:block"
        />
        <p className="text-[13px] leading-[18px] text-white text-left flex flex-col justify-center">
          <span className="font-semibold">{language}</span>
          {languageRegion && (
            <span className="font-normal">{languageRegion}</span>
          )}
        </p>
      </div>

      {/* Bottom (mobile) / Right (desktop): Controls and Progress */}
      <div className="flex-1 flex flex-col justify-center md:pl-5">
        {/* Playback Controls */}
        <div className="flex gap-[25px] items-center justify-center mb-3">
          <button
            onClick={() => skip(-10)}
            className="opacity-50 hover:opacity-70 transition-opacity"
            aria-label="Rewind 10 seconds"
          >
            <img src="/icons/Rewind--10.svg" alt="Rewind 10 seconds" width={32} height={32} />
          </button>

          <button
            onClick={togglePlay}
            className="hover:opacity-90 transition-opacity"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            <img
              src={isPlaying ? '/icons/Pause--outline--filled.svg' : '/icons/Play--filled.svg'}
              alt={isPlaying ? 'Pause' : 'Play'}
              width={48}
              height={48}
            />
          </button>

          <button
            onClick={() => skip(10)}
            className="opacity-50 hover:opacity-70 transition-opacity"
            aria-label="Forward 10 seconds"
          >
            <img src="/icons/Forward--10.svg" alt="Forward 10 seconds" width={32} height={32} />
          </button>
        </div>

        {/* Progress Bar / Scrubber */}
        <div className="flex items-center gap-3">
          <span className="text-[12px] text-white/60 min-w-[32px] tabular-nums">
            {formatTime(currentTime)}
          </span>
          <div
            ref={progressRef}
            className="flex-1 h-[6px] rounded-full cursor-pointer relative bg-white/20 group"
            onClick={handleProgressClick}
            onMouseDown={handleMouseDown}
          >
            {/* Progress fill */}
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-white/70 pointer-events-none"
              style={{ width: `${progressPercentage}%` }}
            />
            {/* Scrubber handle */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-[14px] h-[14px] rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{ left: `calc(${progressPercentage}% - 7px)` }}
            />
          </div>
          <span className="text-[12px] text-white/60 min-w-[32px] text-right tabular-nums">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}
