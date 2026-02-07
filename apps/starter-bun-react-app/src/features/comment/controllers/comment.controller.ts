import { zyntra } from "@/zyntra";
import { CreateCommentBodySchema, UpdateCommentBodySchema } from "../comment.interfaces";
import { commentProcedure } from "../procedures/comment.procedure";

/**
 * @const commentController
 * @description
 * Controller for managing comment-related operations, including listing, creating,
 * updating, and deleting comments.
 */
export const commentController = zyntra.controller({
    name: "comment",
    path: "/comment",
    description: "Comment management endpoints for handling comment data.",
    actions: {
        /**
         * @action list
         * @description Retrieves a list of all registered comments.
         */
        list: zyntra.query({
            name: "List",
            description: "List all comments currently registered in the system.",
            path: "",
            use: [commentProcedure()],
            handler: async ({ response, context }) => {
                // Business Logic: Use the injected comment methods to fetch all records.
                const records = await context.comment.findMany();

                // Response: Return the list of comments with a 200 OK status.
                return response.success(records);
            },
        }),

        /**
         * @action getById
         * @description Retrieves a specific comment by their unique ID.
         */
        getById: zyntra.query({
            name: "GetById",
            description: "Fetch a single comment's details using their unique identifier.",
            path: ":id" as const,
            use: [commentProcedure()],
            handler: async ({ request, response, context }) => {
                // Observation: Extract the comment ID from the request parameters.
                const { id } = request.params;

                // Business Logic: Attempt to find the comment by ID via the injected methods.
                const record = await context.comment.findUnique(id);

                // Business Rule: If a comment is not found, return a 404 Not Found response.
                if (!record) {
                    return response.notFound("Comment not found.");
                }

                // Response: Return the found comment with a 200 OK status.
                return response.success(record);
            },
        }),

        /**
         * @action create
         * @description Creates a new comment record.
         */
        create: zyntra.mutation({
            name: "Create",
            description: "Register a new comment in the system.",
            path: "",
            method: "POST",
            body: CreateCommentBodySchema,
            use: [commentProcedure()],
            handler: async ({ request, response, context }) => {
                // Observation: Extract creation data from the validated request body.
                const data = request.body;

                // Business Logic: Create the new comment record using the repository.
                const record = await context.comment.create(data);

                // Response: Return the newly created comment with a 201 Created status.
                return response.created(record);
            },
        }),

        /**
         * @action update
         * @description Updates an existing comment's information.
         */
        update: zyntra.mutation({
            name: "Update",
            description: "Modify an existing comment's details.",
            path: ":id" as const,
            method: "PUT",
            body: UpdateCommentBodySchema,
            use: [commentProcedure()],
            handler: async ({ request, response, context }) => {
                // Observation: Extract comment ID and update data.
                const { id } = request.params;
                const data = request.body;

                // Business Logic: Attempt to update the comment record via the injected methods.
                try {
                    const record = await context.comment.update(id, data);
                    // Response: Return the updated comment with a 200 OK status.
                    return response.success(record);
                } catch (error) {
                    // Business Rule: Handle cases where the comment might not exist or update fails.
                    return response.notFound("Comment not found or update failed.");
                }
            },
        }),

        /**
         * @action delete
         * @description Removes a comment from the system.
         */
        delete: zyntra.mutation({
            name: "Delete",
            description: "Permanently delete a comment from the system.",
            path: ":id" as const,
            method: "DELETE",
            use: [commentProcedure()],
            handler: async ({ request, response, context }) => {
                // Observation: Extract the comment ID to be deleted.
                const { id } = request.params;

                // Business Logic: Use the injected methods to delete the comment record.
                try {
                    await context.comment.delete(id);
                    // Response: Return a 204 No Content status for successful deletion.
                    return response.noContent();
                } catch (error) {
                    // Business Rule: Handle cases where deletion fails (e.g., comment not found).
                    return response.notFound("Comment not found or deletion failed.");
                }
            },
        }),
    },
});
