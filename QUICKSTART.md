# 🎮 Quick Start Guide

## To Play the Game:

### Option 1: Direct Open (Easiest)
1. Double-click `index.html` in your file browser
2. If that doesn't work, right-click → "Open With" → Choose your browser

### Option 2: Use Launch Script
```bash
./launch.sh
```

### Option 3: Local Server (Recommended for Development)
```bash
# Python
python -m http.server 8000
# Then open: http://localhost:8000

# OR Node.js
npx serve
# Follow the URL shown
```

## Game Controls:
- **Click the Boss** to attack
- **Click Weapons** at bottom to switch
- **Earn money** with each hit
- **Buy weapons** to deal more damage
- **Defeat the boss** by reducing health to 0!

## Development:
```bash
# Make changes to src/game.ts
npm run build        # Compile once
# OR
npm run dev          # Auto-compile on save

# Then refresh your browser
```

## Troubleshooting:
- **Blank page?** → Check browser console (F12)
- **Not compiling?** → Run `npm install` then `npm run build`
- **Changed code not showing?** → Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

**Have Fun! 🎉**

