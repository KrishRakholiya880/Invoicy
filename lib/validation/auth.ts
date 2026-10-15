import * as Yup from "yup";

/**
 * Single source of truth for auth validation.
 * Used by the Formik forms (client) and by the server actions (server),
 * so both sides always enforce the exact same rules.
 */

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export const registerSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirm: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm your password"),
});

export type LoginValues = Yup.InferType<typeof loginSchema>;
export type RegisterValues = Yup.InferType<typeof registerSchema>;
