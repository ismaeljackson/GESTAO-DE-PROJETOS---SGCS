import { supabase } from './supabase.js';

export const auth = {
  async login(email, password) {
    return await supabase.auth.signInWithPassword({ email, password });
  },
  async register(email, password, userData) {
    return await supabase.auth.signUp({ email, password, options: { data: userData } });
  },
  async logout() {
    return await supabase.auth.signOut();
  },
  async getSession() {
    return await supabase.auth.getSession();
  },
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};
