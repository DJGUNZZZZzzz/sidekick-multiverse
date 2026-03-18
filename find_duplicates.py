
import os

filepath = r'c:\Users\djgoo\OneDrive\Desktop\AI PROJECTS FOLDER\sidekick-multiverse\sidekick_full.js'

with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
    for i, line in enumerate(f):
        if 'var SM_ASSET_B64' in line:
            print(f"Match on line {i+1}")
