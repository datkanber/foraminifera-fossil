import { createRoot } from "react-dom/client";

import App from "./App";

import "./styles/variables.css";
import "./styles/global.css";
import "./styles/enterprise.css";

const rootElement = document.getElementById("root");

const root = createRoot(rootElement);

root.render(<App />);
