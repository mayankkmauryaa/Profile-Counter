username = "mayankkmauryaa"
label = "Mayank+Maurya"

colors = [
    "brightgreen","green","yellow","yellowgreen","orange","red","blue",
    "grey","lightgrey","blueviolet","dc143c","ff69b4"
]

styles = ["flat","flat-square","plastic","for-the-badge","pixel"]

def badge(params):
    return f"https://komarev.com/ghpvc/?username={username}&{params}&label={label}"

print("=== COLORS ===")
for c in colors:
    print(badge(f"color={c}"))

print("\n=== STYLES ===")
for s in styles:
    print(badge(f"style={s}&color=blueviolet"))

print("\n=== BASE=1000 ===")
for s in styles:
    print(badge(f"base=1000&style={s}&color=blueviolet"))

print("\n=== ABBREVIATED ===")
for s in styles:
    print(badge(f"abbreviated=true&style={s}&color=blueviolet"))

