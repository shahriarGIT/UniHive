// hooks/useCountdown.ts
import { useEffect, useState } from "react";

export default function useCountdown(startIso, durationSec) {
  const [timeLeft, setTimeLeft] = useState(durationSec);

  useEffect(() => {
    if (!startIso || !durationSec) return;

    const start = new Date(startIso).getTime();
    const tick = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - start) / 1000);
      const left = durationSec - elapsed;
      setTimeLeft(left > 0 ? left : 0);
    };

    tick(); // run immediately
    const id = setInterval(tick, 1000);

    return () => clearInterval(id);
  }, [startIso, durationSec]);

  return timeLeft; // seconds remaining
}
