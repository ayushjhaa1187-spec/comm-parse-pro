-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Parsed Documents table
CREATE TABLE IF NOT EXISTS public.parsed_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  source_type TEXT NOT NULL DEFAULT 'email',
  parsed_data JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.parsed_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own parsed_documents" ON public.parsed_documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own parsed_documents" ON public.parsed_documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own parsed_documents" ON public.parsed_documents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own parsed_documents" ON public.parsed_documents FOR DELETE USING (auth.uid() = user_id);

-- Analysis Results table
CREATE TABLE IF NOT EXISTS public.analysis_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES public.parsed_documents(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL DEFAULT 'general',
  results JSONB DEFAULT '{}',
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analysis_results" ON public.analysis_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own analysis_results" ON public.analysis_results FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own analysis_results" ON public.analysis_results FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own analysis_results" ON public.analysis_results FOR DELETE USING (auth.uid() = user_id);

-- Chat History table
CREATE TABLE IF NOT EXISTS public.chat_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  session_id UUID NOT NULL DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own chat_history" ON public.chat_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own chat_history" ON public.chat_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own chat_history" ON public.chat_history FOR DELETE USING (auth.uid() = user_id);

-- Updated_at triggers for new tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_parsed_documents_updated_at
  BEFORE UPDATE ON public.parsed_documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_analysis_results_updated_at
  BEFORE UPDATE ON public.analysis_results
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
