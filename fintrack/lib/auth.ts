import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    jwt?: string;
    userId?: number;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Strapi",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                identifier: credentials.email,
                password: credentials.password,
              }),
            }
          );
          if (!res.ok) return null;
          const { jwt, user } = await res.json();
          return { id: String(user.id), email: user.email, name: user.username, jwt };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.jwt = (user as { jwt: string }).jwt;
        token.userId = Number((user as { id: string }).id);
      }
      return token;
    },
    session({ session, token }) {
      return {
        ...session,
        jwt: token.jwt as string | undefined,
        userId: token.userId as number | undefined,
      };
    },
  },
  pages: {
    signIn: "/login",
  },
});
