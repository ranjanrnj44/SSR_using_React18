import React from "react";
import { hydrateRoot } from "react-dom/client";
import "./index.css";
//app
import App from "./App";

//container
const container = document.getElementById("root");

//hydrateRoot - To obtain SSR, for selective hydration
hydrateRoot(
  container,
  <React.StrictMode>
    <App name="SSR 18" />
  </React.StrictMode>
);

//React 18 CSR - to obtain new features like (automatic batching, concurrency, transistion)

// const container = document.getElementById('app');
// const root = ReactDOM.createRoot(container);
// root.render(<App />);
