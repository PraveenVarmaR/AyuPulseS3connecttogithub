import { useEffect, useRef, useState } from 'react';

/**
 * Generates a rolling simulated telemetry waveform.
 * Returns a fixed-length array of values that updates on an interval,
 * creating a live-scrolling effect.
 */
export function useSimulatedVitals(
  baseValue: number,
  variance: number,
  intervalMs = 1200,
  length = 40,
): number[] {
  const [data, setData] = useState<number[]>(() =>
    Array.from({ length }, () => baseValue + (Math.random() - 0.5) * variance),
  );
  const baseRef = useRef(baseValue);
  const varRef = useRef(variance);
  baseRef.current = baseValue;
  varRef.current = variance;

  useEffect(() => {
    const id = setInterval(() => {
      setData((prev) => {
        const next = [...prev.slice(1)];
        const v = baseRef.current + (Math.random() - 0.5) * varRef.current;
        next.push(Math.round(v * 10) / 10);
        return next;
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return data;
}

/**
 * Returns a simulated ECG-style waveform with periodic QRS spikes.
 */
export function useEcgWaveform(intervalMs = 50, length = 120): number[] {
  const [data, setData] = useState<number[]>(() => Array.from({ length }, () => 0));
  const tickRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      setData((prev) => {
        const next = [...prev.slice(1)];
        const tick = tickRef.current;
        let v = 0;
        const phase = tick % 30;
        if (phase === 0) v = 0.3;
        else if (phase === 1) v = 1.0;
        else if (phase === 2) v = -0.5;
        else if (phase === 3) v = 0.2;
        else if (phase === 14) v = -0.15;
        else if (phase === 15) v = 0.4;
        else if (phase === 16) v = 0.1;
        else v = (Math.random() - 0.5) * 0.04;
        next.push(v);
        tickRef.current = tick + 1;
        return next;
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return data;
}

/** Live ticking clock. */
export function useClock(): string {
  const [time, setTime] = useState(() => formatTime(new Date()));
  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function formatTime(d: Date): string {
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const s = d.getSeconds().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = (h % 12 || 12).toString().padStart(2, '0');
  return `${h12}:${m}:${s} ${ampm}`;
}
