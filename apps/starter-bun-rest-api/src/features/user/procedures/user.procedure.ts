import { zyntra } from "@/zyntra";
import type { User } from "@prisma/client";
import type { CreateUserBody, UpdateUserBody } from "../user.interfaces";

/**
 * @procedure UserProcedure
 * @description Procedure for managing user operations and data processing.
 *
 * This procedure provides the business logic layer for user management, handling
 * the complete lifecycle of user data including creation, updates, and deletion.
 * It injects user management methods into the Zyntra context, making them
 * available to controllers and other parts of the application.
 *
 * @example
 * ```typescript
 * // Used in controllers
 * const records = await context.user.findMany()
 * const record = await context.user.findUnique("some-id")
 * ```
 */
export const userProcedure = zyntra.procedure({
    name: 'UserProcedure',
    handler: (_, { context }) => {
        // Context Extension: Return the repository instance in hierarchical structure for consistency.
        return {
            user: {
                /**
                 * @method findMany
                 * @description Retrieves all users.
                 *
                 * @returns {Promise<User[]>} Array of user objects
                 * @throws {Error} When database query fails
                 */
                findMany: async (): Promise<User[]> => {
                    // Business Logic: Retrieve all users using Prisma.
                    return context.database.user.findMany({
                        orderBy: { id: "asc" },
                    });
                },

                /**
                 * @method findUnique
                 * @description Retrieves a specific user by ID.
                 *
                 * @param {string} id - Unique identifier of the user to retrieve
                 * @returns {Promise<User | null>} User object if found, null otherwise
                 * @throws {Error} When database query fails
                 */
                findUnique: async (id: string): Promise<User | null> => {
                    // Business Logic: Retrieve the user using Prisma.
                    return context.database.user.findUnique({
                        where: { id },
                    });
                },

                /**
                 * @method create
                 * @description Creates a new user.
                 *
                 * @param {CreateUserBody} data - User creation data
                 * @returns {Promise<User>} The newly created user object
                 * @throws {Error} When database operation fails
                 */
                create: async (data: CreateUserBody): Promise<User> => {
                    // Business Logic: Create a new user using Prisma.
                    const user = await context.database.user.create({
                        data,
                    });

                    // Response: Return the newly created user
                    return user;
                },

                /**
                 * @method update
                 * @description Updates an existing user.
                 *
                 * @param {string} id - Unique identifier of the user to update
                 * @param {UpdateUserBody} data - Updated user data
                 * @returns {Promise<User>} The updated user object
                 * @throws {Error} When user is not found or database operation fails
                 */
                update: async (id: string, data: UpdateUserBody): Promise<User> => {
                    // Business Rule: Check if user exists before updating.
                    const userExists = await context.database.user.findUnique({
                        where: { id },
                    });

                    if (!userExists) {
                        throw new Error('User not found');
                    }

                    // Business Logic: Update the user using Prisma.
                    const user = await context.database.user.update({
                        where: { id },
                        data,
                    });

                    // Response: Return the updated user
                    return user;
                },

                /**
                 * @method delete
                 * @description Permanently deletes a user.
                 *
                 * @param {string} id - Unique identifier of the user to delete
                 * @returns {Promise<User>} The deleted user object
                 * @throws {Error} When user is not found or database operation fails
                 */
                delete: async (id: string): Promise<User> => {
                    // Business Logic: Delete the user using Prisma.
                    const user = await context.database.user.delete({
                        where: { id },
                    });

                    // Response: Return the deleted user
                    return user;
                },
            },
        };
    },
});
