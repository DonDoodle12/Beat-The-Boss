# Beat the Boss Game 🎮

A fun and addictive TypeScript game inspired by the popular "Beat the Boss" mobile game! Click on the boss character to deal damage using various weapons and defeat them!

## Features ✨

- **Multiple Weapons**: 8 different weapons to unlock, from a simple punch to a devastating rocket!
- **Dynamic Particle Effects**: Beautiful particle explosions with each hit
- **Weapon Shop System**: Earn money by dealing damage and buy better weapons
- **Health System**: Watch the boss's health decrease with a dynamic health bar
- **Visual Feedback**: Boss expressions change as they take damage
- **Damage Numbers**: See floating damage numbers with each hit
- **Game Over Screen**: Track your total damage and money earned
- **Responsive Design**: Works on desktop and mobile devices

## Weapons 🔫

1. **👊 Punch** - 5 damage (FREE)
2. **🏏 Bat** - 10 damage ($100)
3. **🔨 Hammer** - 15 damage ($200)
4. **🔪 Knife** - 20 damage ($300)
5. **🔫 Gun** - 30 damage ($500)
6. **💣 Bomb** - 50 damage ($800)
7. **⚡ Lightning** - 75 damage ($1200)
8. **🚀 Rocket** - 100 damage ($2000)

## How to Play 🎯

1. **Click on the Boss**: Simply click on the boss character to attack
2. **Earn Money**: Each hit earns you money equal to the damage dealt
3. **Buy Weapons**: Use your earned money to purchase more powerful weapons
4. **Switch Weapons**: Click on any unlocked weapon to select it
5. **Defeat the Boss**: Reduce the boss's health to 0 to win!
6. **Play Again**: Click "FIGHT AGAIN" to restart with a fresh boss

## Installation & Running 🚀

### Prerequisites
- Node.js installed on your system
- A modern web browser

### Setup
```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# For development (auto-compile on changes)
npm run dev
```

### Running the Game
Simply open `index.html` in your web browser!

You can:
- Double-click the `index.html` file
- Right-click and choose "Open with" your preferred browser
- Use a local server: `python -m http.server 8000` or `npx serve`

## Project Structure 📁

```
airmax/
├── index.html          # Main HTML file
├── styles.css          # All styling
├── src/
│   └── game.ts        # Main game logic (TypeScript)
├── dist/
│   └── game.js        # Compiled JavaScript
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript configuration
└── README.md          # This file
```

## Technologies Used 💻

- **TypeScript**: For type-safe game logic
- **HTML5 Canvas**: For particle effects
- **CSS3**: For animations and styling
- **Vanilla JavaScript**: No frameworks needed!

## Game Mechanics 🎲

### Combat System
- Click anywhere on the boss to attack
- Each weapon has different damage and particle effects
- Boss reacts with shake animation on hit
- Damage numbers float up from hit location

### Economy System
- Start with $1000
- Earn money equal to damage dealt
- Weapons are permanent purchases (buy once, use forever)

### Boss States
- **Normal**: Green/Yellow colors
- **Damaged**: Orange colors (below 60% health)
- **Hurt**: Red colors (below 30% health)
- **Defeated**: Spins and fades away

## Tips & Tricks 💡

1. **Save Your Money**: Don't buy every weapon immediately. Focus on high-damage weapons!
2. **Watch the Health Bar**: It changes color as the boss takes more damage
3. **Click Fast**: Rapid clicking deals more damage per second
4. **Combo Strategy**: Start with the free punch to earn initial money, then upgrade quickly

## Browser Compatibility 🌐

Works best in modern browsers:
- Chrome/Edge (Recommended)
- Firefox
- Safari
- Opera

## Customization 🎨

Want to modify the game? Here are some easy changes:

### Change Starting Money
Edit `src/game.ts`, line ~25:
```typescript
private money: number = 5000; // Default is 1000
```

### Adjust Boss Health
Edit `src/game.ts`, line ~23:
```typescript
private maxHealth: number = 200; // Default is 100
```

### Add New Weapons
Edit the weapons array in `src/game.ts` around line ~30:
```typescript
{ id: 'custom', name: '✨ Custom', damage: 150, cost: 3000, icon: '✨', color: '#ff00ff', particleCount: 60 }
```

Don't forget to run `npm run build` after making changes!

## Credits 👏

Inspired by the original "Beat the Boss" mobile game series.

Created with ❤️ using TypeScript.

## License 📄

This is a fan project created for educational purposes.

---

**Have Fun Beating the Boss!** 🎉

