import type {NextAuthOptions} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import {loginUser} from '@/app/services/auth/authService';

// Shape of the user object we want to store inside NextAuth JWT/session.
interface AuthorizedUser {
    id: string;
    email: string;
    name: string;
    role?: string;
    accessToken: string;
    refreshToken?: string;
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            // These fields are sent from signIn("credentials", { email, password }).
            credentials: {
                email: {label: 'Email', type: 'text'},
                password: {label: 'Password', type: 'password'},
            },
            async authorize(credentials) {
                console.log('#25', credentials);
                // Returning null tells NextAuth: invalid login.
                if (!credentials?.email || !credentials?.password) return null;

                try {
                    // Call your backend login API.
                    const response = await loginUser({
                        email: credentials?.email ?? '',
                        password: credentials?.password ?? '',
                    });

                    const authData = response?.data ?? response;

                    // Defensive check: only create a session when API returns required fields.
                    if (!authData?.loggedInUser || !authData?.accessToken) return null;

                    const user = authData.loggedInUser;
                    // Anything returned here becomes `user` in the jwt callback (first login only).
                    return {
                        id: user._id,
                        email: user.email,
                        name: user.fullName,
                        role: user.role,
                        accessToken: authData.accessToken,
                        refreshToken: user.refreshToken,
                    } as AuthorizedUser;
                } catch (error) {
                    console.error('Credentials authorize failed:', error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({token, user}) {
            // Runs on sign in + on every session access. Persist custom fields in JWT.
            if (user) {
                const authorizedUser = user as AuthorizedUser;
                token.id = authorizedUser.id;
                token.role = authorizedUser.role;
                token.accessToken = authorizedUser.accessToken;
                token.refreshToken = authorizedUser.refreshToken;
            }

            return token;
        },
        async session({session, token}) {
            // Expose JWT fields to client via `useSession()` and server via `getServerSession()`.
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string | undefined;
            }
            session.accessToken = token.accessToken as string | undefined;
            session.refreshToken = token.refreshToken as string | undefined;
            return session;
        },
    },
    session: {
        // Store session in encrypted JWT cookie instead of DB.
        strategy: 'jwt',
    },
    // Explicit secret helps avoid env confusion and JWT decryption issues.
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        // Use your custom page, not NextAuth default page.
        signIn: '/auth/login',
        error: '/auth/login',
    },
};
