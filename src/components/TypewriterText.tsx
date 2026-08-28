import React, { useState, useEffect, memo } from 'react';
import { sounds } from '../lib/sounds';

export const TypewriterText = memo(({ text, delay = 12, onComplete }: { text: string; delay?: number; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let currentText = '';
    setDisplayedText(currentText);
    let index = 0;
    let timer: any = null;
    
    const run = () => {
      if (index < text.length) {
        currentText += text.charAt(index);
        setDisplayedText(currentText);
        index++;
        if (Math.random() > 0.45) {
          try {
            sounds.typing?.();
          } catch (_) {}
        }
        timer = setTimeout(run, delay);
      } else {
        onComplete?.();
      }
    };
    
    timer = setTimeout(run, delay);
    return () => clearTimeout(timer);
  }, [text, delay, onComplete]);

  return <span>{displayedText}</span>;
});
TypewriterText.displayName = "TypewriterText";

