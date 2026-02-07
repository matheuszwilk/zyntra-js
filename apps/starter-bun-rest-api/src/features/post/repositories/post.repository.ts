import { PrismaClient } from "@prisma/client";
import type { Post } from "@prisma/client";
import type { CreatePostBody, UpdatePostBody } from "../post.interfaces";

/**
 * @class PostRepository
 * @description Centralizes all database operations for the Post entity using Prisma.
 */
export class PostRepository {
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
     * @description Retrieves a list of all posts.
     * @returns {Promise<Post[]>} A promise that resolves to an array of posts.
     */
    async list(): Promise<Post[]> {
        return this.db.post.findMany({
            orderBy: { id: "asc" },
        });
    }

    /**
     * @method getById
     * @description Retrieves a single post by their unique ID.
     * @param {string} id - The unique ID of the post.
     * @returns {Promise<Post | null>} A promise that resolves to the post if found, or null otherwise.
     */
    async getById(id: string): Promise<Post | null> {
        return this.db.post.findUnique({
            where: { id },
        });
    }

    /**
     * @method create
     * @description Creates a new post record in the database.
     * @param {CreatePostBody} data - The data for the new post.
     * @returns {Promise<Post>} A promise that resolves to the created post.
     */
    async create(data: CreatePostBody): Promise<Post> {
        const { authorId, ...rest } = data;
        return this.db.post.create({
            data: {
                ...rest,
                author: { connect: { id: authorId } },
            },
        });
    }

    /**
     * @method update
     * @description Updates an existing post record in the database.
     * @param {string} id - The ID of the post to update.
     * @param {UpdatePostBody} data - The data to update.
     * @returns {Promise<Post>} A promise that resolves to the updated post.
     */
    async update(id: string, data: UpdatePostBody): Promise<Post> {
        const { authorId, ...rest } = data;
        return this.db.post.update({
            where: { id },
            data: {
                ...rest,
                ...(authorId && { author: { connect: { id: authorId } } }),
            },
        });
    }

    /**
     * @method delete
     * @description Deletes a post record from the database.
     * @param {string} id - The ID of the post to delete.
     * @returns {Promise<Post>} A promise that resolves to the deleted post.
     */
    async delete(id: string): Promise<Post> {
        return this.db.post.delete({
            where: { id },
        });
    }
}
