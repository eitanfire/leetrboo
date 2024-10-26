import React, { useState, useRef, useEffect } from "react";

const formatTime = (time: number): string => {
  const getSeconds = `0${time % 60}`.slice(-2);
  const getMinutes = Math.floor(time / 60); // Remove leading zero in minutes
  return `${getMinutes}:${getSeconds}`;
};

const CountdownTimer: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true); // Timer enabled/disabled state
  const [remainingTime, setRemainingTime] = useState(0); // Tracks countdown time in seconds
  const [timeInput, setTimeInput] = useState(0); // Tracks time selected from slider
  const [hasStarted, setHasStarted] = useState(false); // Track if the timer has started
  const [savedRemainingTime, setSavedRemainingTime] = useState(0); // Store remaining time when untimed is clicked
  const [savedTimeInput, setSavedTimeInput] = useState(0); // Store time input when untimed is clicked
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && remainingTime > 0) {
      timerRef.current = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);
    } else if (remainingTime === 0 && timerRef.current) {
      clearInterval(timerRef.current);
      setIsRunning(false); // Stops countdown at zero
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, remainingTime]);

  const startCountdown = () => {
    if (isEnabled && timeInput > 0) {
      setRemainingTime(timeInput); // Set remaining time based on slider value (in seconds)
      setIsRunning(true); // Start the countdown
      setHasStarted(true); // Mark that the timer has started
    }
  };

  const handlePause = () => {
    setIsRunning(false); // Pause the countdown
  };

  const handleReset = () => {
    if (timeInput > 0) {
      setRemainingTime(timeInput); // Reset to the selected time
      setIsRunning(false); // Stop the countdown
      setHasStarted(true); // Mark that the timer has started
    }
  };

  const toggleTimer = (event: React.ChangeEvent<HTMLInputElement>) => {
    const untimed = event.target.checked; // Get checked state
    if (untimed) {
      // Save current state before going untimed
      setSavedRemainingTime(remainingTime);
      setSavedTimeInput(timeInput);
      handleReset(); // Reset if disabling the timer
    } else {
      // Restore the saved state when going back to timed
      setRemainingTime(savedRemainingTime);
      setTimeInput(savedTimeInput);
      setIsEnabled(true); // Re-enable the timer
    }
    setIsEnabled(!untimed); // Enable timer if checkbox is unchecked
  };

  return (
    <div>
      {/* Display "Time's Up" only if the timer is enabled and countdown is complete */}
      {isEnabled && hasStarted && remainingTime === 0 ? (
        <h1>Time's Up</h1>
      ) : (
        isEnabled && <h1>{formatTime(remainingTime)}</h1> // Show time only when timer is enabled
      )}

      {isEnabled && ( // Only show controls if the timer is enabled
        <>
          <div>
            <input
              type="range"
              min="1"
              max="600" // 10 minutes in seconds
              value={timeInput}
              onChange={(e) => setTimeInput(Number(e.target.value))}
            />
            <span>
              {Math.floor(timeInput / 60)} minutes and {timeInput % 60} seconds
            </span>
          </div>

          {!isRunning &&
            remainingTime === 0 &&
            timeInput > 0 && ( // Show Start button only if timer is not running and time is set
              <button
                onClick={startCountdown}
                disabled={isRunning || timeInput === 0}
              >
                Start
              </button>
            )}
          {isRunning && ( // Show Pause button only while timer is running
            <button onClick={handlePause}>Pause</button>
          )}
          {!isRunning &&
            remainingTime > 0 && ( // Show Resume button if timer is paused with time remaining
              <>
                <button onClick={() => setIsRunning(true)}>Resume</button>
                <button onClick={handleReset} disabled={remainingTime === 0}>
                  Reset
                </button>
              </>
            )}
        </>
      )}

      <label>
        <input type="checkbox" checked={!isEnabled} onChange={toggleTimer} />
        Untimed
      </label>
    </div>
  );
};

export default CountdownTimer;
