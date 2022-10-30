import { render } from "solid-js/web";
import { Router } from "solid-app-router";

import "./index.css";

import { ChatDataProvider } from "./providers/Supabase";
import App from "./App";

render(
  () => (
    <ChatDataProvider>
      <Router>
        <App />
      </Router>
    </ChatDataProvider>
  ),
  document.getElementById("root")!
);
