
import os

filepath = r'c:\Users\djgoo\OneDrive\Desktop\AI PROJECTS FOLDER\sidekick-multiverse\sidekick_full.js'

with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
    for i, line in enumerate(f):
        if 'base64,iVBO' in line:
            print(f"Base64 found on line {i+1}")
