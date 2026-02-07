import { PrismaClient } from "@prisma/client";
import type { Comment } from "@prisma/client";
import type { CreateCommentBody, UpdateCommentBody } from "../comment.interfaces";

/**
 * @class CommentRepository
 * @description Centralizes all database operations for the Comment entity using Prisma.
 */
export class CommentRepository {
    private db: PrismaClient;

    /**
     * @constructor
     * @param {PrismaClient} db - The Prisma database client.
     */
    constructor(db: PrismaClient) {
        this.db = db;
    }

    /**
     * @method list
     * @description Retrieves a list of all comments.
     * @returns {Promise<Comment[]>} A promise that resolves to an array of comments.
     */
    async list(): Promise<Comment[]> {
        return this.db.comment.findMany({
            orderBy: { id: "asc" },
        });
    }

    /**
     * @method getById
     * @description Retrieves a single comment by their unique ID.
     * @param {string} id - The unique ID of the comment.
     * @returns {Promise<Comment | null>} A promise that resolves to the comment if found, or null otherwise.
     */
    async getById(id: string): Promise<Comment | null> {
        return this.db.comment.findUnique({
            where: { id },
        });
    }

    /**
     * @method create
     * @description Creates a new comment record in the database.
     * @param {CreateCommentBody} data - The data for the new comment.
     * @returns {Promise<Comment>} A promise that resolves to the created comment.
     */
    async create(data: CreateCommentBody): Promise<Comment> {
        return this.db.comment.create({
            data,
        });
    }

    /**
     * @method update
     * @description Updates an existing comment record in the database.
     * @param {string} id - The ID of the comment to update.
     * @param {UpdateCommentBody} data - The data to update.
     * @returns {Promise<Comment>} A promise that resolves to the updated comment.
     */
    async update(id: string, data: UpdateCommentBody): Promise<Comment> {
        return this.db.comment.update({
            where: { id },
            data,
        });
    }

    /**
     * @method delete
     * @description Deletes a comment record from the database.
     * @param {string} id - The ID of the comment to delete.
     * @returns {Promise<Comment>} A promise that resolves to the deleted comment.
     */
    async delete(id: string): Promise<Comment> {
        return this.db.comment.delete({
            where: { id },
        });
    }
}
