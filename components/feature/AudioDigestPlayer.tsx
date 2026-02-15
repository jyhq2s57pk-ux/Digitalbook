'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface AudioDigestPlayerProps {
  /** Map of language code → audio file path, e.g. { en: "/audio/jan-2026/digest-en.mp3" } */
  audioSources: Record<string, string>;
  variant?: 'light' | 'dark';
}

const LANGUAGE_LABELS: Record<string, { name: string; region?: string }> = {
  en: { name: 'English' },
  'en-us': { name: 'English', region: '(US)' },
  'en-gb': { name: 'English', region: '(UK)' },
  fr: { name: 'Français' },
  de: { name: 'Deutsch' },
  it: { name: 'Italiano' },
  es: { name: 'Español', region: '(Spain)' },
  'es-latam': { name: 'Español', region: '(Latin America)' },
  pt: { name: 'Português', region: '(Portugal)' },
  'pt-br': { name: 'Português', region: '(Brazil)' },
  nl: { name: 'Nederlands' },
  pl: { name: 'Polski' },
  tr: { name: 'Türkçe' },
  ar: { name: 'العربية' },
  zh: { name: '中文' },
  ja: { name: '日本語' },
};

// Icon paths from public folder
const ICONS = {
  rewind10: '/icons/Rewind--10.svg',
  forward10: '/icons/Forward--10.svg',
  play: '/icons/Play--filled.svg',
  pause: '/icons/Pause--outline--filled.svg',
};

