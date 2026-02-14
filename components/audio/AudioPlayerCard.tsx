'use client';

import { useState, useRef, useEffect } from 'react';

interface AudioPlayerCardProps {
  language: string;
  languageFlag: string;
  editionDate: string;
  audioSrc: string;
  variant?: 'light' | 'dark';
}

export default function AudioPlayerCard({
  language,
  languageFlag,
  editionDate,
  audioSrc,
  variant = 'dark',
}: AudioPlayerCardProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  const isLight = variant === 'light';
  const cardBg = isLight ? '#F5F3ED' : '#252525';
  const textColor = isLight ? '#252525' : '#FFFFFF';
  const secondaryTextColor = isLight ? '#666666' : '#CACACA';
  const progressBg = isLight ? '#D5D5D5' : '#4A4A4A';
  const progressFill = isLight ? '#252525' : '#FFFFFF';

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

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

  const skipBackward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, audio.currentTime - 15);
  };

  const skipForward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(duration, audio.currentTime + 15);
  };

  const cyclePlaybackRate = () => {
    const rates = [1, 1.25, 1.5, 1.75, 2, 0.75];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    audio.currentTime = percentage * duration;
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="relative w-full rounded-[22px] p-4 md:p-5"
      style={{ backgroundColor: cardBg }}
    >
      <audio ref={audioRef} src={audioSrc} preload="metadata" />

      {/* Desktop Layout */}
      <div className="hidden md:flex items-center gap-4">
        {/* Left: Logo and Language */}
        <div
          className="flex flex-col items-center justify-center gap-2 px-6 py-5 rounded-[16px] min-w-[180px]"
          style={{ backgroundColor: '#2F2F2F' }}
        >
          <AudioDigestLogo />
          <span
            className="text-[12px] leading-[18px] text-center whitespace-nowrap"
            style={{ color: '#FFFFFF' }}
          >
            {languageFlag} {language}, {editionDate}
          </span>
        </div>

        {/* Right: Controls and Progress */}
        <div className="flex-1 flex flex-col gap-2">
          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            {/* Playback Rate */}
            <button
              onClick={cyclePlaybackRate}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 transition-colors"
              style={{ color: textColor }}
              title="Playback speed"
            >
              <span className="text-[13px] font-medium">{playbackRate}x</span>
            </button>

            {/* Rewind 15s */}
            <button
              onClick={skipBackward}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 transition-colors"
              style={{ color: textColor }}
              title="Rewind 15 seconds"
            >
              <Rewind15Icon />
            </button>

            {/* Previous (disabled for single track) */}
            <button
              className="flex items-center justify-center w-8 h-8 rounded-full opacity-50 cursor-not-allowed"
              style={{ color: textColor }}
              disabled
            >
              <PreviousIcon />
            </button>

            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="flex items-center justify-center w-12 h-12 rounded-full transition-transform hover:scale-105"
              style={{ backgroundColor: textColor, color: cardBg }}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>

            {/* Next (disabled for single track) */}
            <button
              className="flex items-center justify-center w-8 h-8 rounded-full opacity-50 cursor-not-allowed"
              style={{ color: textColor }}
              disabled
            >
              <NextIcon />
            </button>

            {/* Forward 15s */}
            <button
              onClick={skipForward}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 transition-colors"
              style={{ color: textColor }}
              title="Forward 15 seconds"
            >
              <Forward15Icon />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <span
              className="text-[12px] min-w-[40px] text-right"
              style={{ color: secondaryTextColor }}
            >
              {formatTime(currentTime)}
            </span>
            <div
              className="flex-1 h-[4px] rounded-full cursor-pointer relative overflow-hidden"
              style={{ backgroundColor: progressBg }}
              onClick={handleProgressClick}
            >
              <div
                className="absolute left-0 top-0 h-full rounded-full transition-all duration-100"
                style={{
                  width: `${progressPercentage}%`,
                  backgroundColor: progressFill,
                }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full opacity-0 hover:opacity-100 transition-opacity"
                style={{
                  left: `calc(${progressPercentage}% - 6px)`,
                  backgroundColor: progressFill,
                }}
              />
            </div>
            <span
              className="text-[12px] min-w-[40px]"
              style={{ color: secondaryTextColor }}
            >
              {formatTime(duration)}
            </span>
          </div>
        </div>

      </div>

      {/* Mobile Layout */}
      <div className="flex md:hidden flex-col gap-4">
        {/* Header: Logo and Language */}
        <div className="flex flex-col gap-1">
          <AudioDigestLogo size="small" />
          <span
            className="text-[14px] leading-[18px]"
            style={{ color: textColor }}
          >
            {languageFlag} {language}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6">
          {/* Rewind 15s */}
          <button
            onClick={skipBackward}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors"
            style={{ color: textColor }}
            title="Rewind 15 seconds"
          >
            <Rewind15Icon size={24} />
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="flex items-center justify-center w-14 h-14 rounded-full transition-transform hover:scale-105"
            style={{ backgroundColor: textColor, color: cardBg }}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <PauseIcon size={24} /> : <PlayIcon size={24} />}
          </button>

          {/* Forward 15s */}
          <button
            onClick={skipForward}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors"
            style={{ color: textColor }}
            title="Forward 15 seconds"
          >
            <Forward15Icon size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3">
          <span
            className="text-[12px] min-w-[36px]"
            style={{ color: secondaryTextColor }}
          >
            {formatTime(currentTime)}
          </span>
          <div
            className="flex-1 h-[4px] rounded-full cursor-pointer relative overflow-hidden"
            style={{ backgroundColor: progressBg }}
            onClick={handleProgressClick}
          >
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-all duration-100"
              style={{
                width: `${progressPercentage}%`,
                backgroundColor: progressFill,
              }}
            />
          </div>
          <span
            className="text-[12px] min-w-[36px] text-right"
            style={{ color: secondaryTextColor }}
          >
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}

// Icon Components
function AudioDigestLogo({ size = 'normal' }: { size?: 'small' | 'normal' }) {
  const height = size === 'small' ? 17 : 22;

  return (
    <img
      src="/audiodigestlogo-white.svg"
      alt="AudioDigest"
      style={{ height: `${height}px`, width: 'auto' }}
    />
  );
}

function PlayIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5.14v14l11-7-11-7z"/>
    </svg>
  );
}

function PauseIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
    </svg>
  );
}

function Rewind15Icon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 19V5l-7 7 7 7"/>
      <text x="13" y="15" fill="currentColor" stroke="none" fontSize="8" fontWeight="600">15</text>
    </svg>
  );
}

function Forward15Icon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 5v14l7-7-7-7"/>
      <text x="2" y="15" fill="currentColor" stroke="none" fontSize="8" fontWeight="600">15</text>
    </svg>
  );
}

function PreviousIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z"/>
    </svg>
  );
}

function NextIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 18l8.5-6L6 6v12zm8.5-6V6h2v12h-2V12z"/>
    </svg>
  );
}
