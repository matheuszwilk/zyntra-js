import { zyntra } from "@/zyntra";
import { CreatePostBodySchema, UpdatePostBodySchema } from "../post.interfaces";
import { postProcedure } from "../procedures/post.procedure";

/**
 * @const postController
 * @description
 * Controller for managing post-related operations, including listing, creating,
 * updating, and deleting posts.
 */
export const postController = zyntra.controller({
    name: "post",
    path: "/post",
    description: "Post management endpoints for handling post data.",
    actions: {
        /**
         * @action list
         * @description Retrieves a list of all registered posts.
         */
        list: zyntra.query({
            name: "List",
            description: "List all posts currently registered in the system.",
            path: "",
            use: [postProcedure()],
            handler: async ({ response, context }) => {
                // Business Logic: Use the injected post methods to fetch all records.
                const records = await context.post.findMany();

                // Response: Return the list of posts with a 200 OK status.
                return response.success(records);
            },
        }),

        /**
         * @action getById
         * @description Retrieves a specific post by their unique ID.
         */
        getById: zyntra.query({
            name: "GetById",
            description: "Fetch a single post's details using their unique identifier.",
            path: ":id" as const,
            use: [postProcedure()],
            handler: async ({ request, response, context }) => {
                // Observation: Extract the post ID from the request parameters.
                const { id } = request.params;

                // Business Logic: Attempt to find the post by ID via the injected methods.
                const record = await context.post.findUnique(id);

                // Business Rule: If a post is not found, return a 404 Not Found response.
                if (!record) {
                    return response.notFound("Post not found.");
                }

                // Response: Return the found post with a 200 OK status.
                return response.success(record);
            },
        }),

        /**
         * @action create
         * @description Creates a new post record.
         */
        create: zyntra.mutation({
            name: "Create",
            description: "Register a new post in the system.",
            path: "",
            method: "POST",
            body: CreatePostBodySchema,
            use: [postProcedure()],
            handler: async ({ request, response, context }) => {
                // Observation: Extract creation data from the validated request body.
                const data = request.body;

                // Business Logic: Create the new post record using the repository.
                const record = await context.post.create(data);

                // Response: Return the newly created post with a 201 Created status.
                return response.created(record);
            },
        }),

        /**
         * @action update
         * @description Updates an existing post's information.
         */
        update: zyntra.mutation({
            name: "Update",
            description: "Modify an existing post's details.",
            path: ":id" as const,
            method: "PUT",
            body: UpdatePostBodySchema,
            use: [postProcedure()],
            handler: async ({ request, response, context }) => {
                // Observation: Extract post ID and update data.
                const { id } = request.params;
                const data = request.body;

                // Business Logic: Attempt to update the post record via the injected methods.
                try {
                    const record = await context.post.update(id, data);
                    // Response: Return the updated post with a 200 OK status.
                    return response.success(record);
                } catch (error) {
                    // Business Rule: Handle cases where the post might not exist or update fails.
                    return response.notFound("Post not found or update failed.");
                }
            },
        }),

        /**
         * @action delete
         * @description Removes a post from the system.
         */
        delete: zyntra.mutation({
            name: "Delete",
            description: "Permanently delete a post from the system.",
            path: ":id" as const,
            method: "DELETE",
            use: [postProcedure()],
            handler: async ({ request, response, context }) => {
                // Observation: Extract the post ID to be deleted.
                const { id } = request.params;

                // Business Logic: Use the injected methods to delete the post record.
                try {
                    await context.post.delete(id);
                    // Response: Return a 204 No Content status for successful deletion.
                    return response.noContent();
                } catch (error) {
                    // Business Rule: Handle cases where deletion fails (e.g., post not found).
                    return response.notFound("Post not found or deletion failed.");
                }
            },
        }),
    },
});
