import { zyntra } from "@/zyntra";
import type { Comment } from "@prisma/client";
import type { CreateCommentBody, UpdateCommentBody } from "../comment.interfaces";

/**
 * @procedure CommentProcedure
 * @description Procedure for managing comment operations and data processing.
 *
 * This procedure provides the business logic layer for comment management, handling
 * the complete lifecycle of comment data including creation, updates, and deletion.
 * It injects comment management methods into the Zyntra context, making them
 * available to controllers and other parts of the application.
 *
 * @example
 * ```typescript
 * // Used in controllers
 * const records = await context.comment.findMany()
 * const record = await context.comment.findUnique("some-id")
 * ```
 */
export const commentProcedure = zyntra.procedure({
    name: 'CommentProcedure',
    handler: (_, { context }) => {
        // Context Extension: Return the repository instance in hierarchical structure for consistency.
        return {
            comment: {
                /**
                 * @method findMany
                 * @description Retrieves all comments.
                 *
                 * @returns {Promise<Comment[]>} Array of comment objects
                 * @throws {Error} When database query fails
                 */
                findMany: async (): Promise<Comment[]> => {
                    // Business Logic: Retrieve all comments using Prisma.
                    return context.database.comment.findMany({
                        orderBy: { id: "asc" },
                    });
                },

                /**
                 * @method findUnique
                 * @description Retrieves a specific comment by ID.
                 *
                 * @param {string} id - Unique identifier of the comment to retrieve
                 * @returns {Promise<Comment | null>} Comment object if found, null otherwise
                 * @throws {Error} When database query fails
                 */
                findUnique: async (id: string): Promise<Comment | null> => {
                    // Business Logic: Retrieve the comment using Prisma.
                    return context.database.comment.findUnique({
                        where: { id },
                    });
                },

                /**
                 * @method create
                 * @description Creates a new comment.
                 *
                 * @param {CreateCommentBody} data - Comment creation data
                 * @returns {Promise<Comment>} The newly created comment object
                 * @throws {Error} When database operation fails
                 */
                create: async (data: CreateCommentBody): Promise<Comment> => {
                    // Business Logic: Create a new comment using Prisma.
                    const comment = await context.database.comment.create({
                        data,
                    });

                    // Response: Return the newly created comment
                    return comment;
                },

                /**
                 * @method update
                 * @description Updates an existing comment.
                 *
                 * @param {string} id - Unique identifier of the comment to update
                 * @param {UpdateCommentBody} data - Updated comment data
                 * @returns {Promise<Comment>} The updated comment object
                 * @throws {Error} When comment is not found or database operation fails
                 */
                update: async (id: string, data: UpdateCommentBody): Promise<Comment> => {
                    // Business Rule: Check if comment exists before updating.
                    const commentExists = await context.database.comment.findUnique({
                        where: { id },
                    });

                    if (!commentExists) {
                        throw new Error('Comment not found');
                    }

                    // Business Logic: Update the comment using Prisma.
                    const comment = await context.database.comment.update({
                        where: { id },
                        data,
                    });

                    // Response: Return the updated comment
                    return comment;
                },

                /**
                 * @method delete
                 * @description Permanently deletes a comment.
                 *
                 * @param {string} id - Unique identifier of the comment to delete
                 * @returns {Promise<Comment>} The deleted comment object
                 * @throws {Error} When comment is not found or database operation fails
                 */
                delete: async (id: string): Promise<Comment> => {
                    // Business Logic: Delete the comment using Prisma.
                    const comment = await context.database.comment.delete({
                        where: { id },
                    });

                    // Response: Return the deleted comment
                    return comment;
                },
            },
        };
    },
});
