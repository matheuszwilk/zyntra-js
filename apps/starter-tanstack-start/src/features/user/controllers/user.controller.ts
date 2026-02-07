import { zyntra } from "@/zyntra";
import { CreateUserBodySchema, UpdateUserBodySchema } from "../user.interfaces";
import { userProcedure } from "../procedures/user.procedure";

/**
 * @const userController
 * @description
 * Controller for managing user-related operations, including listing, creating,
 * updating, and deleting users.
 */
export const userController = zyntra.controller({
    name: "user",
    path: "/user",
    description: "User management endpoints for handling user profiles and account data.",
    actions: {
        /**
         * @action list
         * @description Retrieves a list of all registered users.
         */
        list: zyntra.query({
            name: "List",
            description: "List all users currently registered in the system.",
            path: "/",
            use: [userProcedure()],
            handler: async ({ response, context }) => {
                // Business Logic: Use the injected user methods to fetch all users.
                const users = await context.user.findMany();

                // Response: Return the list of users with a 200 OK status.
                return response.success(users);
            },
        }),

        /**
         * @action getById
         * @description Retrieves a specific user by their unique ID.
         */
        getById: zyntra.query({
            name: "GetById",
            description: "Fetch a single user's details using their unique identifier.",
            path: "/:id" as const,
            use: [userProcedure()],
            handler: async ({ request, response, context }) => {
                // Observation: Extract the user ID from the request parameters.
                const { id } = request.params;

                // Business Logic: Attempt to find the user by ID via the injected user methods.
                const user = await context.user.findUnique(id);

                // Business Rule: If a user is not found, return a 404 Not Found response.
                if (!user) {
                    return response.notFound("User not found.");
                }

                // Response: Return the found user with a 200 OK status.
                return response.success(user);
            },
        }),

        /**
         * @action create
         * @description Creates a new user record.
         */
        create: zyntra.mutation({
            name: "Create",
            description: "Register a new user in the system.",
            path: "/",
            method: "POST",
            body: CreateUserBodySchema,
            use: [userProcedure()],
            handler: async ({ request, response, context }) => {
                // Observation: Extract creation data from the validated request body.
                const data = request.body;

                // Business Logic: Create the new user record using the repository.
                const user = await context.user.create(data);

                // Response: Return the newly created user with a 201 Created status.
                return response.created(user);
            },
        }),

        /**
         * @action update
         * @description Updates an existing user's information.
         */
        update: zyntra.mutation({
            name: "Update",
            description: "Modify an existing user's details.",
            path: "/:id" as const,
            method: "PUT",
            body: UpdateUserBodySchema,
            use: [userProcedure()],
            handler: async ({ request, response, context }) => {
                // Observation: Extract user ID and update data.
                const { id } = request.params;
                const data = request.body;

                // Business Logic: Attempt to update the user record via the injected user methods.
                try {
                    const user = await context.user.update(id, data);
                    // Response: Return the updated user with a 200 OK status.
                    return response.success(user);
                } catch (error) {
                    // Business Rule: Handle cases where the user might not exist or update fails.
                    return response.notFound("User not found or update failed.");
                }
            },
        }),

        /**
         * @action delete
         * @description Removes a user from the system.
         */
        delete: zyntra.mutation({
            name: "Delete",
            description: "Permanently delete a user account from the system.",
            path: "/:id" as const,
            method: "DELETE",
            use: [userProcedure()],
            handler: async ({ request, response, context }) => {
                // Observation: Extract the user ID to be deleted.
                const { id } = request.params;

                // Business Logic: Use the injected user methods to delete the user record.
                try {
                    await context.user.delete(id);
                    // Response: Return a 204 No Content status for successful deletion.
                    return response.noContent();
                } catch (error) {
                    // Business Rule: Handle cases where deletion fails (e.g., user not found).
                    return response.notFound("User not found or deletion failed.");
                }
            },
        }),
    },
});
