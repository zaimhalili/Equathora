import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ← important for routing
import App from "./App.jsx";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop.jsx";
import { AppProviders } from "./providers/AppProviders";
import { initializeTheme } from "./lib/theme";
import "./index.css"; // global styles

initializeTheme();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProviders>
        <ScrollToTop>
          <App />
        </ScrollToTop>
      </AppProviders>
    </BrowserRouter>
  </React.StrictMode>
);
