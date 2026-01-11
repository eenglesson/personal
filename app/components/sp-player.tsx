'use client';

import { motion } from 'motion/react';
import { Music } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface NowPlayingData {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
  progressMs?: number;
  durationMs?: number;
}

const POLL_INTERVAL = 10000;

// Set to true to preview with mock data
const DEMO_MODE = true;

const MOCK_DATA: NowPlayingData = {
  isPlaying: false,
  title: 'Freestyle',
  artist: 'Westside Gunn',
  album: 'Peace Fly God',
  albumImageUrl:
    'https://i.scdn.co/image/ab67616d0000b8738863bc11d2aa12b54f5aeb36',
  songUrl: 'https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b',
  progressMs: 45000,
  durationMs: 200000,
};

export default function SpotifyPlayer() {
  const [data, setData] = useState<NowPlayingData | null>(
    DEMO_MODE ? MOCK_DATA : null
  );
  const [progress, setProgress] = useState(DEMO_MODE ? 22.5 : 0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchRef = useRef<number>(Date.now());

  const fetchNowPlaying = useCallback(async () => {
    if (DEMO_MODE) return;
    try {
      const res = await fetch('/api/spotify/now-playing');
      if (!res.ok) throw new Error('Failed to fetch');
      const newData: NowPlayingData = await res.json();
      setData(newData);
      lastFetchRef.current = Date.now();

      if (newData.isPlaying && newData.progressMs && newData.durationMs) {
        setProgress((newData.progressMs / newData.durationMs) * 100);
      }
    } catch {
      setData(null);
    }
  }, []);

  useEffect(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    if (data?.isPlaying && data.durationMs) {
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - lastFetchRef.current;
        const currentProgress = (data.progressMs || 0) + elapsed;
        const percent = Math.min(
          (currentProgress / data.durationMs!) * 100,
          100
        );
        setProgress(percent);
      }, 1000);
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [data]);

  useEffect(() => {
    if (DEMO_MODE) return;
    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchNowPlaying]);

  if (!data?.title) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className='flex flex-col items-center gap-3'
    >
      {/* Status text above */}
      <p className='text-[13px] text-gray-500'>
        {data.isPlaying ? 'Now playing...' : 'Last listened to...'}
      </p>

      {/* Card */}
      <motion.a
        href={data.songUrl}
        target='_blank'
        rel='noopener noreferrer'
        className='flex items-center gap-3 px-3 w-[338px] h-[72px] rounded-2xl bg-white dark:bg-gray-500/10 border border-transparent dark:border-zinc-700/50 shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:shadow-none transition-colors group'
        whileHover={{ scale: 1.02 }}
        transition={{
          scale: {
            type: 'spring',
            stiffness: 180,
            damping: 10,
          },
        }}
      >
        {/* Album Art */}
        <div className='relative shrink-0'>
          {data.albumImageUrl ? (
            <Image
              src={data.albumImageUrl}
              alt={data.album || 'Album Art'}
              width={52}
              height={52}
              className='w-[52px] h-[52px] rounded-lg shadow-[0_1px_6px_rgba(0,0,0,0.05)]'
            />
          ) : (
            <div className='w-[52px] h-[52px] rounded-lg bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center'>
              <Music className='w-6 h-6 text-zinc-400' />
            </div>
          )}
        </div>

        {/* Track Info */}
        <div className='flex-1 min-w-0'>
          <div className='flex flex-col -space-y-0.5'>
            <p className='text-[14px] font-medium truncate'>{data.title}</p>
            <p className='text-[13px] text-gray-500 truncate'>{data.artist}</p>
          </div>

          {/* Progress Bar - only show when playing */}
          {data.isPlaying && data.durationMs && (
            <div className='mt-1.5 h-1 bg-zinc-200 dark:bg-zinc-600 rounded-full overflow-hidden'>
              <motion.div
                className='h-full bg-green-500'
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'linear' }}
              />
            </div>
          )}
        </div>

        {/* Spotify Icon */}
        <SpotifyIcon className='w-5 h-5 text-gray-400/80 dark:text-gray-500/50 shrink-0' />
      </motion.a>
    </motion.div>
  );
}

function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='currentColor'>
      <path d='M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z' />
    </svg>
  );
}
