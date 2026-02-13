import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://sealcisjhqlrpmuescsu.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlYWxjaXNqaHFscnBtdWVzY3N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjAzNDAsImV4cCI6MjA1NTEzNjM0MH0.MVjb3yKu8FGSdMFME-BmjGS8JEgJnJVG-hlDuj2bZPM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
