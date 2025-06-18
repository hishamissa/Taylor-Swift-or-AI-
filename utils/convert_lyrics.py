import json
import random

# Load your raw file (adjust the name if different)
with open('data/taylor-swift-lyric-database.json', 'r', encoding='utf-8') as f:
    raw_lyrics = json.load(f)

# Create an empty list for cleaned entries
taylor_lyrics = []

for key, line in raw_lyrics.items():
    parts = key.split(':')
    if len(parts) >= 3:
        album_code = parts[0]
        track_number = parts[1]

        # Basic filtering: Skip too-short or too-long lines
        word_count = len(line.split())
        if 6 <= word_count <= 20:
            taylor_lyrics.append({
                "text": line,
                "type": "taylor",
                "album": album_code,
                "track": track_number
            })

# Shuffle
random.shuffle(taylor_lyrics)

# Save to a new JSON file
with open('lyrics_taylor_only.json', 'w') as f:
    json.dump(taylor_lyrics, f, indent=2)

print(f"Saved {len(taylor_lyrics)} clean Taylor lyrics.")
