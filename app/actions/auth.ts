"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const token = formData.get("recaptchaToken"); // Token empfangen

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;

  if (!token) {
    return { message: "Security check failed (No Token)" };
  }

  // 1. Token bei Google verifizieren
  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${recaptchaSecret}&response=${token}`,
    });
    
    const data = await res.json();

    // Score prüfen: 0.0 (Bot) - 1.0 (Mensch). 0.5 ist ein guter Standard.
    if (!data.success || data.score < 0.5) {
        console.error("Bot detected or Verification failed", data);
        return { message: "Security check failed. Are you a robot?" };
    }

  } catch (error) {
    return { message: "Validation Error" };
  }

  // 2. Passwort prüfen (erst wenn kein Bot!)
  if (email === adminEmail && password === adminPassword) {
    const cookieStore = await cookies();
    
    cookieStore.set("seker_admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, 
      path: "/",
    });
    
    redirect("/dashboard");
  } else {
    return { message: "Invalid credentials" };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("seker_admin_session");
  redirect("/login");
}
