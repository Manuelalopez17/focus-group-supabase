import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qsooabikqhxruxteudsv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzb29hYmlrcWh4cnV4dGV1ZHN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NTEwMzQsImV4cCI6MjA2ODAyNzAzNH0.9AM1gvODsfSGaWBXerGMVnGwNTsrStxNzRl0m_fjzVU'

export const supabase = createClient(supabaseUrl, supabaseKey)
