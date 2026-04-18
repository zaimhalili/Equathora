import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ← important for routing
import App from "./App.jsx";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop.jsx";
import { initializeTheme } from "./lib/theme";
import "./index.css"; // global styles

initializeTheme();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop>
        <App />
      </ScrollToTop>
    </BrowserRouter>
  </React.StrictMode>
);
