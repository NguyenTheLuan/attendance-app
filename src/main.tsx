import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "~/hooks/useTheme";
import App from "~/App";
import "~/index.css";

function Root() {
  return (
    <StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </StrictMode>
  );
}

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(<Root />);
}