// AudioDigest Logo - exact Figma SVG
function AudioDigestLogo() {
  return (
    <div className="flex items-center gap-[4px]">
      {/* Globe mark icon */}
      <svg width="26" height="14" viewBox="0 0 25.847 13.7851" fill="none">
        <path d="M11.4221 6.8876C11.4221 4.67218 11.4221 2.45676 11.4221 0.24134C11.4221 0.00490861 11.3895 0 11.6583 0C12.5095 0.000818102 13.36 0 14.2113 0C14.2548 0 14.2983 0 14.3418 0.0016362C14.3938 0.00327241 14.4218 0.0335422 14.4241 0.0867188C14.4265 0.139077 14.4265 0.191436 14.4265 0.243794C14.4265 4.67464 14.4265 9.10548 14.4265 13.5371C14.4265 13.5437 14.4265 13.5502 14.4265 13.5568C14.4265 13.7842 14.4265 13.785 14.2152 13.785C13.4696 13.785 12.7239 13.785 11.979 13.785C11.8299 13.785 11.6808 13.7826 11.5317 13.785C11.4524 13.7867 11.4167 13.7548 11.4214 13.6705C11.4245 13.6181 11.4214 13.5658 11.4214 13.5134C11.4214 11.3045 11.4214 9.09566 11.4214 6.88678L11.4221 6.8876Z" fill="white"/>
        <path d="M15.0271 0.0302675C15.0992 -0.00980297 15.1525 0.00409905 15.2025 0.00409905C16.1259 0.00328128 17.0502 0.00655234 17.9737 1.02183e-05C18.1089 -0.000807547 18.1875 0.0474406 18.2646 0.151297C18.8529 0.944529 19.3101 1.80645 19.6625 2.72644C20.014 3.64561 20.2451 4.59422 20.3598 5.56981C20.4556 6.38839 20.463 7.20779 20.3786 8.03047C20.2237 9.53515 19.8059 10.9581 19.1069 12.3C18.8562 12.7817 18.5669 13.2404 18.2367 13.6722C18.1867 13.7377 18.1417 13.7851 18.0474 13.7851C17.0519 13.7818 16.0563 13.7834 15.064 13.7834C15.037 13.7401 15.064 13.7172 15.0861 13.6951C15.808 12.9722 16.2792 12.0972 16.6299 11.1519C16.9781 10.2123 17.2026 9.24239 17.3124 8.24472C17.3829 7.60032 17.4083 6.95429 17.3739 6.30907C17.2887 4.70952 16.9437 3.1713 16.2325 1.72631C15.9391 1.13016 15.5737 0.583895 15.0984 0.11368C15.0755 0.0915999 15.0566 0.0654314 15.0271 0.0302675Z" fill="white"/>
        <path d="M10.8045 13.7622C10.7363 13.7932 10.6772 13.7802 10.6198 13.781C9.71346 13.7818 8.80797 13.7777 7.90165 13.7851C7.75307 13.7859 7.66276 13.7409 7.57574 13.6223C6.71212 12.4546 6.13336 11.1561 5.77379 9.75618C5.48482 8.62855 5.36415 7.48211 5.42572 6.32177C5.50453 4.84088 5.84686 3.41969 6.46338 2.06719C6.77615 1.38112 7.14968 0.730221 7.60776 0.129199C7.66687 0.0523339 7.72187 0 7.83023 0C8.80879 0.00408858 9.78652 0.00245315 10.7651 0.00245315C10.7831 0.00245315 10.8053 -0.00408859 10.8201 0.0384327C10.7437 0.121022 10.66 0.209335 10.5787 0.299284C10.032 0.904395 9.64039 1.60436 9.33747 2.35339C8.94342 3.32647 8.69304 4.33717 8.56086 5.37812C8.50094 5.85158 8.46317 6.32831 8.46482 6.80259C8.47385 8.70051 8.83013 10.5248 9.71017 12.2273C9.97862 12.7474 10.3136 13.2217 10.724 13.6412C10.7544 13.6722 10.7979 13.6968 10.8045 13.7605V13.7622Z" fill="white"/>
        <path d="M18.2617 0.00328072C19.4623 0.00328072 20.6638 0.00655139 21.8644 1.00488e-05C22.0502 -0.000807619 22.1943 0.0482524 22.3375 0.155367C23.2898 0.866738 24.0633 1.72038 24.671 2.70976C25.2361 3.63045 25.6077 4.6182 25.7561 5.66972C26.0982 8.08674 25.4757 10.2642 23.8723 12.1865C23.4122 12.7385 22.887 13.2307 22.2976 13.6624C22.183 13.7466 22.0675 13.7859 21.9182 13.7851C20.6759 13.7793 19.4337 13.7818 18.1905 13.7818H18.0655C18.0681 13.7115 18.1289 13.7156 18.168 13.6984C19.0404 13.3255 19.8391 12.8464 20.5301 12.2184C21.6691 11.1832 22.3957 9.92649 22.769 8.48413C22.9209 7.89868 23.0086 7.30587 22.9825 6.7008C22.9435 5.79809 22.7212 4.93218 22.3523 4.10143C21.5397 2.27067 20.1577 0.956681 18.247 0.127566C18.1819 0.0989478 18.1063 0.0834121 18.0325 0.00328072H18.2617Z" fill="white"/>
        <path d="M7.19974 0.00327087C6.86216 0.199523 6.52298 0.367973 6.20064 0.568314C4.59855 1.56511 3.54011 2.99039 2.97801 4.80736C2.77835 5.45172 2.65567 6.11244 2.64124 6.78706C2.626 7.48293 2.74467 8.16409 2.93471 8.83217C3.31238 10.1585 3.97391 11.3123 4.96098 12.2649C5.57199 12.8537 6.2696 13.3124 7.03295 13.669C7.08908 13.6951 7.15403 13.709 7.21337 13.7826H7.03776C5.90235 13.7826 4.76774 13.781 3.63232 13.7851C3.49601 13.7851 3.38776 13.7499 3.28111 13.6632C1.64855 12.3336 0.586102 10.645 0.159519 8.55087C0.00636652 7.79775 -0.0297166 7.03482 0.0224035 6.27108C0.11622 4.90631 0.520351 3.63721 1.22678 2.47114C1.77444 1.56756 2.45521 0.785009 3.2779 0.130835C3.38856 0.0425213 3.50082 0 3.64595 0C4.78137 0.00572402 5.91598 0.00327087 7.0514 0.00327087C7.10111 0.00327087 7.15002 0.00327087 7.19974 0.00327087Z" fill="white"/>
      </svg>
      {/* AudioDigest text */}
      <svg width="94" height="18" viewBox="0 0 94.1671 17.4163" fill="none">
        <path d="M0 13.7408L5.22113 0.150791H7.82227L13.0434 13.7408H10.3292L9.19824 10.6873H3.78862L2.65769 13.7408H0ZM4.58027 8.51968H8.38774L6.48401 3.3551L4.58027 8.51968Z" fill="white"/>
        <path d="M21.6698 3.95826V13.7408H19.2949V12.2329C18.654 13.2319 17.5419 13.8916 16.166 13.8916C14.0549 13.8916 12.6224 12.4968 12.6224 10.3669V3.95826H14.9785V9.82025C14.9785 10.97 15.7136 11.7805 16.8634 11.7805C18.409 11.7805 19.2949 10.4611 19.2949 8.2558V3.95826H21.6698Z" fill="white"/>
        <path d="M26.796 13.8916C23.8744 13.8916 22.1215 11.8182 22.1215 8.84011C22.1215 5.86199 23.8933 3.80747 26.7583 3.80747C27.9646 3.80747 29.0202 4.31639 29.5856 5.07034V0H31.9606V13.7408H29.5856V12.591C29.1333 13.3261 28.0589 13.8916 26.796 13.8916ZM27.1353 11.8371C28.6997 11.8371 29.7364 10.6496 29.7364 8.84011C29.7364 7.04947 28.6997 5.86199 27.1353 5.86199C25.5708 5.86199 24.5341 7.04947 24.5341 8.84011C24.5341 10.6308 25.5708 11.8371 27.1353 11.8371Z" fill="white"/>
        <path d="M32.9114 13.7408V3.95826H35.2864V13.7408H32.9114ZM32.8172 0H35.3995V2.48805H32.8172V0Z" fill="white"/>
        <path d="M40.6838 13.8916C37.7811 13.8916 35.6888 11.7617 35.6888 8.84011C35.6888 5.93739 37.7811 3.80747 40.6838 3.80747C43.5676 3.80747 45.6787 5.93739 45.6787 8.84011C45.6787 11.7617 43.5676 13.8916 40.6838 13.8916ZM40.6838 11.8371C42.2105 11.8371 43.2661 10.6119 43.2661 8.84011C43.2661 7.06832 42.1917 5.86199 40.6838 5.86199C39.1193 5.86199 38.1203 7.08717 38.1203 8.84011C38.1203 10.6119 39.1193 11.8371 40.6838 11.8371Z" fill="white"/>
        <path d="M46.1343 13.7408V0.150791H50.5261C54.277 0.150791 57.4813 2.3938 57.4813 6.93638C57.4813 11.4978 54.277 13.7408 50.5261 13.7408H46.1343ZM50.3188 11.5166C52.656 11.5166 54.9179 10.2915 54.9179 6.93638C54.9179 3.60013 52.656 2.37496 50.3188 2.37496H48.6601V11.5166H50.3188Z" fill="white"/>
        <path d="M57.9023 13.7408V3.95826H60.2773V13.7408H57.9023ZM57.8081 0H60.3904V2.48805H57.8081V0Z" fill="white"/>
        <path d="M65.6559 17.4163C62.9982 17.4163 61.2075 16.21 60.9059 13.9293H63.2997C63.4317 14.9094 64.2987 15.5126 65.6559 15.5126C67.1261 15.5126 68.0308 14.7021 68.0308 13.345V12.1198C67.5596 12.7795 66.5229 13.2507 65.2977 13.2507C62.4704 13.2507 60.7174 11.347 60.7174 8.53853C60.7174 5.7112 62.4704 3.80747 65.2412 3.80747C66.4287 3.80747 67.4653 4.29754 68.0308 5.03264V3.95826H70.4058V13.1C70.4058 15.7765 68.5586 17.4163 65.6559 17.4163ZM65.6559 11.2151C67.1826 11.2151 68.1627 10.1595 68.1627 8.53853C68.1627 6.93638 67.1826 5.86199 65.6559 5.86199C64.1291 5.86199 63.1301 6.91753 63.1301 8.53853C63.1301 10.1595 64.1291 11.2151 65.6559 11.2151Z" fill="white"/>
        <path d="M70.796 8.84011C70.796 6.29552 72.3605 3.80747 75.5648 3.80747C78.7691 3.80747 80.3147 6.22012 80.3147 8.57623C80.3147 8.97205 80.277 9.44328 80.277 9.44328H73.1332C73.3406 11.0077 74.3207 11.8936 75.7532 11.8936C76.8465 11.8936 77.6758 11.4036 77.902 10.5365H80.2581C79.9377 12.6664 78.1094 13.8916 75.6967 13.8916C72.4735 13.8916 70.796 11.4036 70.796 8.84011ZM73.2086 7.65263H77.7512C77.657 6.48401 76.903 5.61696 75.5648 5.61696C74.3396 5.61696 73.5102 6.35206 73.2086 7.65263Z" fill="white"/>
        <path d="M84.4147 13.8916C81.889 13.8916 80.1926 12.4402 80.0983 10.348H82.4168C82.4733 11.0831 83.2461 11.8748 84.4147 11.8748C85.3572 11.8748 86.0169 11.4601 86.0169 10.8569C86.0169 10.348 85.6211 10.0464 84.9613 9.9145L83.4346 9.59407C81.9267 9.27364 80.5507 8.53853 80.5507 6.61595C80.5507 5.08919 81.9455 3.80747 84.2074 3.80747C86.3373 3.80747 87.996 4.9761 88.241 6.91753H85.9226C85.8095 6.12588 84.999 5.7112 84.2074 5.7112C83.4534 5.7112 82.9068 6.05048 82.9068 6.61595C82.9068 7.08717 83.3215 7.3699 83.9624 7.50184L85.4891 7.82227C87.1478 8.16155 88.4295 8.80241 88.4295 10.8004C88.4295 12.4968 86.8274 13.8916 84.4147 13.8916Z" fill="white"/>
        <path d="M94.1671 3.95826V5.93739H91.8864V10.4046C91.8864 11.3282 92.4518 11.8371 93.2435 11.8371C93.6016 11.8371 93.9786 11.7617 94.1671 11.7051V13.7597C93.9409 13.8162 93.4885 13.8916 92.9608 13.8916C90.9439 13.8916 89.5114 12.8361 89.5114 10.6496V5.93739H87.8527V3.95826H89.5114V1.07438H91.8864V3.95826H94.1671Z" fill="white"/>
      </svg>
    </div>
  );
}

