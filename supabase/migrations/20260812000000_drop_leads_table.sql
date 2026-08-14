-- The leads table backed an old Instagram-DM lead-capture form (/api/form) that
-- has since been removed from the app and was never called from any external
-- site either. Dropping it now that nothing reads or writes to it.
drop table if exists leads;
