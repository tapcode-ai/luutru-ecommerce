import { v4 as uuidv4 } from "uuid";
import { User, RegisterDTO, LoginDTO, AuthResponse, Address } from "../types";
import { mockUsers } from "./mockData";

let users: User[] = [...mockUsers];

// Simple hash simulation (in production use bcrypt)
function hashPassword(password: string): string {
  return `$2a$10$${Buffer.from(password).toString("base64").slice(0, 53)}`;
}

function comparePassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

function generateToken(userId: string, email: string, role: string): string {
  // Simple JWT-like token (in production use jsonwebtoken)
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64");
  const payload = Buffer.from(
    JSON.stringify({
      userId,
      email,
      role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 3600, // 7 days
    })
  ).toString("base64");
  const signature = Buffer.from(`${header}.${payload}.luutru-secret-key`).toString("base64");
  return `${header}.${payload}.${signature}`;
}

function sanitizeUser(user: User): Omit<User, "password"> {
  const { password, ...safeUser } = user;
  return safeUser;
}

export const userService = {
  register(dto: RegisterDTO): AuthResponse {
    const existing = users.find((u) => u.email === dto.email);
    if (existing) {
      throw new Error("Email đã được đăng ký");
    }

    const user: User = {
      id: `user-${uuidv4().slice(0, 8)}`,
      email: dto.email,
      password: hashPassword(dto.password),
      fullName: dto.fullName,
      phone: dto.phone,
      role: "user",
      addresses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(user);
    const token = generateToken(user.id, user.email, user.role);

    return {
      user: sanitizeUser(user),
      token,
    };
  },

  login(dto: LoginDTO): AuthResponse {
    const user = users.find((u) => u.email === dto.email);
    if (!user) {
      throw new Error("Email hoặc mật khẩu không đúng");
    }

    if (!comparePassword(dto.password, user.password)) {
      throw new Error("Email hoặc mật khẩu không đúng");
    }

    const token = generateToken(user.id, user.email, user.role);
    return {
      user: sanitizeUser(user),
      token,
    };
  },

  getById(id: string): Omit<User, "password"> | undefined {
    const user = users.find((u) => u.id === id);
    if (!user) return undefined;
    return sanitizeUser(user);
  },

  updateProfile(
    id: string,
    data: { fullName?: string; phone?: string; avatar?: string }
  ): Omit<User, "password"> | null {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    users[index] = {
      ...users[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return sanitizeUser(users[index]);
  },

  addAddress(userId: string, address: Omit<Address, "id">): Address | null {
    const user = users.find((u) => u.id === userId);
    if (!user) return null;

    const newAddress: Address = {
      ...address,
      id: `addr-${uuidv4().slice(0, 8)}`,
    };

    if (newAddress.isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
    }

    user.addresses.push(newAddress);
    user.updatedAt = new Date().toISOString();
    return newAddress;
  },

  updateAddress(
    userId: string,
    addressId: string,
    data: Partial<Address>
  ): Address | null {
    const user = users.find((u) => u.id === userId);
    if (!user) return null;

    const index = user.addresses.findIndex((a) => a.id === addressId);
    if (index === -1) return null;

    if (data.isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
    }

    user.addresses[index] = { ...user.addresses[index], ...data };
    user.updatedAt = new Date().toISOString();
    return user.addresses[index];
  },

  deleteAddress(userId: string, addressId: string): boolean {
    const user = users.find((u) => u.id === userId);
    if (!user) return false;

    const index = user.addresses.findIndex((a) => a.id === addressId);
    if (index === -1) return false;

    user.addresses.splice(index, 1);
    user.updatedAt = new Date().toISOString();
    return true;
  },

  verifyToken(token: string): { userId: string; email: string; role: string } | null {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;

      const payload = JSON.parse(
        Buffer.from(parts[1], "base64").toString()
      );

      if (payload.exp < Math.floor(Date.now() / 1000)) {
        return null; // Token expired
      }

      return {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      };
    } catch {
      return null;
    }
  },
};