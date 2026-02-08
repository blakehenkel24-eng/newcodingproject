-- Leads table for capturing email subscribers and resource downloads
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    name TEXT,
    company TEXT,
    source TEXT NOT NULL,
    resource_downloaded TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    subscribed BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create unique index on email to prevent duplicates
CREATE UNIQUE INDEX idx_leads_email ON leads(email);

-- Create index for common queries
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_resource ON leads(resource_downloaded) WHERE resource_downloaded IS NOT NULL;

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Only service role can access leads (no direct user access)
CREATE POLICY "Service role can manage leads" ON leads
    FOR ALL 
    USING (true)
    WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_leads_timestamp
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_leads_updated_at();
