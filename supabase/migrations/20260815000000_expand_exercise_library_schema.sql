-- Adds structured coaching content (beyond the single free-text description) so the
-- exercise info modal can show How to Perform / What Muscles Work / Tips / Common
-- Mistakes as distinct sections, and dedupes name so future seed migrations can safely
-- use ON CONFLICT instead of guessing whether a row already exists from a prior
-- out-of-repo insert.
alter table exercises add column how_to_perform text;
alter table exercises add column muscles_worked text;
alter table exercises add column tips text;
alter table exercises add column common_mistakes text;

alter table exercises add constraint exercises_name_key unique (name);
