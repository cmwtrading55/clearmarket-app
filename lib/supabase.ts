import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://sealcisjhqlrpmuescsu.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlYWxjaXNqaHFscnBtdWVzY3N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MDUwNDYsImV4cCI6MjA4NjQ4MTA0Nn0.P_hNdWsn1O7wz4j25-ji1dQ_lJwviWgG5NXF6LcObiA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
