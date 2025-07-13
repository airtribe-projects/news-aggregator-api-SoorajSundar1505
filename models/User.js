const bcrypt = require('bcrypt');
const config = require('../config/config');

// In-memory storage for users (in production, use a database)
const users = [];

class User {
    constructor(name, email, password, preferences = []) {
        this.id = Date.now().toString();
        this.name = name;
        this.email = email;
        this.password = password;
        this.preferences = preferences;
        this.createdAt = new Date();
    }

    static async create(name, email, password, preferences = []) {
        // Check if user already exists
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, config.bcryptRounds);
        
        // Create new user
        const user = new User(name, email, hashedPassword, preferences);
        users.push(user);
        
        return user;
    }

    static async findByEmail(email) {
        return users.find(user => user.email === email);
    }

    static findById(id) {
        return users.find(user => user.id === id);
    }

    async comparePassword(password) {
        return bcrypt.compare(password, this.password);
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            preferences: this.preferences,
            createdAt: this.createdAt
        };
    }
}

module.exports = User; 