import React, { useState, useRef, useEffect } from "react";
import "../Stopwatch.css";
import { Text, Button, Center, Box } from "@mantine/core";

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

  const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setTimeInput(newTime);
    setRemainingTime(newTime);
    setDisplayedProgress(circumference);
  };

  const getDisplayText = () => {
    if (!isEnabled) return "";
    if (timerState === "idle" && timeInput === 0) {
      return "0:00";
    }
    return formatTime(timerState === "idle" ? timeInput : remainingTime);
  };

  return (
    <>
      <time className="container">
        <Box
          className={`countdown-container ms-auto ${
            !isEnabled ? "ghosted" : ""
          }`}
        >
          {isEnabled && (
            <Center>
              <svg className="countdown-svg" viewBox="0 0 100 100">
                <defs>
                  <linearGradient
                    id="warm-gradient"
                    x1="20%"
                    y1="0%"
                    x2="90%"
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
            </Center>
          )}
        <Text className={`controls ${!isEnabled ? "ghosted" : ""}`}>
          <input
            type="range"
            min="1"
            max="600"
            value={timeInput}
            onChange={handleTimeInputChange}
            disabled={!isEnabled || isTransitioning}
          />
          <div className="buttons">
            {timerState === "idle" && timeInput > 0 && (
              <Button
                className="secondary"
                onClick={startCountdown}
                disabled={!isEnabled || isTransitioning}
              >
                Start
              </Button>
            )}
            {timerState === "running" && (
              <Button
                className="warning"
                onClick={pauseTimer}
                disabled={!isEnabled || isTransitioning}
              >
                Pause
              </Button>
            )}
            {timerState === "paused" && (
              <>
                <Button
                  className="success"
                  onClick={resumeTimer}
                  disabled={!isEnabled || isTransitioning}
                >
                  Resume
                </Button>
                <Button
                  className="danger"
                  onClick={resetTimer}
                  disabled={!isEnabled || isTransitioning}
                >
                  Reset
                </Button>
              </>
            )}
          </div>
        </Text>

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
                </Box>

      </time>
    </>
  );
};

export default Stopwatch;
