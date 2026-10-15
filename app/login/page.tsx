"use client";

import { useState } from "react";
import { Formik, Form } from "formik";
import Link from "next/link";
import { login } from "@/lib/actions/auth";
import { loginSchema, type LoginValues } from "@/lib/validation/auth";
import { TextField } from "@/components/form/TextField";

const initialValues: LoginValues = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const [result, setResult] = useState<{ error?: string } | null>(null);

  return (
    <main className="flex flex-1 items-center justify-center bg-gray-50 px-4 py-16">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="mt-1 text-sm text-gray-500">
          Log in to continue managing your bills.
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={loginSchema}
          onSubmit={async (values, { setSubmitting }) => {
            const formData = new FormData();
            formData.append("email", values.email);
            formData.append("password", values.password);

            const serverResult = await login(formData);
            setResult(serverResult);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="mt-6 space-y-4">
              <TextField
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
              />

              {result?.error && (
                <p
                  role="alert"
                  className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
                >
                  {result.error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Logging in…" : "Log in"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-6 text-center text-sm text-gray-500">
          No account yet?{" "}
          <Link
            href="/register"
            className="font-semibold text-blue-700 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
