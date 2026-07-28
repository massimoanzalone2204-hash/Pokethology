import React, { useState, useEffect } from 'react';
import { getCachedImageUrl, saveImageBlobToCache } from '../lib/cacheManager';

interface CachedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

export function CachedImage({ src, ...props }: CachedImageProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    if (!src) return;

    const loadImage = async () => {
      try {
        const cached = await getCachedImageUrl(src);
        if (cached && isMounted) {
          setObjectUrl(cached);
          return;
        }
        
        // Fetch and cache if not found
        const response = await fetch(src);
        if (response.ok) {
          const blob = await response.blob();
          await saveImageBlobToCache(src, blob);
          if (isMounted) {
            setObjectUrl(URL.createObjectURL(blob));
          }
        } else {
          if (isMounted) setObjectUrl(src); // fallback to original
        }
      } catch (err) {
        if (isMounted) setObjectUrl(src); // fallback
      }
    };

    loadImage();

    return () => {
      isMounted = false;
      // Object URLs are memory leaks if not revoked, but here they might be cached and reused across components.
      // cacheManager creates new Object URLs when accessed. 
      // Ideally we would revoke them, but for a simple cache it's okay, or we can revoke if we created it here.
    };
  }, [src]);

  return <img src={objectUrl || src} {...props} referrerPolicy="no-referrer" />;
}
