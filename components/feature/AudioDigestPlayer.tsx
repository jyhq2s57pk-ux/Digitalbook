'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface AudioDigestPlayerProps {
  /** Map of language code → audio file path, e.g. { en: "/audio/jan-2026/digest-en.mp3" } */
  audioSources: Record<string, string>;
  variant?: 'light' | 'dark';
}

const LANGUAGE_LABELS: Record<string, string> = {
  en: 'English',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  es: 'Spanish',
  pt: 'Portuguese',
  nl: 'Dutch',
  pl: 'Polish',
  tr: 'Turkish',
  ar: 'Arabic',
  zh: 'Chinese',
  ja: 'Japanese',
};

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function AudioDigestPlayer({
  audioSources,
  variant = 'light',
}: AudioDigestPlayerProps) {
  const languages = Object.keys(audioSources);
  const [activeLang, setActiveLang] = useState(languages[0] || 'en');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isLight = variant === 'light';
  const bgColor = isLight ? '#F5F3ED' : '#454545';
  const textColor = isLight ? 'var(--color-night)' : '#FFFFFF';
  const subtextColor = isLight ? 'var(--color-night-40)' : '#A8A8A8';
  const progressBg = isLight ? '#D4D4D4' : '#616161';
  const progressFill = isLight ? 'var(--color-primary)' : '#8F53F0';

  const currentSrc = audioSources[activeLang];

  // Update time display
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration || 0);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [activeLang]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * duration;
  }, [duration]);

  const handleLanguageChange = useCallback((lang: string) => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setIsPlaying(false);
      setCurrentTime(0);
    }
    setActiveLang(lang);
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (languages.length === 0) return null;

  return (
    <div
      className="rounded-[var(--radius-image)] p-6 md:p-8"
      style={{ backgroundColor: bgColor }}
    >
      {/* Hidden audio element */}
      <audio ref={audioRef} src={currentSrc} preload="metadata" />

      {/* Language tabs */}
      {languages.length > 1 && (
        <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
          {languages.map((lang) => {
            const isActive = activeLang === lang;
            return (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-body-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : isLight
                    ? 'text-night-40 hover:text-night hover:bg-night-80/30'
                    : 'text-white/50 hover:text-white hover:bg-white/10'
                }`}
              >
                {LANGUAGE_LABELS[lang] || lang.toUpperCase()}
              </button>
            );
          })}
        </div>
      )}

      {/* Player controls */}
      <div className="flex items-center gap-4">
        {/* Play/Pause button */}
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors"
          style={{ backgroundColor: progressFill }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <polygon points="8,4 20,12 8,20" />
            </svg>
          )}
        </button>

        {/* Progress + time */}
        <div className="flex-1 min-w-0">
          {/* Progress bar */}
          <div
            className="h-2 rounded-full cursor-pointer"
            style={{ backgroundColor: progressBg }}
            onClick={handleSeek}
            role="slider"
            aria-valuenow={currentTime}
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-label="Audio progress"
          >
            <div
              className="h-full rounded-full transition-[width] duration-100"
              style={{ width: `${progress}%`, backgroundColor: progressFill }}
            />
          </div>

          {/* Time display */}
          <div className="flex justify-between mt-1.5">
            <span className="text-body-xs" style={{ color: subtextColor }}>
              {formatTime(currentTime)}
            </span>
            <span className="text-body-xs" style={{ color: subtextColor }}>
              {duration > 0 ? formatTime(duration) : '--:--'}
            </span>
          </div>
        </div>
      </div>

      {/* Language label */}
      <p className="text-body-xs mt-4" style={{ color: subtextColor }}>
        Listening in: {LANGUAGE_LABELS[activeLang] || activeLang.toUpperCase()}
      </p>
    </div>
  );
}
