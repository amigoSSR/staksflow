/**
 * services/authService.js
 * Clean auth layer: register + login using bcrypt and Prisma.
 */
const bcrypt = require('bcryptjs');
const prisma = require('../prisma/client');

const SALT_ROUNDS = 12;

/**
 * Register a new user.
 * @returns {Object} created user (without password)
 */
const register = async ({ username, email, password }) => {
  username = username.trim().toLowerCase(); // Normalize to lowercase for SQLite case-insensitivity
  email    = email.trim().toLowerCase();

  // Check existing (normalized check)
  const existingUser = await prisma.user.findFirst({ 
    where: { 
      OR: [
        { username: username }, // Already lowercased
        // No mode: 'insensitive' for SQLite in Prisma, so we rely on normalization
      ]
    } 
  });
  if (existingUser) throw new Error('Username sudah digunakan');

  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) throw new Error('Email sudah terdaftar');

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);

  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      password: hashed,
      role: 'user'
    }
  });

  return { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role };
};

/**
 * Login a user by username or email.
 * @returns {Object} user (without password)
 */
const login = async ({ identifier, password }) => {
  const originalIdentifier = identifier.trim();
  const lowerIdentifier = originalIdentifier.toLowerCase();

  // SQLite is case-sensitive. We check original for existing mixed-case usernames 
  // and lowercase for emails/newly normalized usernames.
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: lowerIdentifier },
        { username: lowerIdentifier },
        { username: originalIdentifier }
      ]
    }
  });

  if (!user) throw new Error('Username / email tidak ditemukan');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Password salah');

  return { id: user.id, username: user.username, email: user.email, role: user.role };
};

/**
 * Find user by ID.
 */
const findById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    select: { id: true, username: true, email: true, role: true, created_at: true }
  });
};

module.exports = { register, login, findById };
