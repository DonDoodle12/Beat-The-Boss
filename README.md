# Beat the Boss Game 🎮

A fun and addictive TypeScript game inspired by the popular "Beat the Boss" mobile game! Click on the boss character to deal damage using various weapons and defeat them!

## Features ✨

- **Professional Weapon Panel**: 8 detailed weapon cards with stats, descriptions, and rarity levels
- **All Weapons Free**: No grinding required - all weapons available from the start!
- **Dynamic Particle Effects**: Beautiful particle explosions with each hit
- **Detailed Weapon Stats**: See damage, speed, and impact ratings for each weapon
- **Rarity System**: Weapons classified from Common to Legendary with unique colors
- **Smooth Animations**: Floating icons, pulsing glows, and hover effects
- **Health System**: Watch the boss's health decrease with a dynamic health bar
- **Visual Feedback**: Boss expressions change as they take damage
- **Damage Numbers**: See floating damage numbers with each hit
- **Game Over Screen**: Track your total damage and money earned
- **Responsive Design**: Works perfectly on desktop and mobile devices

## Weapons Arsenal 🔫

All weapons are **FREE** to use! Switch between them anytime:

1. **👊 Punch** - 5 damage (Common) - Basic melee attack
2. **🏏 Bat** - 10 damage (Common) - Swing with force
3. **🔨 Hammer** - 15 damage (Uncommon) - Heavy crushing blow
4. **🔪 Knife** - 20 damage (Uncommon) - Sharp and deadly
5. **🔫 Gun** - 30 damage (Rare) - Rapid fire weapon
6. **💣 Bomb** - 50 damage (Rare) - Explosive damage
7. **⚡ Lightning** - 75 damage (Epic) - Electrifying power
8. **🚀 Rocket** - 100 damage (Legendary) - Ultimate destruction

### Weapon Rarity System
- **Common** (Gray) - Basic weapons
- **Uncommon** (Green) - Enhanced weapons
- **Rare** (Blue) - Powerful weapons
- **Epic** (Purple) - Very powerful weapons
- **Legendary** (Orange) - Ultimate weapons with special glow effects!

## How to Play 🎯

1. **Click on the Boss**: Simply click on the boss character to attack
2. **Choose Your Weapon**: All weapons are free! Click any weapon card to equip it
3. **Check Weapon Stats**: Hover over weapons to see detailed stats:
   - ⚔️ **Damage**: How much damage per hit
   - ⚡ **Speed**: Attack/fire rate
   - 💥 **Impact**: Particle effect intensity
4. **Switch Anytime**: Change weapons mid-battle for different strategies
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

### Weapon System
- All 8 weapons are FREE from the start
- No grinding or purchases required
- Switch weapons instantly during combat
- Each weapon has unique stats and particle effects

### Boss States
- **Normal**: Green/Yellow colors
- **Damaged**: Orange colors (below 60% health)
- **Hurt**: Red colors (below 30% health)
- **Defeated**: Spins and fades away

## Tips & Tricks 💡

1. **Try All Weapons**: Experiment with different weapons to find your favorite!
2. **Watch the Health Bar**: It changes color as the boss takes more damage (Green → Orange → Red)
3. **Click Fast**: Rapid clicking deals more damage per second
4. **Strategic Switching**: Use faster weapons for quick hits, heavy weapons for big impact
5. **Rarity Matters**: Higher rarity weapons = more damage and visual effects
6. **Legendary Power**: The Rocket (Legendary) has the most impressive particle effects!

## Browser Compatibility 🌐

Works best in modern browsers:
- Chrome/Edge (Recommended)
- Firefox
- Safari
- Opera

## Customization 🎨

Want to modify the game? Here are some easy changes:

### Adjust Boss Health
Edit `src/game.ts`, line ~36:
```typescript
private maxHealth: number = 200; // Default is 100
```

### Add New Weapons
Edit the weapons array in `src/game.ts` around line ~47:
```typescript
{ 
    id: 'custom', 
    name: '✨ Custom', 
    damage: 150, 
    cost: 0, 
    icon: '✨', 
    color: '#ff00ff', 
    particleCount: 60,
    description: 'Your custom weapon',
    rarity: 'Legendary',
    fireRate: 'Ultra Fast'
}
```

### Change Weapon Damage
Simply edit the damage value in the weapons array:
```typescript
{ id: 'punch', name: '👊 Punch', damage: 50, ... } // Buff the punch!
```

Don't forget to run `npm run build` after making changes!

## Credits 👏

Inspired by the original "Beat the Boss" mobile game series.

Created with ❤️ using TypeScript.

## License 📄

This is a fan project created for educational purposes.

---

**Have Fun Beating the Boss!** 🎉

