import { zyntra } from "@/zyntra";
import type { Post } from "@prisma/client";
import type { CreatePostBody, UpdatePostBody } from "../post.interfaces";

/**
 * @procedure PostProcedure
 * @description Procedure for managing post operations and data processing.
 *
 * This procedure provides the business logic layer for post management, handling
 * the complete lifecycle of post data including creation, updates, and deletion.
 * It injects post management methods into the Zyntra context, making them
 * available to controllers and other parts of the application.
 *
 * @example
 * ```typescript
 * // Used in controllers
 * const records = await context.post.findMany()
 * const record = await context.post.findUnique("some-id")
 * ```
 */
export const postProcedure = zyntra.procedure({
    name: 'PostProcedure',
    handler: (_, { context }) => {
        // Context Extension: Return the repository instance in hierarchical structure for consistency.
        return {
            post: {
                /**
                 * @method findMany
                 * @description Retrieves all posts.
                 *
                 * @returns {Promise<Post[]>} Array of post objects
                 * @throws {Error} When database query fails
                 */
                findMany: async (): Promise<Post[]> => {
                    // Business Logic: Retrieve all posts using Prisma.
                    return context.database.post.findMany({
                        orderBy: { id: "asc" },
                    });
                },

                /**
                 * @method findUnique
                 * @description Retrieves a specific post by ID.
                 *
                 * @param {string} id - Unique identifier of the post to retrieve
                 * @returns {Promise<Post | null>} Post object if found, null otherwise
                 * @throws {Error} When database query fails
                 */
                findUnique: async (id: string): Promise<Post | null> => {
                    // Business Logic: Retrieve the post using Prisma.
                    return context.database.post.findUnique({
                        where: { id },
                    });
                },

                /**
                 * @method create
                 * @description Creates a new post.
                 *
                 * @param {CreatePostBody} data - Post creation data
                 * @returns {Promise<Post>} The newly created post object
                 * @throws {Error} When database operation fails
                 */
                create: async (data: CreatePostBody): Promise<Post> => {
                    // Business Logic: Create a new post using Prisma.
                    const { authorId, ...rest } = data;
                    const post = await context.database.post.create({
                        data: {
                            ...rest,
                            author: { connect: { id: authorId } },
                        },
                    });

                    // Response: Return the newly created post
                    return post;
                },

                /**
                 * @method update
                 * @description Updates an existing post.
                 *
                 * @param {string} id - Unique identifier of the post to update
                 * @param {UpdatePostBody} data - Updated post data
                 * @returns {Promise<Post>} The updated post object
                 * @throws {Error} When post is not found or database operation fails
                 */
                update: async (id: string, data: UpdatePostBody): Promise<Post> => {
                    // Business Rule: Check if post exists before updating.
                    const postExists = await context.database.post.findUnique({
                        where: { id },
                    });

                    if (!postExists) {
                        throw new Error('Post not found');
                    }

                    // Business Logic: Update the post using Prisma.
                    const { authorId, ...rest } = data;
                    const post = await context.database.post.update({
                        where: { id },
                        data: {
                            ...rest,
                            ...(authorId && { author: { connect: { id: authorId } } }),
                        },
                    });

                    // Response: Return the updated post
                    return post;
                },

                /**
                 * @method delete
                 * @description Permanently deletes a post.
                 *
                 * @param {string} id - Unique identifier of the post to delete
                 * @returns {Promise<Post>} The deleted post object
                 * @throws {Error} When post is not found or database operation fails
                 */
                delete: async (id: string): Promise<Post> => {
                    // Business Logic: Delete the post using Prisma.
                    const post = await context.database.post.delete({
                        where: { id },
                    });

                    // Response: Return the deleted post
                    return post;
                },
            },
        };
    },
});
