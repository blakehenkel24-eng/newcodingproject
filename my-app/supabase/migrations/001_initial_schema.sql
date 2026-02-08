-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    display_name TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    daily_generation_count INTEGER DEFAULT 0,
    last_generation_date DATE,
    tier TEXT DEFAULT 'free'
);

-- Slides table
CREATE TABLE slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    context_input TEXT NOT NULL,
    message_input TEXT NOT NULL,
    data_input TEXT,
    file_input_url TEXT,
    slide_type TEXT NOT NULL,
    target_audience TEXT NOT NULL,
    density_mode TEXT NOT NULL,
    llm_blueprint JSONB NOT NULL,
    selected_template TEXT NOT NULL,
    template_props JSONB NOT NULL,
    feedback TEXT,
    regeneration_count INTEGER DEFAULT 0,
    llm_model_used TEXT,
    generation_time_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE slides ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Slides: Users can only access their own slides
CREATE POLICY "Users can view own slides" ON slides
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own slides" ON slides
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own slides" ON slides
    FOR UPDATE USING (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
