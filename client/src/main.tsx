import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import SidebarComp from "./components/Sidebar.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <div className="flex h-screen">
        <SidebarComp />
        <div className="flex-1 overflow-y-auto">
          <App />
        </div>
      </div>
    </BrowserRouter>
  </StrictMode>
);