interface AudioCardProps {
  langCode: string;
  audioSrc: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSkip: (seconds: number) => void;
}

function AudioCard({ langCode, isPlaying, onTogglePlay, onSkip }: AudioCardProps) {
  const langInfo = LANGUAGE_LABELS[langCode] || { name: langCode.toUpperCase() };

  return (
    <div className="bg-[#252525] flex h-[138px] items-center justify-between pl-4 pr-5 py-4 rounded-[22px]">
      {/* Left: Logo and language */}
      <div className="flex flex-col h-full justify-between p-4 rounded-[20px] bg-[#2f2f2f]">
        <AudioDigestLogo />
        <p className="text-[13px] leading-[18px] text-white">
          {langInfo.name}
          {langInfo.region && (
            <>
              <br />
              {langInfo.region}
            </>
          )}
        </p>
      </div>

      {/* Right: Playback controls */}
      <div className="flex gap-[25px] items-center justify-center">
        <button
          onClick={() => onSkip(-10)}
          className="opacity-50 hover:opacity-70 transition-opacity"
          aria-label="Rewind 10 seconds"
        >
          <img src={ICONS.rewind10} alt="Rewind 10 seconds" width={32} height={32} />
        </button>

        <button
          onClick={onTogglePlay}
          className="hover:opacity-90 transition-opacity"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          <img
            src={isPlaying ? ICONS.pause : ICONS.play}
            alt={isPlaying ? 'Pause' : 'Play'}
            width={48}
            height={48}
          />
        </button>

        <button
          onClick={() => onSkip(10)}
          className="opacity-50 hover:opacity-70 transition-opacity"
          aria-label="Forward 10 seconds"
        >
          <img src={ICONS.forward10} alt="Forward 10 seconds" width={32} height={32} />
        </button>
      </div>
    </div>
  );
}

