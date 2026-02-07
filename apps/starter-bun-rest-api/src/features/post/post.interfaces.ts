import { z } from "zod";

/**
 * @description Zod schema for creating a new Post.
 */
export const CreatePostBodySchema = z.object({
    title: z.string(),
    content: z.string().nullable(),
    published: z.boolean().optional(),
    authorId: z.string(),
});

/**
 * @description Zod schema for updating an existing Post.
 */
export const UpdatePostBodySchema = z.object({
    title: z.string().optional(),
    content: z.string().nullable().optional(),
    published: z.boolean().optional(),
    authorId: z.string().optional(),
});

/**
 * @description Type for CreatePostBodySchema.
 */
export type CreatePostBody = z.infer<typeof CreatePostBodySchema>;

/**
 * @description Type for UpdatePostBodySchema.
 */
export type UpdatePostBody = z.infer<typeof UpdatePostBodySchema>;
