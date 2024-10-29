import React, { useState, useRef, useEffect } from "react";
import "../Stopwatch.css";

const formatTime = (time: number): string => {
  const getSeconds = `0${time % 60}`.slice(-2);
  const getMinutes = Math.floor(time / 60);
  return `${getMinutes}:${getSeconds}`;
};

const Stopwatch: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [remainingTime, setRemainingTime] = useState(0);
  const [timeInput, setTimeInput] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [savedRemainingTime, setSavedRemainingTime] = useState(0);
  const [savedTimeInput, setSavedTimeInput] = useState(0);
  const [displayedProgress, setDisplayedProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const circumference = 282.743;
  const progress =
    timeInput > 0 ? (remainingTime / timeInput) * circumference : 0;
  const dashOffset = circumference - displayedProgress;

  useEffect(() => {
    if (isRunning && remainingTime > 0) {
      timerRef.current = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
        setDisplayedProgress(((remainingTime - 1) / timeInput) * circumference);
      }, 1000);
    } else if (remainingTime === 0 && timerRef.current) {
      clearInterval(timerRef.current);
      setIsRunning(false);
      setDisplayedProgress(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, remainingTime, timeInput]);

  const startCountdown = () => {
    if (isEnabled && timeInput > 0) {
      setRemainingTime(timeInput);
      setDisplayedProgress(circumference);
      setIsRunning(true);
      setHasStarted(true);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
    setDisplayedProgress((remainingTime / timeInput) * circumference);
  };

  const handleReset = () => {
    if (timeInput > 0) {
      setRemainingTime(timeInput);
      setDisplayedProgress(circumference);
      setIsRunning(false);
      setHasStarted(true);
    }
  };

  const toggleTimer = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const untimed = event.target.checked;
    setIsTransitioning(true);

    if (isRunning) {
      handlePause();
    }

    if (untimed) {
      setSavedRemainingTime(remainingTime);
      setSavedTimeInput(timeInput);
      setRemainingTime(0);
      setTimeInput(0);
      setDisplayedProgress(0);
      setHasStarted(false);
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
    if (!hasStarted && timeInput === 0)
      return (
        <span className="choice-text">
          Choose a time on the slider or select untimed
        </span>
      );
    return formatTime(remainingTime);
  };

  return (
    <>
      <div className="container">
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
                  isRunning ? "animate-gradient" : ""
                }`}
              >
                {hasStarted && remainingTime === 0 ? (
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
            {!isRunning && remainingTime === 0 && timeInput > 0 && (
              <button
                className="primary"
                onClick={startCountdown}
                disabled={!isEnabled || isTransitioning}
              >
                Start
              </button>
            )}
            {isRunning && (
              <button
                className="warning"
                onClick={handlePause}
                disabled={!isEnabled || isTransitioning}
              >
                Pause
              </button>
            )}
            {!isRunning && remainingTime > 0 && (
              <>
                <button
                  className="success"
                  onClick={() => {
                    setIsRunning(true);
                    setDisplayedProgress(
                      (remainingTime / timeInput) * circumference
                    );
                  }}
                  disabled={!isEnabled || isTransitioning}
                >
                  Resume
                </button>
                <button
                  className="danger"
                  onClick={handleReset}
                  disabled={
                    remainingTime === 0 || !isEnabled || isTransitioning
                  }
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
      </div>
    </>
  );
};

export default Stopwatch;
