"use client";

import { Field, ErrorMessage, type FieldProps } from "formik";
import type { InputHTMLAttributes } from "react";

type TextFieldProps = {
  label: string;
  name: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "name">;

/**
 * Formik-backed text input: label, input (red border when invalid)
 * and inline error message, wired up via Field/ErrorMessage.
 */
export function TextField({ label, name, ...inputProps }: TextFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <Field name={name}>
        {({ field, meta }: FieldProps) => (
          <input
            {...field}
            {...inputProps}
            id={name}
            className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 ${
              meta.touched && meta.error
                ? "border-red-500 focus:border-red-600 focus:ring-red-100"
                : "border-gray-300 focus:border-blue-700 focus:ring-blue-100"
            }`}
          />
        )}
      </Field>
      <ErrorMessage
        name={name}
        component="p"
        className="mt-1 text-sm text-red-600"
      />
    </div>
  );
}
