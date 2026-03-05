import { useEffect, useRef, useState } from "react";

const timers: { [name: string]: number } = {};

function getSecondsLeft(id?: string) {
  const endTime = timers[id || ""];
  if (!endTime) return 0;
  if (endTime < Date.now()) return 0;
  return ((endTime - Date.now()) / 1000).toFixed(0);
}

const useTimer = (initialId?: string) => {
  const [id, setId] = useState(initialId);
  const [seconds, setSeconds] = useState(getSecondsLeft(id));
  const interval = useRef<NodeJS.Timeout>(undefined);

  const start = (sec: number, currentId = id) => {
    if (!currentId) return;
    timers[currentId] = Date.now() + sec * 1000;

    setSeconds(getSecondsLeft(id));
  };

  useEffect(() => {
    interval.current = setInterval(() => {
      const timeLeft = getSecondsLeft(id);
      setSeconds(timeLeft);
      if (timeLeft === 0) interval.current && clearInterval(interval.current);
    }, 1000);

    return () => {
      interval.current && clearInterval(interval.current);
    };
  }, [seconds, id]);

  const reset = () => {
    if (id) {
      timers[id] = 0;
      setSeconds(0);
    }
  };

  return { seconds, setId, start, reset };
};

export default useTimer;
