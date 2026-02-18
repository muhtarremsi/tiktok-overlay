"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// --- LOGIN ACTION ---
export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const token = formData.get("recaptchaToken") as string;

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;

  // 1. Bot Check
  if (!token) return { error: "Security check failed. Please reload." };

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${recaptchaSecret}&response=${token}`,
    });
    const data = await res.json();
    if (!data.success || data.score < 0.5) {
      return { error: "Bot detected. Access denied." };
    }
  } catch (e) {
    return { error: "Captcha validation failed." };
  }

  // 2. Credentials Check
  if (email === adminEmail && password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set("seker_admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, 
      path: "/",
    });
    // Erfolg!
    return { success: true };
  } else {
    return { error: "Invalid email or password." };
  }
}

// --- REGISTER ACTION ---
export async function register(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const token = formData.get("recaptchaToken") as string;
  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  // Bot Check
  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${recaptchaSecret}&response=${token}`,
    });
    const data = await res.json();
    if (!data.success || data.score < 0.5) return { error: "Bot detected." };
  } catch (e) { return { error: "Captcha failed." }; }

  // SIMULATION: Da wir keine DB haben, lassen wir nur den Admin "registrieren" (Login)
  // oder geben einen Fehler aus.
  const adminEmail = process.env.ADMIN_EMAIL;
  
  if (email === adminEmail) {
     // Falls der User versucht sich als Admin zu "registrieren", loggen wir ihn ein.
     const cookieStore = await cookies();
     cookieStore.set("seker_admin_session", "true", {
       httpOnly: true,
       secure: process.env.NODE_ENV === "production",
       maxAge: 60 * 60 * 24 * 7,
       path: "/",
     });
     return { success: true };
  }

  return { error: "Public registration is currently closed. Invite only." };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("seker_admin_session");
  redirect("/");
}
