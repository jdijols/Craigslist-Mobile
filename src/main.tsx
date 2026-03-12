import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { StatusBarColorProvider } from "@/contexts/StatusBarColorContext";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StatusBarColorProvider>
      <App />
    </StatusBarColorProvider>
  </StrictMode>,
);
