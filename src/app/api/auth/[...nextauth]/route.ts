import NextAuth from 'next-auth';
import { authOptions } from '@/app/config/auth_options.config';

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
