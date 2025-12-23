
-- Enable Realtime for fall_risk_assessments
BEGIN;
  -- Check if publication exists, if not create it (standard supabase 'supabase_realtime' usually exists)
  -- But we can just alter it.
  ALTER PUBLICATION supabase_realtime ADD TABLE fall_risk_assessments;
COMMIT;
