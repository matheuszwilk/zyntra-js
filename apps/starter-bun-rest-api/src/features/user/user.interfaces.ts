import { z } from "zod";

/**
 * @description Zod schema for creating a new User.
 */
export const CreateUserBodySchema = z.object({
    email: z.string(),
    name: z.string().nullable(),
});

/**
 * @description Zod schema for updating an existing User.
 */
export const UpdateUserBodySchema = z.object({
    email: z.string().optional(),
    name: z.string().nullable().optional(),
});

/**
 * @description Type for CreateUserBodySchema.
 */
export type CreateUserBody = z.infer<typeof CreateUserBodySchema>;

/**
 * @description Type for UpdateUserBodySchema.
 */
export type UpdateUserBody = z.infer<typeof UpdateUserBodySchema>;
