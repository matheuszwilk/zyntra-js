import { z } from "zod";

/**
 * @description Zod schema for creating a new user.
 */
export const CreateUserBodySchema = z.object({
    email: z.string().email("Invalid email format"),
});

/**
 * @description Zod schema for updating an existing user.
 */
export const UpdateUserBodySchema = z.object({
    email: z.string().email("Invalid email format").optional(),
});

/**
 * @description Type for CreateUserBodySchema.
 */
export type CreateUserBody = z.infer<typeof CreateUserBodySchema>;

/**
 * @description Type for UpdateUserBodySchema.
 */
export type UpdateUserBody = z.infer<typeof UpdateUserBodySchema>;
