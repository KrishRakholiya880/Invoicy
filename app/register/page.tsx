"use client";

import { useState } from "react";
import { Formik, Form } from "formik";
import Link from "next/link";
import { register, type AuthState } from "@/lib/actions/auth";
import { registerSchema, type RegisterValues } from "@/lib/validation/auth";
import { TextField } from "@/components/form/TextField";

const initialValues: RegisterValues = {
  email: "",
  password: "",
  confirm: "",
};

export default function RegisterPage() {
  const [result, setResult] = useState<AuthState | null>(null);

  return (
    <main className="flex flex-1 items-center justify-center bg-gray-50 px-4 py-16">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
        <p className="mt-1 text-sm text-gray-500">
          Start managing companies and bills in minutes.
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={registerSchema}
          onSubmit={async (values, { setSubmitting }) => {
            const formData = new FormData();
            formData.append("email", values.email);
            formData.append("password", values.password);
            formData.append("confirm", values.confirm);

            const serverResult = await register(formData);
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
                minLength={6}
                autoComplete="new-password"
                placeholder="At least 6 characters"
              />
              <TextField
                label="Confirm password"
                name="confirm"
                type="password"
                minLength={6}
                autoComplete="new-password"
                placeholder="Repeat your password"
              />

              {result?.error && (
                <p
                  role="alert"
                  className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
                >
                  {result.error}
                </p>
              )}
              {result?.success && (
                <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
                  {result.success}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Creating account…" : "Register"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-blue-700 hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
