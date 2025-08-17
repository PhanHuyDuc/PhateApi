import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

export const signUpSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        passwordRegex,
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character "
      ),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
    displayName: z
      .string()
      .min(5, "Display Name must be at least 5 characters long")
      .max(50, "Your display name max is 50 chatracters long"),
    bio: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password dont match",
    path: ["confirmPassword"],
  });
