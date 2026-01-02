import { createRoot } from "react-dom/client";
import { CapacitorUpdater } from '@capgo/capacitor-updater';
import App from "./app/App.tsx";
import "./styles/index.css";

// Initialize Capgo updater - notifies that app is ready
CapacitorUpdater.notifyAppReady();

createRoot(document.getElementById("root")!).render(<App />);
