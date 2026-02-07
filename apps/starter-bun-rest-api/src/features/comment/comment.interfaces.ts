import { z } from "zod";

/**
 * @description Zod schema for creating a new Comment.
 */
export const CreateCommentBodySchema = z.object({
    content: z.string(),
});

/**
 * @description Zod schema for updating an existing Comment.
 */
export const UpdateCommentBodySchema = z.object({
    content: z.string().optional(),
});

/**
 * @description Type for CreateCommentBodySchema.
 */
export type CreateCommentBody = z.infer<typeof CreateCommentBodySchema>;

/**
 * @description Type for UpdateCommentBodySchema.
 */
export type UpdateCommentBody = z.infer<typeof UpdateCommentBodySchema>;
