import NextAuth from 'next-auth';

// Import directly from next-auth/jwt and next-auth/core
// to avoid TypeScript errors
export const dynamic = 'force-dynamic'; // Make sure the route is dynamic
export const runtime = 'nodejs'; // Use Node.js runtime

// Simple hardcoded auth handler for admin login
const handler = NextAuth({
  providers: [
    {
      id: 'credentials',
      name: 'Credentials',
      type: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          console.log("Login attempt:", credentials?.username);
          
          // Check admin credentials from env vars
          if (
            credentials?.username === process.env.ADMIN_USERNAME &&
            credentials?.password === process.env.ADMIN_PASSWORD
          ) {
            console.log("Login successful for admin");
            return {
              id: "1",
              name: "Admin",
              email: "admin@example.com",
              role: "admin"
            };
          }
          
          console.log("Login failed");
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    },
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role as string;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
});

// Export for API route
export { handler as GET, handler as POST }; 