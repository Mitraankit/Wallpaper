// src/components/Wallpaper.js
import React, { useEffect, useState } from 'react';
import unsplash from '../api/unsplash';

const HeartIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.8"
      d="M12 21s-6.7-4.35-9.3-8.32C.86 9.94 1.6 6.4 4.6 5.02c2.2-1.01 4.5-.2 5.9 1.6l1.5 1.9 1.5-1.9c1.4-1.8 3.7-2.61 5.9-1.6 3 1.38 3.74 4.92 1.9 7.66C18.7 16.65 12 21 12 21Z"
    />
  </svg>
);

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
    <path
      fill="currentColor"
      d="M18 16.08a2.9 2.9 0 0 0-1.94.75l-7.1-4.14a3 3 0 0 0 0-1.38l7.02-4.1a3 3 0 1 0-.87-1.71l-7.02 4.1a3 3 0 1 0 0 4.8l7.1 4.15a2.9 2.9 0 1 0 2.81-2.47Z"
    />
  </svg>
);

const extensionForMime = (mime) => {
  if (mime.includes('png')) return 'png';
  if (mime.includes('webp')) return 'webp';
  return 'jpg';
};

const Wallpaper = ({ wallpaper, isFavorite, onToggleFavorite }) => {
  const [viewLarge, setViewLarge] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const favorited = isFavorite(wallpaper.id);

  useEffect(() => {
    if (!viewLarge) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setViewLarge(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [viewLarge]);

  const openLightbox = () => setViewLarge(true);
  const closeLightbox = () => setViewLarge(false);
  const stop = (event) => event.stopPropagation();

  const onLike = (event) => {
    stop(event);
    onToggleFavorite(wallpaper);
  };

  const onShare = async (event) => {
    stop(event);
    const shareUrl = `${wallpaper.links.html}?utm_source=wallpaperx&utm_medium=referral`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: wallpaper.alt_description || 'Wallpaper',
          url: shareUrl,
        });
      } catch {
        // user dismissed the native share sheet
      }
      return;
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const onDownload = async (event) => {
    stop(event);
    if (downloading) return;
    setDownloading(true);

    // Required by Unsplash API guidelines: ping download_location whenever a photo is downloaded.
    unsplash.get(wallpaper.links.download_location).catch(() => {});

    try {
      const response = await fetch(wallpaper.urls.full, { mode: 'cors' });
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `wallpaperx-${wallpaper.id}.${extensionForMime(blob.type)}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(wallpaper.links.download, '_blank', 'noopener,noreferrer');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <div className="wallpaper-item">
        <div className="image-container" onClick={openLightbox}>
          <img
            src={wallpaper.urls.small}
            alt={wallpaper.alt_description || 'Wallpaper'}
            loading="lazy"
            className="wallpaper-image"
          />

          <div className="wallpaper-actions">
            <button
              type="button"
              className={`icon-btn like-btn ${favorited ? 'active' : ''}`}
              onClick={onLike}
              aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
              aria-pressed={favorited}
            >
              <HeartIcon filled={favorited} />
            </button>
            <button
              type="button"
              className="icon-btn share-btn"
              onClick={onShare}
              aria-label="Share wallpaper"
            >
              <ShareIcon />
            </button>
          </div>

          {copied && <span className="copied-toast">Link copied</span>}

          <div className="wallpaper-credit">
            <a
              href={`${wallpaper.user.links.html}?utm_source=wallpaperx&utm_medium=referral`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={stop}
            >
              {wallpaper.user.name}
            </a>
          </div>
        </div>
      </div>

      {viewLarge && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Close">
            &times;
          </button>
          <div className="lightbox-content" onClick={stop}>
            <img
              src={wallpaper.urls.regular}
              alt={wallpaper.alt_description || 'Wallpaper'}
              className="lightbox-image"
            />
            <div className="lightbox-actions">
              <button
                type="button"
                className={`icon-btn pill ${favorited ? 'active' : ''}`}
                onClick={onLike}
                aria-pressed={favorited}
              >
                <HeartIcon filled={favorited} />
                <span>{favorited ? 'Saved' : 'Save'}</span>
              </button>
              <button type="button" className="icon-btn pill" onClick={onShare}>
                <ShareIcon />
                <span>{copied ? 'Copied!' : 'Share'}</span>
              </button>
              <button
                type="button"
                className="lightbox-download"
                onClick={onDownload}
                disabled={downloading}
              >
                {downloading ? 'Downloading…' : 'Download'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Wallpaper;
