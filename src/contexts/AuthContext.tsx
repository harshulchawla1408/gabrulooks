import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface AuthContextType {
  session: Session | null;
  user: User | null;
  role: AppRole | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  role: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRole = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc("get_user_role", { _user_id: userId });
      if (!error && data) {
        setRole(data);
      } else {
        setRole("user");
      }
    } catch {
      setRole("user");
    }
  };

  const ensureProfileExists = async (currentUser: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', currentUser.id)
        .maybeSingle();
      
      if (!data && !error) {
        // Profile doesn't exist, create it
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            user_id: currentUser.id,
            email: currentUser.email || '',
            full_name: currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || '',
            avatar_url: currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture || '',
            provider: currentUser.app_metadata?.provider || 'unknown',
          });
          
        if (insertError) {
          console.error('Error creating profile on frontend:', insertError);
        }
      }
    } catch (err) {
      console.error('Ensure profile exists error:', err);
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Listener for ONGOING auth changes (does NOT control loading)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!isMounted) return;
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchRole(session.user.id);
          ensureProfileExists(session.user);
        } else {
          setRole(null);
        }
      }
    );

    // INITIAL load — await role before setting loading false
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchRole(session.user.id);
          ensureProfileExists(session.user);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ session, user, role, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
