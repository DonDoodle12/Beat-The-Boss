#!/bin/bash

echo "🎮 Beat the Boss Game Launcher"
echo "================================"
echo ""

# Check if dist/game.js exists
if [ ! -f "dist/game.js" ]; then
    echo "⚠️  Game not built yet. Building now..."
    npm run build
    echo "✅ Build complete!"
    echo ""
fi

# Try to open the game in the default browser
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo "🚀 Opening game in your default browser..."
    open index.html
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    echo "🚀 Opening game in your default browser..."
    xdg-open index.html
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    # Windows
    echo "🚀 Opening game in your default browser..."
    start index.html
else
    echo "✅ Game is ready!"
    echo "Please open 'index.html' in your web browser"
fi

echo ""
echo "💡 Tip: If you make changes to game.ts, run 'npm run build' to recompile!"
echo ""
echo "Have fun! 🎉"

