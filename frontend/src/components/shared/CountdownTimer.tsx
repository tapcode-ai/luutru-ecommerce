"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: string;
  className?: string;
}

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({
  targetDate,
  className = "",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const padNumber = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-1">
        <TimeUnit value={padNumber(timeLeft.hours)} />
        <span className="text-red-400 font-bold text-lg">:</span>
        <TimeUnit value={padNumber(timeLeft.minutes)} />
        <span className="text-red-400 font-bold text-lg">:</span>
        <TimeUnit value={padNumber(timeLeft.seconds)} />
      </div>
    </div>
  );
}

function TimeUnit({ value }: { value: string }) {
  return (
    <div className="flex gap-0.5">
      {value.split("").map((digit, index) => (
        <span
          key={index}
          className="w-7 h-8 md:w-8 md:h-9 rounded-lg bg-gradient-to-b from-red-600 to-red-800 text-white font-bold text-sm md:text-base flex items-center justify-center shadow-lg shadow-red-500/30"
        >
          {digit}
        </span>
      ))}
    </div>
  );
}
