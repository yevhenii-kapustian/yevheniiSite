-- Expands Chest and Back to a fuller rotation pool with structured coaching content.
-- Uses ON CONFLICT so this also backfills the new fields onto exercises that already
-- exist in the live DB from earlier, untracked manual inserts (see migration
-- 20260815000000 for why the unique constraint on name exists).

insert into exercises (name, muscle_group, equipment, description, how_to_perform, muscles_worked, tips, common_mistakes) values

('Barbell Bench Press', 'Chest', 'Barbell',
 'The classic barbell press for raw pressing strength and chest mass.',
 'Lie on a flat bench with eyes under the bar.
Grip the bar just wider than shoulder-width.
Unrack and lower it to your mid-chest with elbows at roughly 45°.
Drive it back up in a straight line to full lockout.',
 'Chest, Front Deltoids, Triceps',
 'Keep your shoulder blades pinned together and feet planted the whole set.
Touch the same spot on your chest every rep for consistency.',
 'Letting the bar drift toward your face instead of your chest.
Bouncing the bar off your chest instead of controlling it.
Flaring elbows out to a full 90°, which stresses the shoulders.'),

('Incline Bench Press', 'Chest', 'Barbell',
 'A 30-45° incline press that shifts emphasis onto the upper chest.',
 'Set the bench to a 30-45° incline.
Grip the bar slightly wider than shoulder-width.
Lower it to your upper chest with elbows at roughly 45°.
Press back up in a straight line.',
 'Upper Chest, Front Deltoids, Triceps',
 'A steeper incline shifts more work to the front shoulders, so keep it moderate.
Drive your feet into the floor for a stable base.',
 'Setting the incline too steep and turning it into a shoulder press.
Lowering the bar to the neck instead of the upper chest.'),

('Decline Barbell Bench Press', 'Chest', 'Barbell',
 'A decline press that targets the lower chest fibers.',
 'Secure your legs at the end of a decline bench.
Grip the bar just wider than shoulder-width.
Lower it to your lower chest with control.
Press back up to full lockout.',
 'Lower Chest, Triceps, Front Deltoids',
 'Move slightly slower than flat bench — the shorter range makes it easy to rush.
Have a spotter or use a rack with safety pins.',
 'Bouncing the bar off the chest.
Lowering the bar too high toward the collarbone, which undoes the decline benefit.'),

('Dumbbell Bench Press', 'Chest', 'Dumbbell',
 'A dumbbell press that allows a deeper stretch and more natural bar path than a barbell.',
 'Lie on a flat bench holding a dumbbell in each hand at chest level, palms facing forward.
Press both dumbbells up until your arms are extended.
Lower with control back to chest level.',
 'Chest, Front Deltoids, Triceps',
 'Keep your wrists stacked directly over your elbows throughout.
Let the dumbbells travel slightly inward at the top without clanking together.',
 'Letting the dumbbells drift too wide and losing shoulder stability.
Arching the lower back excessively to move heavier weight.'),

('Incline Dumbbell Press', 'Chest', 'Dumbbell',
 'The dumbbell version of the incline press, with a bigger stretch at the bottom.',
 'Set the bench to a 30-45° incline.
Start with dumbbells at shoulder height, palms forward.
Press up until arms are extended without locking out hard.
Lower under control to the stretch position.',
 'Upper Chest, Front Deltoids, Triceps',
 'Keep the incline moderate — too steep turns this into a shoulder exercise.
Pause briefly at the bottom instead of bouncing out of the stretch.',
 'Using an incline that is too steep.
Letting the elbows flare out past 90° at the bottom, straining the shoulders.'),

('Dumbbell Chest Fly', 'Chest', 'Dumbbell',
 'An isolation move that stretches and squeezes the chest without triceps taking over.',
 'Lie on a flat bench holding dumbbells above your chest with a slight bend in your elbows.
Lower the weights out to the sides in a wide arc until you feel a stretch across your chest.
Bring them back together over your chest, squeezing at the top.',
 'Chest',
 'Keep that same slight elbow bend locked in for the whole set — don''t turn it into a press.
Go lighter than you think; this movement punishes ego lifting.',
 'Letting the elbows drop below shoulder level, which stresses the shoulder joint.
Bending the elbows more as the set goes on, turning it into a press.'),

('Cable Crossover', 'Chest', 'Cable',
 'A cable fly variation that keeps constant tension on the chest through the whole range.',
 'Set both cable pulleys above head height and grab a handle in each hand.
Step forward into a slight split stance, arms out wide with a slight elbow bend.
Pull the handles down and together in front of your hips.
Return slowly to the stretch position.',
 'Chest, Front Deltoids',
 'Cross your hands slightly at the bottom for a stronger peak contraction.
Lean forward slightly from the hips to keep tension on the chest, not the shoulders.',
 'Using the legs and momentum to swing the weight through.
Standing too upright, which shifts the work to the front delts.'),

('Cable Chest Press', 'Chest', 'Cable',
 'A cable press that keeps tension on the chest even at full lockout, unlike a barbell.',
 'Set both pulleys to chest height and stand in the middle in a staggered stance.
Grab a handle in each hand at chest level.
Press both handles forward until your arms are extended.
Return with control back to chest level.',
 'Chest, Front Deltoids, Triceps',
 'Keep a slight forward lean and braced core for stability.
Squeeze your chest at full extension instead of just locking your elbows.',
 'Letting the back foot creep forward, losing the stable base.
Shrugging the shoulders up toward the ears during the press.'),

('Machine Chest Press', 'Chest', 'Machine',
 'A guided press that lets you focus purely on the chest without balancing free weights.',
 'Adjust the seat so the handles line up with mid-chest height.
Grip the handles with elbows at roughly 45°.
Press forward until your arms are extended without locking out hard.
Return under control to the start position.',
 'Chest, Front Deltoids, Triceps',
 'Set the seat height first — it matters more on this machine than the weight you pick.
Keep your back flat against the pad the whole set.',
 'Setting the seat too low, which turns the press into a shoulder-dominant movement.
Letting the weight stack slam down between reps instead of controlling the negative.'),

('Pec Deck Fly', 'Chest', 'Machine',
 'A machine fly that isolates the chest with a fixed, safe range of motion.',
 'Sit with your back flat against the pad, forearms on the arm pads.
Bring your arms together in front of your chest, squeezing hard.
Open back out slowly to the stretch position.',
 'Chest',
 'Squeeze and hold for a second at the fully closed position.
Keep a slight bend in the elbows throughout — don''t let it become a press.',
 'Using so much weight that the reps turn into short, jerky pulses.
Letting the shoulders roll forward instead of staying pinned back.'),

('Push-Up', 'Chest', 'Bodyweight',
 'The foundational bodyweight chest press — no equipment needed, endlessly scalable.',
 'Start in a plank with hands slightly wider than shoulders.
Lower your chest to the floor keeping your body in a straight line.
Press back up to the starting position.',
 'Chest, Front Deltoids, Triceps, Abs',
 'Keep your core tight so your hips don''t sag or pike up.
Squeeze your glutes to help keep your body in a straight line.',
 'Letting the hips sag toward the floor.
Flaring the elbows out to a full 90° instead of a moderate angle.'),

('Incline Push-Up', 'Chest', 'Bodyweight',
 'An easier push-up regression using an elevated surface to reduce the load.',
 'Place your hands on a bench, step, or sturdy elevated surface, feet on the floor.
Lower your chest toward the surface.
Press back up to the start position.',
 'Chest, Front Deltoids, Triceps',
 'The higher the surface, the easier the rep — pick a height that lets you hit 10-12 reps with good form.
Keep the same straight-body line as a standard push-up.',
 'Letting the hips pike up to make the movement easier without realizing it.
Using a surface so high that it stops challenging the chest at all.'),

('Decline Push-Up', 'Chest', 'Bodyweight',
 'A harder push-up variation with feet elevated, shifting more load to the upper chest.',
 'Place your feet on a bench or step, hands on the floor slightly wider than shoulders.
Lower your chest toward the floor with control.
Press back up to the start position.',
 'Upper Chest, Front Deltoids, Triceps',
 'Keep your core braced hard — the elevated feet make it easier to sag at the hips.
Start with a lower surface and work up as it gets easier.',
 'Letting the hips drop as fatigue sets in.
Placing the feet so high that the movement becomes more of a shoulder press.'),

('Deadlift', 'Back', 'Barbell',
 'The king of pulling movements — full posterior chain strength in one lift.',
 'Stand with feet hip-width, bar over mid-foot.
Hinge down and grip just outside your legs, chest up and back flat.
Drive through the floor with your legs, keeping the bar close to your body.
Finish standing tall with hips through.',
 'Back, Glutes, Hamstrings, Forearms',
 'Keep the bar dragging up your shins and thighs the whole pull.
Take the slack out of the bar before you pull — you should hear/feel it "click" tight.',
 'Rounding the lower back to start the pull.
Letting the bar drift away from the body, turning it into a bad-leverage row.
Hyperextending the back at the top instead of just standing tall.'),

('Barbell Row', 'Back', 'Barbell',
 'A heavy, bent-over row for total back thickness.',
 'Hinge forward from the hips to about 45°, bar hanging at arm''s length, back flat.
Pull the bar toward your lower ribs, squeezing your shoulder blades together.
Lower under control back to the start.',
 'Back, Biceps, Rear Deltoids',
 'Keep the same torso angle the entire set — don''t stand up to move more weight.
Pull with your elbows, not your hands.',
 'Using momentum or standing up between reps to cheat the weight up.
Rounding the lower back under load.'),

('Pendlay Row', 'Back', 'Barbell',
 'A strict, dead-stop row that removes momentum entirely and builds raw back power.',
 'Set up with your torso close to parallel with the floor, bar on the ground.
Grip just outside your legs and pull explosively to your lower ribs.
Lower the bar all the way back to the floor each rep, resetting your position.',
 'Back, Biceps, Rear Deltoids',
 'Reset your full setup every single rep — that dead stop is the point of the exercise.
Keep your torso angle fixed and pull with your elbows.',
 'Turning it into a touch-and-go row instead of a full dead-stop reset.
Letting the hips rise as you pull, turning it into a partial deadlift.'),

('T-Bar Row', 'Back', 'Machine',
 'A supported row that lets you load heavy back thickness work without lower-back fatigue.',
 'Straddle the T-bar with a chest pad supporting your torso, if available.
Grip the handles and pull the weight toward your lower ribs.
Lower under control to a full stretch.',
 'Back, Biceps, Rear Deltoids',
 'Squeeze your shoulder blades together hard at the top of every rep.
Keep your chest against the pad rather than rocking to generate momentum.',
 'Yanking the weight up with the lower back instead of pulling with the lats.
Using a grip so wide it turns into a shrug.'),

('Lat Pulldown', 'Back', 'Cable',
 'A vertical pulling movement that builds lat width, ideal for those without pull-up strength yet.',
 'Grip the bar wider than shoulder-width, sit with thighs secured under the pad.
Pull the bar down to your upper chest by driving your elbows down and back.
Let it return under control.',
 'Back, Biceps, Rear Deltoids',
 'Lead the pull with your elbows, not your hands.
Keep a slight backward lean, not an exaggerated one.',
 'Leaning back excessively and using body weight to yank the bar down.
Pulling the bar behind the neck, which is hard on the shoulders.'),

('Seated Cable Row', 'Back', 'Cable',
 'A horizontal row that builds mid-back thickness with constant cable tension.',
 'Sit at the cable row station with knees slightly bent, feet on the platform.
Grip the handle and pull it to your torso, squeezing your shoulder blades together.
Extend your arms back out with control, allowing a full stretch.',
 'Back, Biceps, Rear Deltoids',
 'Keep your torso still — the movement should come from your arms and shoulder blades, not your back rocking.
Pause briefly at full contraction.',
 'Rocking the torso back and forth to add momentum.
Rounding the shoulders forward at the stretch instead of staying tall.'),

('Single-Arm Dumbbell Row', 'Back', 'Dumbbell',
 'A one-sided row that lets you focus on each side of the back individually and correct imbalances.',
 'Place one knee and hand on a bench, other foot on the floor.
Hold a dumbbell in your free hand, arm hanging straight down.
Pull the dumbbell to your hip, squeezing your shoulder blade back.
Lower with control to a full stretch.',
 'Back, Biceps, Rear Deltoids',
 'Keep your back flat and roughly parallel to the floor throughout.
Pull your elbow up and back, not out to the side.',
 'Twisting the torso to help heave the weight up.
Using a weight so heavy the range of motion shrinks to a few inches.'),

('Dumbbell Bent Over Row', 'Back', 'Dumbbell',
 'A two-arm bent-over row for building back thickness with dumbbells.',
 'Hinge forward from the hips holding a dumbbell in each hand, back flat.
Pull the dumbbells toward your lower ribs, squeezing your shoulder blades together.
Lower with control.',
 'Back, Biceps, Rear Deltoids',
 'Keep your neck neutral, not craned up to look forward.
Brace your core to protect your lower back through the hinge.',
 'Rounding the lower back under load.
Using momentum from the hips to jerk the weight up.'),

('Dumbbell Pullover', 'Back', 'Dumbbell',
 'A stretch-focused movement that opens up the lats and chest together.',
 'Lie on a bench holding one dumbbell with both hands above your chest.
Lower it back behind your head in an arc until you feel a stretch in your lats.
Pull it back over your chest.',
 'Back, Chest, Triceps',
 'Keep a slight bend in your elbows throughout — locking them out stresses the joint.
Move slowly through the stretch; this is not a movement to rush.',
 'Using too much weight and losing control of the arc.
Arching the lower back off the bench to chase more range.'),

('Pull-Up', 'Back', 'Bodyweight',
 'The gold-standard bodyweight back builder for width and pulling strength.',
 'Hang from a bar with an overhand grip, hands slightly wider than shoulders.
Pull your chin above the bar by driving your elbows down.
Lower with control back to a full hang.',
 'Back, Biceps, Rear Deltoids, Forearms',
 'Think about pulling your elbows to your hips, not just your chin to the bar.
If a full rep is too hard, use a resistance band or an assisted machine to build up.',
 'Kipping or swinging the legs for momentum.
Only doing partial reps and never reaching a full hang at the bottom.'),

('Chin-Up', 'Back', 'Bodyweight',
 'An underhand-grip pull-up that shifts more emphasis onto the biceps.',
 'Hang from a bar with an underhand, shoulder-width grip.
Pull yourself up until your chin clears the bar.
Lower with control back to a full hang.',
 'Back, Biceps, Forearms',
 'The underhand grip works the biceps harder than a standard pull-up — expect it to feel easier at first.
Keep your shoulder blades engaged from the very start of the hang.',
 'Swinging the body to generate momentum.
Not lowering all the way to a dead hang between reps.'),

('Inverted Row', 'Back', 'Bodyweight',
 'A horizontal bodyweight row that scales in difficulty with your foot position.',
 'Set a bar at hip height, lie underneath it, and grip it with hands shoulder-width apart.
Keeping your body straight, pull your chest to the bar.
Lower under control.',
 'Back, Biceps, Rear Deltoids',
 'Walk your feet further out to make it harder, closer in to make it easier.
Keep your body rigid like a plank the entire rep.',
 'Letting the hips sag toward the floor.
Only pulling halfway up instead of touching the bar to the chest.'),

('Machine Row', 'Back', 'Machine',
 'A guided horizontal row that isolates the back without needing to stabilize free weight.',
 'Sit with your chest against the pad, if available, and grip the handles.
Pull the handles toward your torso, squeezing your shoulder blades together.
Extend back out with control.',
 'Back, Biceps, Rear Deltoids',
 'Focus on squeezing your shoulder blades together, not just bending your elbows.
Keep your chest pressed into the pad the whole set.',
 'Using so much weight that only the arms move and the back barely engages.
Rushing the negative instead of controlling it back out.'),

('Straight-Arm Pulldown', 'Back', 'Cable',
 'An isolation move that hits the lats hard without involving the biceps much at all.',
 'Stand facing a high cable with a straight bar attached, arms extended in front of you.
Keeping your arms straight, pull the bar down to your thighs.
Let it return under control to the stretch position.',
 'Back, Chest',
 'Keep your arms locked at a slight bend the whole set — this is not a curling motion.
Think about pulling with your armpits, not your hands.',
 'Bending the elbows more as the set fatigues, turning it into a pulldown.
Using the hips to bounce the weight down.')

on conflict (name) do update set
    muscle_group = excluded.muscle_group,
    equipment = excluded.equipment,
    description = excluded.description,
    how_to_perform = excluded.how_to_perform,
    muscles_worked = excluded.muscles_worked,
    tips = excluded.tips,
    common_mistakes = excluded.common_mistakes;
