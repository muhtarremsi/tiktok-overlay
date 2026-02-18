"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  // Einfacher Check: Stimmen die Daten mit der .env überein?
  if (email === adminEmail && password === adminPassword) {
    // Cookie setzen (hält 7 Tage)
    // WICHTIG: In Next.js 15+ ist cookies() asynchron! Wir müssen 'await' nutzen.
    const cookieStore = await cookies();
    
    cookieStore.set("seker_admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 Woche
      path: "/",
    });
    
    // Weiterleiten zum Dashboard
    redirect("/");
  } else {
    return { message: "Invalid credentials" };
  }
}

export async function logout() {
  // Auch hier: await cookies()
  const cookieStore = await cookies();
  cookieStore.delete("seker_admin_session");
  redirect("/login");
}
