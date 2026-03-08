import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { useBootstrapConfig } from "@hooks/useBootstrapConfig.js";

function Root() {
  const configUrl = useBootstrapConfig();

  if (!configUrl) {
    return null;
  }

  return (
    <StrictMode>
      <App configFile={configUrl} />
    </StrictMode>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);