export default function AudioDigestPlayer({
  audioSources,
}: AudioDigestPlayerProps) {
  const languages = Object.keys(audioSources);
  const [playingLang, setPlayingLang] = useState<string | null>(null);
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});

  // Create audio elements for each language
  useEffect(() => {
    languages.forEach((lang) => {
      if (!audioRefs.current[lang]) {
        const audio = new Audio(audioSources[lang]);
        audio.preload = 'metadata';
        audio.addEventListener('ended', () => {
          setPlayingLang(null);
        });
        audioRefs.current[lang] = audio;
      }
    });

    return () => {
      // Cleanup audio elements
      Object.values(audioRefs.current).forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
    };
  }, [languages, audioSources]);

  const togglePlay = useCallback((lang: string) => {
    const audio = audioRefs.current[lang];
    if (!audio) return;

    // Pause any currently playing audio
    if (playingLang && playingLang !== lang) {
      const currentAudio = audioRefs.current[playingLang];
      if (currentAudio) {
        currentAudio.pause();
      }
    }

    if (playingLang === lang) {
      audio.pause();
      setPlayingLang(null);
    } else {
      audio.play();
      setPlayingLang(lang);
    }
  }, [playingLang]);

  const skip = useCallback((lang: string, seconds: number) => {
    const audio = audioRefs.current[lang];
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + seconds));
  }, []);

  if (languages.length === 0) return null;

  return (
    <div className="w-full max-w-[950px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {languages.map((lang) => (
          <AudioCard
            key={lang}
            langCode={lang}
            audioSrc={audioSources[lang]}
            isPlaying={playingLang === lang}
            onTogglePlay={() => togglePlay(lang)}
            onSkip={(seconds) => skip(lang, seconds)}
          />
        ))}
      </div>
    </div>
  );
}
