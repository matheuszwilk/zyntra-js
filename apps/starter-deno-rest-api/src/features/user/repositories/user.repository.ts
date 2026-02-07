import { PrismaClient, User } from "@prisma/client";
import { CreateUserBody, UpdateUserBody } from "../user.interfaces";

/**
 * @class UserRepository
 * @description Centralizes all database operations for the User entity using Prisma.
 */
export class UserRepository {
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
     * @description Retrieves a list of all users.
     * @returns {Promise<User[]>} A promise that resolves to an array of users.
     */
    async list(): Promise<User[]> {
        return this.db.user.findMany({
            orderBy: { id: "asc" },
        });
    }

    /**
     * @method getById
     * @description Retrieves a single user by their unique ID.
     * @param {string} id - The unique ID of the user.
     * @returns {Promise<User | null>} A promise that resolves to the user if found, or null otherwise.
     */
    async getById(id: string): Promise<User | null> {
        return this.db.user.findUnique({
            where: { id },
        });
    }

    /**
     * @method create
     * @description Creates a new user record in the database.
     * @param {CreateUserBody} data - The data for the new user.
     * @returns {Promise<User>} A promise that resolves to the created user.
     */
    async create(data: CreateUserBody): Promise<User> {
        return this.db.user.create({
            data,
        });
    }

    /**
     * @method update
     * @description Updates an existing user record in the database.
     * @param {string} id - The ID of the user to update.
     * @param {UpdateUserBody} data - The data to update.
     * @returns {Promise<User>} A promise that resolves to the updated user.
     */
    async update(id: string, data: UpdateUserBody): Promise<User> {
        return this.db.user.update({
            where: { id },
            data,
        });
    }

    /**
     * @method delete
     * @description Deletes a user record from the database.
     * @param {string} id - The ID of the user to delete.
     * @returns {Promise<User>} A promise that resolves to the deleted user.
     */
    async delete(id: string): Promise<User> {
        return this.db.user.delete({
            where: { id },
        });
    }
}
