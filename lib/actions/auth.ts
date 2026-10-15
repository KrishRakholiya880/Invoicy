"use server";

import * as Yup from "yup";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { loginSchema, registerSchema } from "@/lib/validation/auth";

/** Result passed back to the Formik forms. */
export type AuthState = {
  error?: string;
  success?: string;
};

/**
 * Server-side check with the same Yup schema the form uses client-side —
 * protects against submissions that bypass browser validation.
 */
function validate(schema: Yup.AnyObjectSchema, values: unknown): string | null {
  try {
    schema.validateSync(values, { abortEarly: false });
    return null;
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      return error.errors[0];
    }
    throw error;
  }
}

/** Same guard as the proxy: the app must run before Supabase is configured. */
function supabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

export async function login(formData: FormData): Promise<AuthState> {
  const values = {
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  };

  const validationError = validate(loginSchema, values);
  if (validationError) {
    return { error: validationError };
  }

  if (!supabaseConfigured()) {
    return {
      error: "Supabase is not configured yet — add your project keys to .env.local.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });

  if (error) {
    return { error: error.message };
  }

  // Dashboard does not exist yet — switch this to /dashboard in a later step.
  redirect("/");
}

export async function register(formData: FormData): Promise<AuthState> {
  const values = {
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
    confirm: String(formData.get("confirm") ?? ""),
  };

  const validationError = validate(registerSchema, values);
  if (validationError) {
    return { error: validationError };
  }

  if (!supabaseConfigured()) {
    return {
      error: "Supabase is not configured yet — add your project keys to .env.local.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
  });

  if (error) {
    return { error: error.message };
  }

  // No session means email confirmation is enabled on the Supabase project.
  if (!data.session) {
    return {
      success: "Account created — check your email to confirm, then log in.",
    };
  }

  redirect("/");
}

export async function logout(): Promise<void> {
  if (supabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  redirect("/login");
}
