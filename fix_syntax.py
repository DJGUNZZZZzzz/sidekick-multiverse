
import re

filepath = r'c:\Users\djgoo\OneDrive\Desktop\AI PROJECTS FOLDER\sidekick-multiverse\sidekick_full.js'

with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Replace the massive base64 string with a 1x1 transparent PNG
placeholder = 'var SM_ASSET_B64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR42mP8/wcAAwAB/glUn74AAAAASUVORK5CYII=";'
new_content = re.sub(r'var SM_ASSET_B64 = ".*?";', placeholder, content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Replacement successful.")
