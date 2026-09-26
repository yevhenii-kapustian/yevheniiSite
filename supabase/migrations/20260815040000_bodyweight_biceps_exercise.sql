-- "Bodyweight only" equipment + a 4 or 5+ day split lands on Biceps as its own training
-- day/slot, but the library had zero Bodyweight-tagged Biceps exercises — the generator
-- silently skipped the slot (empty pool -> continue), so those users got a workout
-- missing biceps entirely with no error or indication anything was wrong. This adds one
-- real bodyweight biceps movement so the slot always has something to hand back.
insert into exercises (name, muscle_group, equipment, description, how_to_perform, muscles_worked, tips, common_mistakes) values

('Towel Curl', 'Biceps', 'Bodyweight',
 'A self-resistance curl using a towel — one arm curls while the other arm pulls down through the towel to create load, letting you train biceps with zero equipment.',
 'Hold one end of a towel in each hand, arms extended down in front of you.
Curl one hand up toward your shoulder while pulling down hard on the towel with the other hand to create resistance.
Lower with control, then repeat for the same arm before switching sides.',
 'Biceps, Forearms',
 'The resistance is entirely self-generated — the harder you pull down with the bracing arm, the harder the curling arm has to work.
Keep the pulling arm''s tension steady through the whole rep instead of easing off near the top.',
 'Letting the bracing arm go slack, which turns the movement into an unloaded air curl.
Rushing the tempo instead of controlling both the lift and the lower.')

on conflict (name) do update set
    muscle_group = excluded.muscle_group,
    equipment = excluded.equipment,
    description = excluded.description,
    how_to_perform = excluded.how_to_perform,
    muscles_worked = excluded.muscles_worked,
    tips = excluded.tips,
    common_mistakes = excluded.common_mistakes;
