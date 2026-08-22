# What Men Carry — Visual Grammar

Every video follows this grammar. The prompt generator uses this as a constraint. Deviations are rejected.

## Cinematic language

- **Depth of field:** Shallow. Him sharp, the world soft. 85mm look (compressed, intimate distance).
- **Light on him:** Cool, flat, unflattering—the light of a fluorescent room, a car interior at dusk, a hallway. Never heroic side-lighting.
- **Light on the world around him:** Warm amber. Family members, surroundings, the thing he's carrying for—slightly golden, slightly softer, slightly out of reach.
- **Color grade:** Muted amber and steel. Not cold, not warm. Honest.
- **Grain:** Gentle. Like a photograph from 15 years ago. Not so much you notice it; just enough you feel the time.

## Movement

- **Him:** Still. Sharp. The anchor.
- **World around him:** Soft motion. A child moving past. Light through a window. Someone else's life going on. He holds still.

## Content—the one rule

**One ordinary moment carrying invisible weight.** Never the crisis itself.

- ✅ Show: The driveway. The car door. The desk at 3 AM.
- ❌ Don't show: The courtroom, the hospital, the bottle, the flashback, the meltdown, the pills, the gun, the confession.
- ✅ Show: His hand on the steering wheel. His eyes closed at the kitchen table. His phone he's not answering.
- ❌ Don't show: His tears, his shaking, his rage, his surrender.

The weight is in the stillness, not in the breaking.

## Forbidden clichés

Do not use or suggest:
- Dog tags, flags, uniforms (except as ambient detail in a genuine moment—a PTSD vet's everyday clothes, not a costume)
- Whiskey glass, empty bottles, substance-abuse imagery
- Prescription bottles
- Wedding photos, divorce papers, court documents
- Guns (except in the most oblique way, and never glamorous)
- Religious symbols used as salvation
- Sunsets, sunrises, horizon-gazing (metaphor-heavy)
- Motivational text overlays
- Music swells, orchestral anything

The quote provides the metaphor. The image provides the fact.

## Text

No text on screen. No subtitles. No chyrons. The quote appears only in the card metadata and the audio voiceover.

---

## Prompt construction

When writing a videoPrompt for xAI video generation, describe:
1. One specific, ordinary location
2. One specific human gesture or stillness
3. The light and time of day
4. One element of the world around him (not him)
5. The mood in one word (not feeling: mood)

Example frame: "A man's hands on a kitchen table at midnight. The table lamp is warm. Through the doorway behind him, the house is dark. His hands are still. Five seconds of him not moving, not looking up."

Do NOT describe emotion, conflict, or the issue itself.

---

## Artifact Defense (Technical Safeguards)

These constraints reduce common video generation failures: warped hands, distorted faces, impossible geometry, object count flickering.

### Hands
- **Resting hands are safe.** Hands on a table, in lap, at sides — no motion required.
- **Hands in motion are high-risk.** Avoid prompting: pouring, typing, buttoning, picking up, gesturing, opening, closing.
- **Static hand placement:** "His hands rest on the steering wheel" (safe) not "He grips the steering wheel" (risky).

### Faces
- **Avoid full-frontal emotional close-ups.** Profile, three-quarter view, or partial shadow all render better than face-forward intense emotion.
- **Distance is safer than intimacy.** Wide shot of a man at a table beats a close-up of his face.
- **Partial obscuration works:** "His face is half in shadow" renders better than "His face shows pain."

### Human subjects
- **ONE subject in focus.** The man is sharp; everyone else is soft-blurred (bokeh).
- **Background people are texture, not detail.** "Family at the table, soft focus" not "His wife and two children."
- **Never prompt multiple distinct actions.** One subject doing one thing; the world does the rest.

### Stillness is safety
- **The man barely moves.** One breath, one gesture held. This is also our style — it works because it's artifact-resistant.
- **Camera moves instead.** Slow push-in, slow drift, gradual pan — the camera carries motion, not the subject.
- **Never prompt:** walking, running, eating (mid-bite), climbing, reaching, hand-offs, or complex sequences.

### Geometry and objects
- **Avoid:** Complex furniture, mirrors, reflections, text, clocks, patterned objects (blinds, tile, checkered) in sharp focus.
- **Sharp plane:** Keep the subject sharp; let tables, walls, and background live in blur.
- **Simple props:** A lamp, a chair, a window. Not multiple objects with complex spatial relationships.

### Count nothing
- **Numbers are failure-prone.** Video models miscoun consistently.
- **❌ "Three coffee cups on the table"** → ✅ "Cups on the table, shallow depth"
- **❌ "Four family members at dinner"** → ✅ "Family at the table, others soft-blurred"
- **❌ "Two hands on the wheel"** → ✅ "Hands on the steering wheel"

### Duration
- **Described action: 5–8 seconds max** (even in a 15-second clip).
- One moment held, not a montage.
- After the action, the subject holds still (camera may drift, but he doesn't move).

### Red flags to avoid
- Multiple people with distinct emotions
- Hands doing precise motor tasks
- Text, numbers, or readable detail
- Reflective surfaces or mirrors
- Complex architectural detail
- Implied passage of time (day-to-night, seasons)
- Emotional crescendos or building intensity
