import { useState, useEffect } from 'react';

export function useTypingEffect(phrases: string[], typingSpeed = 100, deletingSpeed = 50, pauseDelay = 2000) {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const currentPhrase = phrases[loopNum % phrases.length];
    
    if (isDeleting) {
      if (text === '') {
        setIsDeleting(false);
        setLoopNum((prev) => prev + 1);
        timer = setTimeout(() => {}, pauseDelay / 4);
      } else {
        timer = setTimeout(() => {
          setText((prev) => prev.slice(0, -1));
        }, deletingSpeed);
      }
    } else {
      if (text === currentPhrase) {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDelay);
      } else {
        timer = setTimeout(() => {
          setText((prev) => currentPhrase.slice(0, prev.length + 1));
        }, typingSpeed);
      }
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, phrases, typingSpeed, deletingSpeed, pauseDelay]);

  return text;
}
