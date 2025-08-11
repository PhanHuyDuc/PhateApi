import { email, z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be a positive number"),
  rating: z.number().min(0).max(5, "Rating must be between 0 and 5"),
  multiImages: z.array(z.string()).min(1, "At least one image is required"),
});

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
// Enhanced error formatting function
export function formatError(error: any): string {
  // Handle Zod validation errors
  if (error?.name === "ZodError") {
    const fieldErrors = error.issues.map((issue: any) => {
      const path = issue.path.join(".");
      return `${path}: ${issue.message}`;
    });
    return fieldErrors.join(". ");
  }

  // Handle custom application errors
  if (error?.message) {
    return error.message;
  }

  // Fallback for unknown errors
  return "An unexpected error occurred. Please try again.";
}

export const updateProfileSchema = z.object({
  displayName: z
    .string()
    .min(5, "Display Name must be at least 5 characters long")
    .max(50, "Your display name max is 50 chatracters long"),

  email: z.string().email("Invalid email object"),
});
