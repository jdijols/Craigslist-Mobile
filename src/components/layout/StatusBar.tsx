import { useState, useEffect } from "react";

function useCurrentTime() {
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}

function formatTime(date: Date) {
  const hours = date.getHours() % 12 || 12;
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

function CellSignalIcon() {
  return (
    <svg
      width="17"
      height="10.7"
      viewBox="0 0 17 10.7"
      fill="none"
      aria-hidden="true"
    >
      <rect x="0" y="7.7" width="2.8" height="3" rx="0.7" fill="currentColor" />
      <rect x="4.2" y="5.2" width="2.8" height="5.5" rx="0.7" fill="currentColor" />
      <rect x="8.4" y="2.7" width="2.8" height="8" rx="0.7" fill="currentColor" />
      <rect x="12.6" y="0" width="2.8" height="10.7" rx="0.7" fill="currentColor" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg
      width="15.5"
      height="11"
      viewBox="0 2.5 24 17"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1 9.00001L3 11C7.97 6.03001 16.03 6.03001 21 11L23 9.00001C16.93 2.93001 7.08 2.93001 1 9.00001ZM9 17L12 20L15 17C14.6064 16.6054 14.1388 16.2923 13.624 16.0786C13.1092 15.865 12.5574 15.755 12 15.755C11.4426 15.755 10.8908 15.865 10.376 16.0786C9.86117 16.2923 9.39359 16.6054 9 17ZM5 13L7 15C8.32646 13.6746 10.1249 12.9302 12 12.9302C13.8751 12.9302 15.6735 13.6746 17 15L19 13C15.14 9.14001 8.87 9.14001 5 13Z"
        fill="currentColor"
      />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg
      width="25"
      height="12"
      viewBox="0 0 25 12"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="0.5"
        y="0.5"
        width="21"
        height="11"
        rx="2.2"
        stroke="currentColor"
        strokeOpacity="0.35"
      />
      <rect x="1.5" y="1.5" width="19" height="9" rx="1.5" fill="currentColor" />
      <path
        d="M22.5 4v4a1.8 1.8 0 0 0 1.8-1.8v-0.4a1.8 1.8 0 0 0-1.8-1.8Z"
        fill="currentColor"
        fillOpacity="0.4"
      />
    </svg>
  );
}

export function StatusBar() {
  const time = useCurrentTime();

  return (
    <div className="status-bar">
      <div className="status-bar-left">
        <span className="status-bar-time">{time}</span>
      </div>
      <div className="status-bar-center" />
      <div className="status-bar-right">
        <CellSignalIcon />
        <WifiIcon />
        <BatteryIcon />
      </div>
    </div>
  );
}
