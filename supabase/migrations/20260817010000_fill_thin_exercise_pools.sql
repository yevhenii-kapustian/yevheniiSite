-- The exercise-swap feature picks a random alternative with the same muscle_group +
-- equipment as the one being replaced, excluding the current exercise. 14 combinations in
-- the library had exactly one exercise, so swapping always failed for anyone assigned one
-- of these — there was nothing to swap TO. Adds one genuinely distinct, original exercise
-- to each of those 14 combinations so a swap always has at least one real alternative.
insert into exercises (name, muscle_group, equipment, description, how_to_perform, muscles_worked, tips, common_mistakes) values

('Cable Woodchopper', 'Abs', 'Cable',
 'A rotational cable exercise that trains the obliques and core through a diagonal chopping motion, unlike a straight-line crunch.',
 'Set a cable pulley to the top position and stand side-on to the machine, feet shoulder-width apart.
Grab the handle with both hands and pull it diagonally down and across your body toward your opposite hip.
Rotate through your torso and hips, then return with control to the start.
Complete all reps on one side before switching.',
 'Abs, Obliques',
 'Rotate from your core, not just your arms — the movement should come from twisting your torso.
Keep a slight bend in your knees and pivot your back foot as you rotate.',
 'Using the arms to yank the handle instead of driving the movement with the torso.
Standing too square to the machine, which limits how far you can rotate.'),

('Rotary Torso Machine', 'Abs', 'Machine',
 'A seated machine that isolates rotational core strength, working the obliques through a fixed, controlled arc.',
 'Sit in the machine and brace your lower body against the pads so only your torso can rotate.
Rotate your torso to one side against the resistance, keeping your hips still.
Return with control to the center, then rotate to the other side.',
 'Abs, Obliques',
 'Move slowly through the full range — this exercise rewards control more than speed.
Keep your hips locked against the pads so the rotation comes from your torso alone.',
 'Letting the hips rotate along with the torso, which takes tension off the obliques.
Using too much weight and relying on momentum to swing through the movement.'),

('Cable Rope Hammer Curl', 'Biceps', 'Cable',
 'A neutral-grip curl using a rope attachment on a low cable, shifting emphasis toward the forearms and outer biceps compared to a standard curl.',
 'Attach a rope handle to a low cable pulley and stand facing the machine, holding one end in each hand with palms facing each other.
Curl the rope up toward your shoulders without rotating your wrists.
Lower with control back to the start.',
 'Biceps, Forearms',
 'Keep your elbows pinned to your sides through the whole movement.
Squeeze at the top and control the negative rather than letting the weight drop.',
 'Letting the elbows drift forward, which turns the curl into a front raise.
Using body momentum to swing the rope up instead of curling with the arms.'),

('Machine Bicep Curl', 'Biceps', 'Machine',
 'A seated, machine-guided curl that removes shoulder and back involvement, isolating the biceps through a fixed path.',
 'Sit at the machine with your upper arms resting on the pad and hands gripping the handles.
Curl the handles up toward your shoulders.
Lower slowly back to a full stretch.',
 'Biceps',
 'Let the pad support your upper arms fully so your shoulders stay out of the movement.
Pause briefly at the top of each rep for a stronger contraction.',
 'Lifting the elbows off the pad to help move the weight.
Rushing the lowering phase instead of controlling it back down.'),

('Dumbbell Seated Calf Raise', 'Calves', 'Dumbbell',
 'A seated calf raise that shifts emphasis onto the soleus, the muscle underneath the main calf, complementing standing raises which target the gastrocnemius more.',
 'Sit on a bench with a dumbbell resting on top of each knee, feet flat on the floor or a raised platform.
Raise your heels as high as possible by pressing through the balls of your feet.
Lower slowly until you feel a stretch in your calves.',
 'Calves',
 'Bending the knee is what shifts the work toward the soleus — keep your knees bent throughout, not straight.
Pause at the top of each rep for a full contraction.',
 'Bouncing at the bottom instead of controlling the stretch.
Only moving through a small range instead of getting a full stretch and full contraction.'),

('Barbell Glute Bridge', 'Glutes', 'Barbell',
 'A floor-based hip thrust variant performed with a barbell across the hips, demanding more core and hip stability than the bench-supported version.',
 'Lie on your back with knees bent, feet flat on the floor, and a padded barbell resting across your hips.
Drive through your heels to lift your hips up until your body forms a straight line from shoulders to knees.
Squeeze your glutes hard at the top, then lower with control.',
 'Glutes, Hamstrings',
 'Pad the bar well — this is a heavy point of contact and comfort affects how hard you can push.
Drive through your heels, not your toes, to keep the glutes doing the work.',
 'Overextending the lower back at the top instead of stopping at a straight line.
Letting the knees cave inward as you press up.'),

('Cable Standing Hip Abduction', 'Glutes', 'Cable',
 'A standing cable exercise that targets the glute medius — the smaller side glute muscle responsible for hip stability — through an outward leg movement.',
 'Attach an ankle cuff to a low cable pulley and clip it to one ankle, standing side-on to the machine.
Keeping your leg straight, sweep it outward and away from your body against the cable''s resistance.
Return with control to the start, then complete all reps before switching sides.',
 'Glutes',
 'Keep your torso upright — leaning away from the machine is a common way to cheat the movement.
Hold onto something stable for balance so you can focus entirely on the leg doing the work.',
 'Leaning the torso to help swing the leg out instead of isolating the hip.
Rotating the leg outward instead of keeping the movement in a straight plane.'),

('Glute Kickback Machine', 'Glutes', 'Machine',
 'A machine that isolates the glutes through a hip-extension kickback motion, distinct from the lateral movement of hip abduction machines.',
 'Position yourself in the machine with one foot braced against the platform, torso leaning slightly forward against the pad.
Drive your leg straight back, squeezing your glute hard at the top.
Return with control to the start, then complete all reps before switching legs.',
 'Glutes',
 'Focus on driving through your heel and squeezing the glute, not just moving the platform.
Keep the movement controlled rather than kicking back explosively.',
 'Arching the lower back to add extra range instead of stopping when the hip is fully extended.
Using momentum from the torso instead of isolating the glute.'),

('Bodyweight Single-Leg Deadlift', 'Hamstrings', 'Bodyweight',
 'A balance-driven hip-hinge exercise that trains the hamstrings unilaterally using nothing but bodyweight, complementing the Nordic Curl''s knee-flexion pattern with a hip-hinge one.',
 'Stand on one leg with a slight bend in the knee.
Hinge forward at the hips, extending your free leg straight back for counterbalance, until your torso is roughly parallel to the floor.
Squeeze your hamstring and glute to return to standing.
Complete all reps on one side before switching legs.',
 'Hamstrings, Glutes',
 'Keep your hips square to the floor throughout — don''t let them rotate open.
Move slowly; balance is the limiting factor here more than strength.',
 'Rounding the lower back instead of hinging with a flat spine.
Rushing the movement, which sacrifices balance and range of motion.'),

('Standing Cable Hamstring Curl', 'Hamstrings', 'Cable',
 'A standing cable exercise that isolates the hamstrings through knee flexion, complementing the hip-hinge pattern of the Cable Pull-Through.',
 'Attach an ankle cuff to a low cable pulley and clip it to one ankle, standing facing the machine.
Keeping your thigh still, curl your heel up toward your glute against the cable''s resistance.
Lower with control back to the start, then complete all reps before switching legs.',
 'Hamstrings',
 'Keep your standing leg slightly bent and hold onto the machine for balance.
Focus on curling from the knee only — the thigh shouldn''t move.',
 'Letting the hips swing to help generate momentum.
Using a range of motion so large the thigh starts moving along with the lower leg.'),

('Barbell Upright Row', 'Shoulders', 'Barbell',
 'A vertical pulling movement that works the side delts and traps, offering a different pressing-free pattern than the Overhead Press.',
 'Stand holding a barbell with an overhand grip, hands just inside shoulder-width.
Pull the bar straight up along your body to roughly chest height, leading with your elbows.
Lower with control back to the start.',
 'Shoulders, Biceps',
 'Lead with your elbows, keeping them higher than your wrists throughout the pull.
Keep the bar close to your body as it travels up.',
 'Pulling the bar too high, which can strain the shoulder joint.
Using a very narrow grip, which increases shoulder strain without adding benefit.'),

('Plank Shoulder Taps', 'Shoulders', 'Bodyweight',
 'A stability-focused bodyweight exercise that challenges the shoulders and core together by removing a hand from the floor while holding a plank.',
 'Start in a high plank position with hands under your shoulders and feet slightly wider than hip-width for stability.
Without rotating your hips, lift one hand and tap the opposite shoulder.
Return your hand to the floor and repeat on the other side, alternating.',
 'Shoulders, Abs',
 'Widen your stance for more stability if your hips are rocking side to side.
Move slowly and with control rather than tapping quickly.',
 'Letting the hips rotate or sag with each tap instead of staying square to the floor.
Placing hands too close together, which makes the plank inherently less stable.'),

('Machine Lateral Raise', 'Shoulders', 'Machine',
 'A machine-guided lateral raise that isolates the side delts through a fixed path, removing the need to stabilize a dumbbell.',
 'Sit in the machine with your upper arms against the pads, elbows slightly bent.
Raise your arms out to the sides until roughly shoulder height.
Lower with control back to the start.',
 'Shoulders',
 'Lead with your elbows, not your hands, to keep the tension on the side delts.
Avoid raising past shoulder height, which shifts the work onto the traps.',
 'Shrugging the shoulders up to help lift the weight.
Using momentum by swinging the arms up instead of a controlled raise.'),

('Machine Dip', 'Triceps', 'Machine',
 'An assisted dip machine that trains the same pressing pattern as a bodyweight dip while letting you dial in a manageable amount of resistance.',
 'Set the machine to an appropriate resistance and grip the handles with your arms extended.
Lower your body by bending your elbows until your upper arms are roughly parallel to the floor.
Press back up to the starting position.',
 'Triceps, Chest',
 'Keep a slight forward lean to keep the emphasis on the chest and triceps rather than the shoulders.
Control the descent rather than dropping quickly into the bottom position.',
 'Going so deep that the shoulders roll forward and take on unwanted strain.
Flaring the elbows out wide instead of keeping them tucked closer to the body.')

on conflict (name) do update set
    muscle_group = excluded.muscle_group,
    equipment = excluded.equipment,
    description = excluded.description,
    how_to_perform = excluded.how_to_perform,
    muscles_worked = excluded.muscles_worked,
    tips = excluded.tips,
    common_mistakes = excluded.common_mistakes;
