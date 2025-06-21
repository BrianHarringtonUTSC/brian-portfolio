import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import { MongoClient } from "mongodb";

// Create MongoDB client for NextAuth adapter
const client = new MongoClient(process.env.MONGODB_URI!);
const clientPromise = client.connect();

// Admin user configuration
interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

// Hardcoded admin users - in production, store these in database
const ADMIN_USERS = [
  {
    id: "1",
    email: "admin@example.com",
    name: "Admin User",
    password: "$2b$12$p6BKtvyncir4ePxYZkgE5./0JwL2i4Gj17zygBNaiX0KkvhAs4x.i", // "admin123"
    role: "admin",
  },
];

const handler = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.warn("Login attempt with missing credentials");
          return null;
        }

        // Find admin user
        const user = ADMIN_USERS.find((u) => u.email === credentials.email);
        if (!user) {
          console.warn(
            `Login attempt for non-existent user: ${credentials.email}`
          );
          return null;
        }

        // Verify password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) {
          console.warn(
            `Invalid password attempt for user: ${credentials.email}`
          );
          return null;
        }

        console.info(`Successful login for user: ${credentials.email}`);
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // 1 hour
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.loginTime = Date.now();
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        (session.user as any).role = token.role;
        (session.user as any).loginTime = token.loginTime;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login", // Redirect errors back to login
  },
  events: {
    async signIn({ user, isNewUser }) {
      console.info(`User signed in: ${user.email} (new: ${isNewUser})`);
    },
    async signOut({ token }) {
      console.info(`User signed out: ${token?.email}`);
    },
  },
});

export { handler as GET, handler as POST };
