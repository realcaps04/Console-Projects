CREATE TABLE IF NOT EXISTS public.project_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    college_name TEXT,
    project_type TEXT NOT NULL,
    project_title TEXT NOT NULL,
    description TEXT,
    deadline DATE,
    budget_range TEXT,
    referral_code TEXT,
    abstract_url TEXT,
    design_link TEXT,
    design_file_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies (optional but recommended)
ALTER TABLE public.project_requests ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anyone (public form)
DROP POLICY IF EXISTS "Allow public insert" ON public.project_requests;
CREATE POLICY "Allow public insert" ON public.project_requests FOR INSERT WITH CHECK (true);

-- Allow admins to view all (assuming admin role exists, or just open for now/authenticated)
-- For now, allowing read access to authenticated users (admins) implies we need to know who is admin.
-- We will just leave it open for insert for now.
