// ✅ Import Supabase
import { createClient } from "https://esm.sh/@supabase/supabase-js";

// ✅ Supabase Configuration
const supabaseUrl = "https://bzdczktvzkedsptxojrw.supabase.co"; // Your Supabase URL
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6ZGN6a3R2emtlZHNwdHhvanJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5OTQ3NjksImV4cCI6MjA1NjU3MDc2OX0.RzCWvFmyrpL6JiFC-Lno8ozryekHJOSeRxnhjhKVh9g"; // Replace with your actual anon key

// ✅ Initialize Supabase Client (Frontend)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log("🟢 Supabase Initialized in supabase.js");
