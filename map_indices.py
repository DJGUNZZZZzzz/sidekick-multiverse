
import os

filepath = r'c:\Users\djgoo\OneDrive\Desktop\AI PROJECTS FOLDER\sidekick-multiverse\sidekick_full.js'

with open(filepath, 'rb') as f:
    content = f.read()

text = content.decode('utf-8', errors='ignore')

# Identify line/character for specific indices
indices_to_find = [137, 149]

for idx in indices_to_find:
    line_no = text.count('\n', 0, idx) + 1
    last_newline = text.rfind('\n', 0, idx)
    char_no = idx - last_newline
    snippet = text[max(0, idx-20):min(len(text), idx+20)].replace('\n', '\\n')
    print(f"Index {idx} is on line {line_no}, char {char_no}")
    print(f"  Snippet around index: ...{snippet}...")
