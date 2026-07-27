import { supabase } from "./supabase";

const EMAIL_DOMAIN = "@attendance.app";

/**
 * Đăng nhập bằng username (tự động thêm domain để thành email hợp lệ)
 */
export async function signIn(username: string, pass: string) {
  const email = username.includes("@") ? username : `${username}${EMAIL_DOMAIN}`;
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: pass,
  });

  if (error) {
    throw error;
  }
  return data;
}

/**
 * Đăng xuất
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Lấy session hiện tại
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

/**
 * Lắng nghe thay đổi trạng thái đăng nhập
 */
export function onAuthStateChange(callback: (isLoggedIn: boolean) => void) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(!!session);
  });
  
  return data.subscription;
}
