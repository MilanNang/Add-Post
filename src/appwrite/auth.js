import conf from '../conf/conf.js';
import { Client, Account, ID } from "appwrite";

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId); // Set project ID
        this.account = new Account(this.client);
    }

    // Create an account and immediately log the user in
    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                // Call login after successful account creation
                return this.login({ email, password });
            } else {
                throw new Error("User account creation failed");
            }
        } catch (error) {
            console.error("Error creating account:", error);
            throw new Error(error.message || "Failed to create account");
        }
    }

    // Log in the user with email and password
    async login({ email, password }) {
        try {
            const session = await this.account.createEmailPasswordSession(email, password);
            return session;
        } catch (error) {
            console.error("Error logging in:", error);
            throw new Error(error.message || "Failed to log in");
        }
    }

    // Get current authenticated user
    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.error("Appwrite service :: getCurrentUser :: error:", error);
            throw new Error("Unable to fetch the current user");
        }
    }

    // Log out the current user
    async logout() {
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.error("Appwrite service :: logout :: error:", error);
            throw new Error("Logout failed");
        }
    }
}

const authService = new AuthService();

export default authService;
