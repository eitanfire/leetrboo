import React, { useState, useRef, useEffect } from "react";
import "../Stopwatch.css";

const formatTime = (time: number): string => {
  const getSeconds = `0${time % 60}`.slice(-2);
  const getMinutes = Math.floor(time / 60);
  return `${getMinutes}:${getSeconds}`;
};

type TimerState = "idle" | "running" | "paused" | "completed";

const Stopwatch: React.FC = () => {
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [isEnabled, setIsEnabled] = useState(true);
  const [remainingTime, setRemainingTime] = useState(0);
  const [timeInput, setTimeInput] = useState(0);
  const [savedRemainingTime, setSavedRemainingTime] = useState(0);
  const [savedTimeInput, setSavedTimeInput] = useState(0);
  const [displayedProgress, setDisplayedProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const circumference = 282.743;
  const dashOffset = circumference - displayedProgress;

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (timeInput > 0) {
      setDisplayedProgress((remainingTime / timeInput) * circumference);
    }
  }, [remainingTime, timeInput, circumference]);

  const startTimer = () => {
    if (!timeInput || !isEnabled) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(timerRef.current!);
          setTimerState("completed");
          setDisplayedProgress(0);
          return 0;
        }
        return newTime;
      });
    }, 1000);
  };

  const startCountdown = () => {
    if (!isEnabled || timeInput <= 0) return;

    setRemainingTime(timeInput);
    setDisplayedProgress(circumference);
    setTimerState("running");
    startTimer();
  };

  const pauseTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTimerState("paused");
    setDisplayedProgress((remainingTime / timeInput) * circumference);
  };

  const resetTimer = () => {
    if (timeInput <= 0) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setRemainingTime(timeInput);
    setDisplayedProgress(circumference);
    setTimerState("idle");
  };

  const resumeTimer = () => {
    setTimerState("running");
    startTimer();
  };

  const toggleTimer = (event: React.ChangeEvent<HTMLInputElement>) => {
    const untimed = event.target.checked;
    setIsTransitioning(true);

    if (timerState === "running") {
      pauseTimer();
    }

    if (untimed) {
      setSavedRemainingTime(remainingTime);
      setSavedTimeInput(timeInput);
      setRemainingTime(0);
      setTimeInput(0);
      setDisplayedProgress(0);
      setTimerState("idle");
    } else {
      setRemainingTime(savedRemainingTime);
      setTimeInput(savedTimeInput);
      setDisplayedProgress(
        (savedRemainingTime / savedTimeInput) * circumference
      );
    }

    setIsEnabled(!untimed);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const getDisplayText = () => {
    if (!isEnabled) return "";
    if (timerState === "idle" && timeInput === 0) {
      return (
        <label className="choice-text">
          Choose a time on the slider or select untimed
        </label>
      );
    }
    return formatTime(remainingTime);
  };

  return (
    <>
      <time className="container">
        <div className={`countdown-container ${!isEnabled ? "ghosted" : ""}`}>
          {isEnabled && (
            <>
              <svg className="countdown-svg" viewBox="0 0 100 100">
                <defs>
                  <linearGradient
                    id="warm-gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#FF8C00" />
                    <stop offset="100%" stopColor="#FFFB7D" />
                  </linearGradient>
                </defs>
                <circle
                  className="countdown-circle"
                  cx="50"
                  cy="50"
                  r="45"
                  style={{ strokeDashoffset: dashOffset }}
                />
              </svg>
              <div
                className={`countdown-text ${
                  timerState === "running" ? "animate-gradient" : ""
                }`}
              >
                {timerState === "completed" ? (
                  <div className="times-up">{"Time's Up"}</div>
                ) : (
                  getDisplayText()
                )}
              </div>
            </>
          )}
        </div>
        <div className={`controls ${!isEnabled ? "ghosted" : ""}`}>
          <input
            type="range"
            min="1"
            max="600"
            value={timeInput}
            onChange={(e) => setTimeInput(Number(e.target.value))}
            disabled={!isEnabled || isTransitioning}
          />
          <div className="time-display">
            {Math.floor(timeInput / 60)} minutes and {timeInput % 60} seconds
          </div>
          <div className="buttons">
            {timerState === "idle" && timeInput > 0 && (
              <button
                className="primary"
                onClick={startCountdown}
                disabled={!isEnabled || isTransitioning}
              >
                Start
              </button>
            )}
            {timerState === "running" && (
              <button
                className="warning"
                onClick={pauseTimer}
                disabled={!isEnabled || isTransitioning}
              >
                Pause
              </button>
            )}
            {timerState === "paused" && (
              <>
                <button
                  className="success"
                  onClick={resumeTimer}
                  disabled={!isEnabled || isTransitioning}
                >
                  Resume
                </button>
                <button
                  className="danger"
                  onClick={resetTimer}
                  disabled={!isEnabled || isTransitioning}
                >
                  Reset
                </button>
              </>
            )}
          </div>
        </div>

        <label className="untimed-label">
          <input
            type="checkbox"
            checked={!isEnabled}
            onChange={toggleTimer}
            disabled={isTransitioning}
          />
          <span className="checkmark"></span>
          Untimed
        </label>
      </time>
    </>
  );
};

export default Stopwatch;
