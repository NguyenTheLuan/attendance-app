import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { isZMA } from "~/services/zma";
import App from "~/App";
import "~/index.css";

type ProviderType = React.ComponentType<{ children: React.ReactNode }>;

// Only use ZaloProvider when running inside ZMA
function AppWithProvider() {
  const [Provider, setProvider] = useState<ProviderType | null>(null);

  useEffect(() => {
    if (isZMA()) {
      import("zmp-ui").then((mod) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const p = (mod as any).ZaloProvider as ProviderType | undefined;
        if (p) setProvider(() => p);
      });
    }
  }, []);

  if (Provider) {
    return (
      <Provider>
        <App />
      </Provider>
    );
  }

  return <App />;
}

function Root() {
  return (
    <StrictMode>
      <AppWithProvider />
    </StrictMode>
  );
}

// ZMA platform uses "#app" as root container (not "#root")
function getRootElement(): HTMLElement | null {
  // In ZMA, the platform injects its own DOM shell.
  // Try multiple selectors to find the mount point.
  const selectors = ["#app", "#root", "body > div:first-child"];
  for (const sel of selectors) {
    const el = document.querySelector<HTMLElement>(sel);
    if (el) return el;
  }
  return null;
}

function mount() {
  const container = getRootElement();
  if (container) {
    try {
      createRoot(container).render(<Root />);
      console.info("App mounted");
    } catch (e) {
      console.error("Mount failed:", e);
    }
    return;
  }

  // Retry with polling (ZMA may inject DOM asynchronously)
  let attempts = 0;
  function poll() {
    const el = getRootElement();
    if (el) {
      try {
        createRoot(el).render(<Root />);
        console.info("App mounted (poll)");
      } catch (e) {
        console.error("Mount (poll) failed:", e);
      }
      return;
    }
    attempts++;
    if (attempts < 100) setTimeout(poll, 200);
  }
  setTimeout(poll, 200);
}

mount();
