
import os

filepath = r'c:\Users\djgoo\OneDrive\Desktop\AI PROJECTS FOLDER\sidekick-multiverse\sidekick_full.js'

with open(filepath, 'rb') as f:
    content = f.read()

print(f"File size: {len(content)} bytes")
print(f"First 10 bytes: {content[:10]}")

# Check for BOM
if content.startswith(b'\xef\xbb\xbf'):
    print("BOM detected: UTF-8")
elif content.startswith(b'\xff\xfe'):
    print("BOM detected: UTF-16 LE")
elif content.startswith(b'\xfe\xff'):
    print("BOM detected: UTF-16 BE")
else:
    print("No BOM detected")

# Check all braces balance manually
text = content.decode('utf-8', errors='ignore')
stack = []
for i, char in enumerate(text):
    if char == '{':
        stack.append(('{', i))
    elif char == '}':
        if not stack:
            print(f"Unmatched closing brace at index {i}")
        else:
            stack.pop()
    elif char == '(':
        stack.append(('(', i))
    elif char == ')':
        if not stack:
            print(f"Unmatched closing parenthesis at index {i}")
        else:
            item, pos = stack.pop()
            if item != '(':
                print(f"Mismatched parenthesis: found ) but expected matching for {item} from index {pos}")

if stack:
    for item, pos in stack:
        print(f"Unclosed {item} at index {pos}")
else:
    print("Braces and parentheses are balanced.")
