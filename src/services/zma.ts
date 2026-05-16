/**
 * Zalo Mini App service wrapper.
 * Detects if running inside ZMA and uses appropriate storage/auth.
 * Falls back to localStorage when running outside ZMA (web/GitHub Pages).
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

// Check if running inside Zalo Mini App
export function isZMA(): boolean {
  try {
    return (
      typeof window !== "undefined" &&
      (window as AnyRecord).ZaloMiniAppSDK !== undefined
    );
  } catch {
    return false;
  }
}

// Dynamically import zmp-sdk only when in ZMA
async function getZMA() {
  if (!isZMA()) return null;
  try {
    const zmp = await import("zmp-sdk");
    return zmp;
  } catch {
    return null;
  }
}

// ── Storage ────────────────────────────────────────────────────────────────

export async function zmaGetItem(key: string): Promise<string | null> {
  if (!isZMA()) {
    return localStorage.getItem(key);
  }
  try {
    const zmp = await getZMA();
    if (!zmp) return localStorage.getItem(key);
    const res: AnyRecord = await (zmp as AnyRecord).getStorage({ keys: [key] });
    return res?.[key] ?? null;
  } catch {
    return localStorage.getItem(key);
  }
}

export async function zmaSetItem(key: string, value: string): Promise<void> {
  if (!isZMA()) {
    localStorage.setItem(key, value);
    return;
  }
  try {
    const zmp = await getZMA();
    if (!zmp) {
      localStorage.setItem(key, value);
      return;
    }
    await (zmp as AnyRecord).setStorage({ data: { [key]: value } });
  } catch {
    localStorage.setItem(key, value);
  }
}

export async function zmaRemoveItem(key: string): Promise<void> {
  if (!isZMA()) {
    localStorage.removeItem(key);
    return;
  }
  try {
    const zmp = await getZMA();
    if (!zmp) {
      localStorage.removeItem(key);
      return;
    }
    await (zmp as AnyRecord).removeStorage({ keys: [key] });
  } catch {
    localStorage.removeItem(key);
  }
}

// ── Auth (Zalo Login) ──────────────────────────────────────────────────────

export async function zmaLogin(): Promise<{
  accessToken: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userInfo: any;
} | null> {
  if (!isZMA()) {
    return null; // fallback to manual login on web
  }
  try {
    const zmp = await getZMA();
    if (!zmp) return null;

    // Step 1: get access token (triggers Zalo login dialog)
    const tokenResult: AnyRecord = await (zmp as AnyRecord).getAccessToken({});
    const accessToken: string = tokenResult?.accessToken ?? "";
    if (!accessToken) return null;

    // Step 2: get user info
    const userInfo = await (zmp as AnyRecord).getUserInfo({});

    return { accessToken, userInfo };
  } catch (err) {
    console.error("ZMA login failed:", err);
    return null;
  }
}

export async function zmaGetAccessToken(): Promise<string | null> {
  if (!isZMA()) return null;
  try {
    const zmp = await getZMA();
    if (!zmp) return null;
    const tokenResult: AnyRecord = await (zmp as AnyRecord).getAccessToken({});
    return tokenResult?.accessToken ?? null;
  } catch {
    return null;
  }
}

export default {
  isZMA,
  zmaGetItem,
  zmaSetItem,
  zmaRemoveItem,
  zmaLogin,
  zmaGetAccessToken,
};
