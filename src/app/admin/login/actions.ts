'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { 
  setAdminSession, 
  clearAdminSession, 
  isAuthorizedAdminEmail 
} from '@/lib/auth/adminAuth';

export interface AdminLoginState {
  error?: string;
  success?: boolean;
}

export async function adminLoginAction(
  prevState: AdminLoginState | null,
  formData: FormData
): Promise<AdminLoginState> {
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Please provide both email and password.' };
  }

  // 1. Check Master Admin Password fallback (if configured)
  const masterPassword = process.env.ADMIN_PASSWORD;
  if (masterPassword && password === masterPassword) {
    // If master password matches and email is authorized (or default admin)
    if (isAuthorizedAdminEmail(email)) {
      await setAdminSession(email);
      redirect('/admin');
    } else {
      // If master password is correct but entered email is not in whitelist,
      // you can still allow access with the designated primary admin email or reject
      return { 
        error: `The email "${email}" is not authorized for administrative access.` 
      };
    }
  }

  // 2. Authenticate via Supabase Auth
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return { 
        error: 'Invalid administrator email or password.' 
      };
    }

    const userEmail = data.user.email?.toLowerCase();
    const isRoleAdmin = 
      data.user.user_metadata?.role === 'admin' || 
      data.user.app_metadata?.role === 'admin';
    const isEmailAllowed = isAuthorizedAdminEmail(userEmail);

    if (!isRoleAdmin && !isEmailAllowed) {
      // User is valid in Supabase, but NOT an admin
      await supabase.auth.signOut();
      return { 
        error: 'Access denied: This account does not possess administrator privileges.' 
      };
    }

    // Set signed HTTP-only admin session
    await setAdminSession(userEmail || email);
  } catch (err: any) {
    // If Next.js redirect threw, re-throw it so Next.js handles navigation
    if (err?.digest?.startsWith?.('NEXT_REDIRECT')) {
      throw err;
    }
    console.error('Login action error:', err);
    return { 
      error: 'An unexpected authentication error occurred. Please try again.' 
    };
  }

  redirect('/admin');
}

export async function adminLogoutAction() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.warn('Supabase sign out warning:', err);
  }

  await clearAdminSession();
  redirect('/admin/login');
}
