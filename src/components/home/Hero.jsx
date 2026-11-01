import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { useReducedMotion } from '../ui/Motion.jsx';
import heroPhoto from '../../assets/photos/brazzaville-river.webp';

export default function Hero({ onNavigate }) {
  const reduced = useReducedMotion();
  const sectionRef = useRef(null);
  const photoRef = useRef(null);
  const videoRef = useRef(null);

  function startVideo() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', 'true');
    const attempt = video.play();
    if (attempt?.catch) attempt.catch(() => {});
  }

  useEffect(() => {
    if (reduced) return undefined;
    startVideo();
    const resume = () => startVideo();
    const video = videoRef.current;
    const onVisibility = () => {
      if (document.visibilityState === 'visible') startVideo();
    };
    document.addEventListener('pointerdown', resume, { passive: true });
    document.addEventListener('touchstart', resume, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    video?.addEventListener('loadeddata', resume);
    return () => {
      document.removeEventListener('pointerdown', resume);
      document.removeEventListener('touchstart', resume);
      document.removeEventListener('visibilitychange', onVisibility);
      video?.removeEventListener('loadeddata', resume);
    };
  }, [reduced]);

  useEffect(() => {
    if (reduced || !window.matchMedia('(min-width: 640px)').matches) return undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (photoRef.current) {
        photoRef.current.style.setProperty('--parallax-y', `${Math.min(window.scrollY * 0.06, 34).toFixed(1)}px`);
      }
    };
    const onScroll = () => {
      if (window.scrollY < window.innerHeight * 1.2 && !frame) {
        frame = requestAnimationFrame(update);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

  useEffect(() => {
    if (reduced) return undefined;
    const node = sectionRef.current;
    const video = videoRef.current;
    if (!node || !video || !('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) startVideo();
        else video.pause();
      },
      { threshold: 0.01 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <section ref={sectionRef} className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-forest text-cream sm:min-h-0">
      {!reduced && (
        <div aria-hidden="true" className="absolute inset-0">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={heroPhoto}
            aria-hidden="true"
            tabIndex="-1"
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload noplaybackrate nofullscreen"
            onCanPlay={startVideo}
            className="hero-video pointer-events-none h-full w-full object-cover opacity-55 sm:opacity-40"
          >
            <source src="/media/fleuve-fond.mp4" type="video/mp4" />
            <source src="/media/fleuve-fond.webm" type="video/webm" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-forest/80 via-forest/45 to-forest-deep/95 sm:from-forest/70 sm:via-forest/60 sm:to-forest-deep/85" />
        </div>
      )}
      {reduced && (
        <img
          src={heroPhoto}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-55 sm:hidden"
        />
      )}
      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-8 pt-32 sm:block sm:px-6 sm:pb-14 sm:pt-44 lg:pb-16 lg:pt-40">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-stretch lg:gap-16">
          <div className="min-w-0">
            <p
              className="hero-fade mb-4 flex items-center gap-2 text-[0.7rem] font-semibold text-cream/65 sm:hidden"
              style={{ '--fade-delay': '0ms' }}
            >
              <span>Brazzaville</span>
              <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 text-ochre-light" />
              <span>Pointe-Noire</span>
            </p>
            <h1 className="max-w-2xl text-balance font-serif text-[clamp(2.5rem,11.5vw,3rem)] font-normal leading-[0.9] tracking-[-0.035em] text-cream sm:text-[clamp(3rem,6.4vw,5.6rem)]">
              <span className="hero-line">
                <span style={{ '--line-delay': '70ms' }}>Le bus part.</span>
              </span>
              <span className="hero-line">
                <span style={{ '--line-delay': '170ms' }}>Le Congo devant.</span>
              </span>
            </h1>

            <p
              className="hero-fade mt-5 max-w-[34ch] text-pretty text-[0.95rem] leading-relaxed text-cream/70 sm:mt-6 sm:max-w-md sm:text-[1.05rem]"
              style={{ '--fade-delay': '330ms' }}
            >
              Un trajet à réserver, un colis à confier, un horaire à vérifier. Nos agences vous
              répondent, de Brazzaville à Pointe-Noire.
            </p>

            <div
              className="hero-fade mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-6"
              style={{ '--fade-delay': '420ms' }}
            >
              <button
                type="button"
                onClick={() => onNavigate('voyages')}
                className="btn-light w-full sm:w-auto"
              >
                Trouver un trajet
              </button>
              <a
                href="#reseau"
                className="self-start border-b border-cream/30 pb-1 text-[0.8rem] font-semibold text-cream transition-colors duration-150 hover:border-ochre hover:text-ochre-light sm:self-auto"
              >
                Voir les lignes
              </a>
            </div>
          </div>

          <figure className="hidden min-w-0 flex-col sm:flex">
            <div
              ref={photoRef}
              className="photo-frame hero-image hero-parallax aspect-[16/10] border-cream/15 bg-forest-deep sm:aspect-[16/9] lg:aspect-auto lg:min-h-[30rem] lg:flex-1"
            >
              <img
                src={heroPhoto}
                alt="Vue de Brazzaville et du fleuve Congo"
                width="1920"
                height="1080"
                fetchPriority="high"
                decoding="async"
              />
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="hero-route pointer-events-none absolute inset-0 h-full w-full"
              >
                <path
                  d="M7 86 C 28 77, 48 69, 62 48 S 84 27, 93 14"
                  fill="none"
                  stroke="#fcfaf5"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  pathLength="1"
                  className="route-draw"
                  opacity="0.8"
                />
                <path
                  d="M7 86 C 28 77, 48 69, 62 48 S 84 27, 93 14"
                  fill="none"
                  stroke="#dfb05a"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  className="route-draw"
                  opacity="0.9"
                />
                <circle cx="7" cy="86" r="1.5" fill="#fcfaf5" vectorEffect="non-scaling-stroke" />
                <circle cx="62" cy="48" r="1.5" fill="#dfb05a" vectorEffect="non-scaling-stroke" />
                <circle cx="93" cy="14" r="1.5" fill="#fcfaf5" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
            <figcaption
              className="hero-fade mt-2.5 flex flex-wrap items-start justify-between gap-x-4 gap-y-1 text-[0.7rem] font-medium text-cream/65"
              style={{ '--fade-delay': '650ms' }}
            >
              <span className="min-w-0">Brazzaville, sur la rive du fleuve</span>
              <span className="text-end">Photo : Africany / CC0</span>
            </figcaption>
          </figure>
        </div>

        <dl
          aria-label="Le réseau en chiffres"
          className="hero-fade mt-auto grid max-w-xl grid-cols-3 border-t border-cream/20 pt-5 sm:mt-12"
          style={{ '--fade-delay': '560ms' }}
        >
          {[
            ['9', 'villes'],
            ['8', 'lignes'],
            ['8', 'agences'],
          ].map(([value, label]) => (
            <div key={label} className="border-e border-cream/15 ps-4 first:ps-0 last:border-e-0">
              <dd className="font-serif text-[1.8rem] leading-none text-cream sm:text-[2rem]">{value}</dd>
              <dt className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-cream/55 sm:text-[0.64rem]">{label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
