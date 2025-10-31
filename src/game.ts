// Particle system for visual effects
interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    color: string;
    size: number;
}

interface Weapon {
    id: string;
    name: string;
    damage: number;
    cost: number;
    icon: string;
    color: string;
    particleCount: number;
    description: string;
    rarity: string;
    fireRate: string;
}

class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private boss: HTMLElement;
    private bossContainer: HTMLElement;
    private healthBar: HTMLElement;
    private healthText: HTMLElement;
    private totalDamageElement: HTMLElement;
    private moneyElement: HTMLElement;
    private gameOverScreen: HTMLElement;
    private damageNumbersContainer: HTMLElement;
    private weaponsGrid: HTMLElement;
    private weaponsPanel: HTMLElement;
    private weaponSelectorBtn: HTMLElement;
    private currentWeaponIcon: HTMLElement;
    private weaponsOverlay: HTMLElement;
    private closeWeaponsBtn: HTMLElement;
    
    private health: number = 100;
    private maxHealth: number = 100;
    private totalDamage: number = 0;
    private money: number = 1000;
    private particles: Particle[] = [];
    private selectedWeapon: Weapon;
    private isGameOver: boolean = false;
    private audioContext: AudioContext;
    private comboCount: number = 0;
    private comboTimer: number | null = null;
    private comboDisplay: HTMLElement;
    private comboNumber: HTMLElement;
    private finishHimScreen: HTMLElement;
    private isFinishHimMode: boolean = false;
    private lastHitTime: number = 0;
    
    private weapons: Weapon[] = [
        { id: 'punch', name: '👊 Punch', damage: 5, cost: 0, icon: '👊', color: '#ff6b6b', particleCount: 5, description: 'Basic melee attack', rarity: 'Common', fireRate: 'Fast' },
        { id: 'bat', name: '🏏 Bat', damage: 10, cost: 0, icon: '🏏', color: '#4ecdc4', particleCount: 8, description: 'Swing with force', rarity: 'Common', fireRate: 'Fast' },
        { id: 'hammer', name: '🔨 Hammer', damage: 15, cost: 0, icon: '🔨', color: '#ffe66d', particleCount: 12, description: 'Heavy crushing blow', rarity: 'Uncommon', fireRate: 'Medium' },
        { id: 'knife', name: '🔪 Knife', damage: 20, cost: 0, icon: '🔪', color: '#ff6b9d', particleCount: 15, description: 'Sharp and deadly', rarity: 'Uncommon', fireRate: 'Fast' },
        { id: 'gun', name: '🔫 Gun', damage: 30, cost: 0, icon: '🔫', color: '#c44569', particleCount: 20, description: 'Rapid fire weapon', rarity: 'Rare', fireRate: 'Very Fast' },
        { id: 'bomb', name: '💣 Bomb', damage: 50, cost: 0, icon: '💣', color: '#f38181', particleCount: 30, description: 'Explosive damage', rarity: 'Rare', fireRate: 'Medium' },
        { id: 'lightning', name: '⚡ Lightning', damage: 75, cost: 0, icon: '⚡', color: '#ffeb3b', particleCount: 40, description: 'Electrifying power', rarity: 'Epic', fireRate: 'Fast' },
        { id: 'rocket', name: '🚀 Rocket', damage: 100, cost: 0, icon: '🚀', color: '#ff5722', particleCount: 50, description: 'Ultimate destruction', rarity: 'Legendary', fireRate: 'Medium' }
    ];

    constructor() {
        this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.boss = document.getElementById('boss')!;
        this.bossContainer = document.getElementById('bossContainer')!;
        this.healthBar = document.getElementById('healthBar')!;
        this.healthText = document.getElementById('healthText')!;
        this.totalDamageElement = document.getElementById('totalDamage')!;
        this.moneyElement = document.getElementById('money')!;
        this.gameOverScreen = document.getElementById('gameOverScreen')!;
        this.damageNumbersContainer = document.getElementById('damageNumbers')!;
        this.weaponsGrid = document.getElementById('weaponsGrid')!;
        this.weaponsPanel = document.getElementById('weaponsPanel')!;
        this.weaponSelectorBtn = document.getElementById('weaponSelectorBtn')!;
        this.currentWeaponIcon = document.getElementById('currentWeaponIcon')!;
        this.weaponsOverlay = document.getElementById('weaponsOverlay')!;
        this.closeWeaponsBtn = document.getElementById('closeWeaponsBtn')!;
        this.comboDisplay = document.getElementById('comboDisplay')!;
        this.comboNumber = document.getElementById('comboNumber')!;
        this.finishHimScreen = document.getElementById('finishHimScreen')!;
        
        this.selectedWeapon = this.weapons[0];
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        this.setupCanvas();
        this.setupEventListeners();
        this.renderWeapons();
        this.gameLoop();
    }

    private setupCanvas(): void {
        this.canvas.width = this.bossContainer.clientWidth;
        this.canvas.height = this.bossContainer.clientHeight;
        
        window.addEventListener('resize', () => {
            this.canvas.width = this.bossContainer.clientWidth;
            this.canvas.height = this.bossContainer.clientHeight;
        });
    }

    private setupEventListeners(): void {
        this.boss.addEventListener('click', (e) => this.hitBoss(e));
        
        const restartBtn = document.getElementById('restartBtn')!;
        restartBtn.addEventListener('click', () => this.restart());
        
        // Weapon selector button
        this.weaponSelectorBtn.addEventListener('click', () => this.openWeaponsPanel());
        this.closeWeaponsBtn.addEventListener('click', () => this.closeWeaponsPanel());
        this.weaponsOverlay.addEventListener('click', () => this.closeWeaponsPanel());
    }
    
    private openWeaponsPanel(): void {
        this.weaponsPanel.classList.add('open');
        this.weaponsOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    private closeWeaponsPanel(): void {
        this.weaponsPanel.classList.remove('open');
        this.weaponsOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    private playWeaponSound(weaponId: string): void {
        const ctx = this.audioContext;
        const currentTime = ctx.currentTime;

        switch(weaponId) {
            case 'punch':
                this.playPunchSound(ctx, currentTime);
                break;
            case 'bat':
                this.playBatSound(ctx, currentTime);
                break;
            case 'hammer':
                this.playHammerSound(ctx, currentTime);
                break;
            case 'knife':
                this.playKnifeSound(ctx, currentTime);
                break;
            case 'gun':
                this.playGunSound(ctx, currentTime);
                break;
            case 'bomb':
                this.playBombSound(ctx, currentTime);
                break;
            case 'lightning':
                this.playLightningSound(ctx, currentTime);
                break;
            case 'rocket':
                this.playRocketSound(ctx, currentTime);
                break;
        }
    }

    // Punch - Short low thump
    private playPunchSound(ctx: AudioContext, time: number): void {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.frequency.setValueAtTime(100, time);
        osc.frequency.exponentialRampToValueAtTime(40, time + 0.1);
        
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
        
        osc.start(time);
        osc.stop(time + 0.1);
    }

    // Bat - Swing whoosh
    private playBatSound(ctx: AudioContext, time: number): void {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, time);
        osc.frequency.exponentialRampToValueAtTime(800, time + 0.08);
        osc.frequency.exponentialRampToValueAtTime(100, time + 0.15);
        
        gain.gain.setValueAtTime(0.2, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);
        
        osc.start(time);
        osc.stop(time + 0.15);
    }

    // Hammer - Heavy thud
    private playHammerSound(ctx: AudioContext, time: number): void {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.frequency.setValueAtTime(80, time);
        osc.frequency.exponentialRampToValueAtTime(30, time + 0.2);
        
        gain.gain.setValueAtTime(0.4, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
        
        osc.start(time);
        osc.stop(time + 0.2);
    }

    // Knife - Sharp slash
    private playKnifeSound(ctx: AudioContext, time: number): void {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1000, time);
        osc.frequency.exponentialRampToValueAtTime(2000, time + 0.05);
        osc.frequency.exponentialRampToValueAtTime(500, time + 0.1);
        
        gain.gain.setValueAtTime(0.2, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
        
        osc.start(time);
        osc.stop(time + 0.1);
    }

    // Gun - Bang!
    private playGunSound(ctx: AudioContext, time: number): void {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(500, time);
        osc.frequency.exponentialRampToValueAtTime(100, time + 0.05);
        
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);
        
        osc.start(time);
        osc.stop(time + 0.05);
    }

    // Bomb - Explosion
    private playBombSound(ctx: AudioContext, time: number): void {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, time);
        osc.frequency.exponentialRampToValueAtTime(40, time + 0.3);
        
        gain.gain.setValueAtTime(0.5, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);
        
        osc.start(time);
        osc.stop(time + 0.3);
    }

    // Lightning - Electric zap
    private playLightningSound(ctx: AudioContext, time: number): void {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(2000, time);
        osc.frequency.exponentialRampToValueAtTime(100, time + 0.15);
        
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.linearRampToValueAtTime(0.1, time + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);
        
        osc.start(time);
        osc.stop(time + 0.15);
    }

    // Rocket - Whoosh and boom
    private playRocketSound(ctx: AudioContext, time: number): void {
        // Whoosh
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(400, time);
        osc1.frequency.exponentialRampToValueAtTime(1200, time + 0.2);
        
        gain1.gain.setValueAtTime(0.2, time);
        gain1.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
        
        osc1.start(time);
        osc1.stop(time + 0.2);
        
        // Explosion
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(150, time + 0.15);
        osc2.frequency.exponentialRampToValueAtTime(50, time + 0.4);
        
        gain2.gain.setValueAtTime(0.5, time + 0.15);
        gain2.gain.exponentialRampToValueAtTime(0.01, time + 0.4);
        
        osc2.start(time + 0.15);
        osc2.stop(time + 0.4);
    }

    // Boss Hurt Sound - Pain grunt (varies by health)
    private playBossHurtSound(healthPercent: number): void {
        const ctx = this.audioContext;
        const time = ctx.currentTime;
        
        // Intensity increases as health decreases
        const intensity = 1 - (healthPercent / 100);
        
        // Voice-like grunt sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sawtooth';
        
        if (healthPercent < 30) {
            // Desperate/painful scream
            osc.frequency.setValueAtTime(300, time);
            osc.frequency.linearRampToValueAtTime(450, time + 0.1);
            osc.frequency.exponentialRampToValueAtTime(200, time + 0.3);
            gain.gain.setValueAtTime(0.4, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);
            osc.start(time);
            osc.stop(time + 0.3);
        } else if (healthPercent < 60) {
            // Moderate pain grunt
            osc.frequency.setValueAtTime(250, time);
            osc.frequency.exponentialRampToValueAtTime(150, time + 0.2);
            gain.gain.setValueAtTime(0.3, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
            osc.start(time);
            osc.stop(time + 0.2);
        } else {
            // Light grunt
            osc.frequency.setValueAtTime(200, time);
            osc.frequency.exponentialRampToValueAtTime(120, time + 0.15);
            gain.gain.setValueAtTime(0.25, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);
            osc.start(time);
            osc.stop(time + 0.15);
        }
    }

    // Boss Death Sound - Dramatic defeat
    private playBossDeathSound(): void {
        const ctx = this.audioContext;
        const time = ctx.currentTime;
        
        // Long descending scream
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(400, time);
        osc1.frequency.exponentialRampToValueAtTime(100, time + 0.8);
        
        gain1.gain.setValueAtTime(0.4, time);
        gain1.gain.linearRampToValueAtTime(0.3, time + 0.4);
        gain1.gain.exponentialRampToValueAtTime(0.01, time + 0.8);
        
        osc1.start(time);
        osc1.stop(time + 0.8);
        
        // Add wobble effect for drama
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(350, time);
        osc2.frequency.exponentialRampToValueAtTime(80, time + 0.8);
        
        gain2.gain.setValueAtTime(0.3, time);
        gain2.gain.exponentialRampToValueAtTime(0.01, time + 0.8);
        
        osc2.start(time);
        osc2.stop(time + 0.8);
        
        // Final thud
        const osc3 = ctx.createOscillator();
        const gain3 = ctx.createGain();
        
        osc3.connect(gain3);
        gain3.connect(ctx.destination);
        
        osc3.frequency.setValueAtTime(60, time + 0.8);
        osc3.frequency.exponentialRampToValueAtTime(30, time + 1.0);
        
        gain3.gain.setValueAtTime(0.5, time + 0.8);
        gain3.gain.exponentialRampToValueAtTime(0.01, time + 1.0);
        
        osc3.start(time + 0.8);
        osc3.stop(time + 1.0);
    }

    private renderWeapons(): void {
        this.weaponsGrid.innerHTML = '';
        
        this.weapons.forEach(weapon => {
            const weaponCard = document.createElement('div');
            weaponCard.className = 'weapon-card';
            weaponCard.setAttribute('data-rarity', weapon.rarity.toLowerCase());
            
            if (weapon.id === this.selectedWeapon.id) {
                weaponCard.classList.add('selected');
            }
            
            const canAfford = this.money >= weapon.cost || weapon.cost === 0;
            if (!canAfford) {
                weaponCard.classList.add('locked');
            }
            
            weaponCard.innerHTML = `
                <div class="weapon-header">
                    <span class="weapon-rarity ${weapon.rarity.toLowerCase()}">${weapon.rarity}</span>
                </div>
                <div class="weapon-icon-container">
                    <div class="weapon-icon">${weapon.icon}</div>
                    <div class="weapon-glow" style="background: ${weapon.color};"></div>
                </div>
                <div class="weapon-info">
                    <div class="weapon-name">${weapon.name.replace(/👊|🏏|🔨|🔪|🔫|💣|⚡|🚀/g, '').trim()}</div>
                    <div class="weapon-description">${weapon.description}</div>
                </div>
                <div class="weapon-stats">
                    <div class="stat-row">
                        <span class="stat-icon">⚔️</span>
                        <span class="stat-label">Damage</span>
                        <span class="stat-value">${weapon.damage}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-icon">⚡</span>
                        <span class="stat-label">Speed</span>
                        <span class="stat-value">${weapon.fireRate}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-icon">💥</span>
                        <span class="stat-label">Impact</span>
                        <span class="stat-value">${weapon.particleCount}</span>
                    </div>
                </div>
                <div class="weapon-footer">
                    <div class="weapon-cost ${weapon.cost === 0 ? 'free' : ''}">
                        ${weapon.cost === 0 ? '<span class="free-tag">✓ FREE</span>' : '$' + weapon.cost}
                    </div>
                </div>
            `;
            
            weaponCard.addEventListener('click', () => {
                if (canAfford && this.buyWeapon(weapon)) {
                    this.selectedWeapon = weapon;
                    this.currentWeaponIcon.textContent = weapon.icon;
                    this.renderWeapons();
                    this.closeWeaponsPanel();
                }
            });
            
            this.weaponsGrid.appendChild(weaponCard);
        });
    }

    private buyWeapon(weapon: Weapon): boolean {
        if (weapon.cost === 0) return true;
        
        if (this.money >= weapon.cost) {
            this.money -= weapon.cost;
            this.updateMoney();
            weapon.cost = 0; // Once bought, it's free
            return true;
        }
        return false;
    }

    private hitBoss(event: MouseEvent): void {
        if (this.isGameOver) return;
        
        const rect = this.boss.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Update combo
        this.updateCombo();
        
        // Apply damage (bonus damage for combos!)
        const baseDamage = this.selectedWeapon.damage;
        const comboMultiplier = 1 + (Math.min(this.comboCount, 10) * 0.1); // Max 2x damage at 10 combo
        const damage = Math.floor(baseDamage * comboMultiplier);
        
        this.health = Math.max(0, this.health - damage);
        this.totalDamage += damage;
        this.money += damage; // Earn money based on damage
        
        // Calculate health percentage
        const healthPercent = (this.health / this.maxHealth) * 100;
        
        // Check for Finish Him mode
        if (healthPercent <= 7 && healthPercent > 0 && !this.isFinishHimMode) {
            this.activateFinishHimMode();
        }
        
        // Play weapon sound
        this.playWeaponSound(this.selectedWeapon.id);
        
        // Play boss hurt sound (only if not dead)
        if (this.health > 0) {
            setTimeout(() => this.playBossHurtSound(healthPercent), 100);
        }
        
        // Update UI
        this.updateHealth();
        this.updateTotalDamage();
        this.updateMoney();
        this.renderWeapons();
        
        // Visual effects
        this.showDamageNumber(event.clientX, event.clientY, damage);
        this.createParticles(x, y, this.selectedWeapon.color, this.selectedWeapon.particleCount * (this.isFinishHimMode ? 2 : 1));
        this.shakeBoss();
        
        // Extra shake for high combos
        if (this.comboCount >= 10) {
            this.screenShake();
        }
        
        // Check game over
        if (this.health <= 0) {
            this.performFinisher();
        }
    }

    private updateCombo(): void {
        const currentTime = Date.now();
        const timeSinceLastHit = currentTime - this.lastHitTime;
        
        // Reset combo if more than 1.5 seconds between hits
        if (timeSinceLastHit > 1500) {
            this.comboCount = 0;
        }
        
        this.comboCount++;
        this.lastHitTime = currentTime;
        
        // Update combo display
        if (this.comboCount >= 3) {
            this.comboNumber.textContent = this.comboCount.toString();
            this.comboDisplay.classList.add('active');
            
            // Add mega combo effect for high combos
            if (this.comboCount >= 10) {
                this.comboDisplay.classList.add('mega');
            }
        }
        
        // Reset combo timer
        if (this.comboTimer) {
            clearTimeout(this.comboTimer);
        }
        
        this.comboTimer = window.setTimeout(() => {
            this.resetCombo();
        }, 1500);
    }

    private resetCombo(): void {
        this.comboCount = 0;
        this.comboDisplay.classList.remove('active', 'mega', 'ultra');
    }

    private activateFinishHimMode(): void {
        this.isFinishHimMode = true;
        this.finishHimScreen.classList.add('active');
        
        // Play dramatic sound
        this.playFinishHimSound();
        
        // Screen flash effect
        document.body.classList.add('finish-him-flash');
        setTimeout(() => {
            document.body.classList.remove('finish-him-flash');
        }, 500);
        
        // Hide after 3 seconds
        setTimeout(() => {
            this.finishHimScreen.classList.remove('active');
        }, 3000);
    }

    private performFinisher(): void {
        this.isGameOver = true;
        
        // Choose random finisher!
        const finishers = [
            { name: 'FATALITY!', animation: 'fatalityMove', duration: 2500 },
            { name: 'K.O.!', animation: 'koMove', duration: 2000 },
            { name: 'DESTROYED!', animation: 'destroyedMove', duration: 2300 },
            { name: 'OVERKILL!', animation: 'overkillMove', duration: 2500 },
            { name: 'REKT!', animation: 'rektMove', duration: 2200 }
        ];
        
        const randomFinisher = finishers[Math.floor(Math.random() * finishers.length)];
        
        // Apply animation
        this.boss.classList.add('fatality');
        this.boss.style.animation = `${randomFinisher.animation} 2s ease-out`;
        
        // Play fatality sound
        this.playFatalitySound();
        
        // Show finisher text
        const fatalityText = document.createElement('div');
        fatalityText.className = 'fatality-text';
        fatalityText.textContent = randomFinisher.name;
        
        // Random color for text
        const colors = ['#FFD700', '#FF0000', '#00FF00', '#FF00FF', '#00FFFF'];
        fatalityText.style.color = colors[Math.floor(Math.random() * colors.length)];
        
        this.damageNumbersContainer.appendChild(fatalityText);
        
        setTimeout(() => {
            fatalityText.remove();
            this.endGame();
        }, randomFinisher.duration);
    }

    private screenShake(): void {
        document.body.classList.add('screen-shake');
        setTimeout(() => {
            document.body.classList.remove('screen-shake');
        }, 300);
    }

    private playFinishHimSound(): void {
        const ctx = this.audioContext;
        const time = ctx.currentTime;
        
        // Deep dramatic sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, time);
        osc.frequency.exponentialRampToValueAtTime(50, time + 1);
        
        gain.gain.setValueAtTime(0.4, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 1);
        
        osc.start(time);
        osc.stop(time + 1);
    }

    private playFatalitySound(): void {
        const ctx = this.audioContext;
        const time = ctx.currentTime;
        
        // Epic victory sound
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        
        osc1.type = 'square';
        osc1.frequency.setValueAtTime(400, time);
        osc1.frequency.exponentialRampToValueAtTime(800, time + 0.5);
        
        gain1.gain.setValueAtTime(0.3, time);
        gain1.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
        
        osc1.start(time);
        osc1.stop(time + 0.5);
        
        // Add explosion
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(100, time + 0.5);
        osc2.frequency.exponentialRampToValueAtTime(30, time + 1.5);
        
        gain2.gain.setValueAtTime(0.5, time + 0.5);
        gain2.gain.exponentialRampToValueAtTime(0.01, time + 1.5);
        
        osc2.start(time + 0.5);
        osc2.stop(time + 1.5);
    }

    private createParticles(x: number, y: number, color: string, count: number): void {
        const rect = this.canvas.getBoundingClientRect();
        const canvasX = x + this.boss.offsetLeft;
        const canvasY = y + this.boss.offsetTop;
        
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = 2 + Math.random() * 4;
            
            this.particles.push({
                x: canvasX,
                y: canvasY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                maxLife: 1,
                color: color,
                size: 3 + Math.random() * 5
            });
        }
    }

    private updateParticles(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2; // gravity
            p.life -= 0.02;
            
            if (p.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }
            
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.globalAlpha = 1;
    }

    private showDamageNumber(x: number, y: number, damage: number): void {
        const damageNum = document.createElement('div');
        damageNum.className = 'damage-number';
        damageNum.textContent = `-${damage}`;
        damageNum.style.left = `${x}px`;
        damageNum.style.top = `${y}px`;
        damageNum.style.color = this.selectedWeapon.color;
        
        this.damageNumbersContainer.appendChild(damageNum);
        
        setTimeout(() => {
            damageNum.remove();
        }, 1000);
    }

    private shakeBoss(): void {
        this.boss.style.animation = 'none';
        setTimeout(() => {
            this.boss.style.animation = 'shake 0.3s';
        }, 10);
        
        // Change boss expression
        const healthPercent = (this.health / this.maxHealth) * 100;
        if (healthPercent < 30) {
            this.boss.classList.add('hurt');
        } else if (healthPercent < 60) {
            this.boss.classList.add('damaged');
        }
    }

    private updateHealth(): void {
        const healthPercent = (this.health / this.maxHealth) * 100;
        this.healthBar.style.width = `${healthPercent}%`;
        this.healthText.textContent = `${Math.round(healthPercent)}%`;
        
        // Change health bar color
        if (healthPercent < 30) {
            this.healthBar.style.backgroundColor = '#e74c3c';
        } else if (healthPercent < 60) {
            this.healthBar.style.backgroundColor = '#f39c12';
        } else {
            this.healthBar.style.backgroundColor = '#2ecc71';
        }
    }

    private updateTotalDamage(): void {
        this.totalDamageElement.textContent = this.totalDamage.toString();
    }

    private updateMoney(): void {
        this.moneyElement.textContent = `$${this.money}`;
    }

    private endGame(): void {
        this.isGameOver = true;
        this.boss.classList.add('defeated');
        
        // Play dramatic death sound
        this.playBossDeathSound();
        
        setTimeout(() => {
            this.gameOverScreen.classList.add('show');
            document.getElementById('finalDamage')!.textContent = this.totalDamage.toString();
            document.getElementById('moneyEarned')!.textContent = `$${this.money}`;
        }, 1000);
    }

    private restart(): void {
        this.health = this.maxHealth;
        this.totalDamage = 0;
        this.money = 1000;
        this.isGameOver = false;
        this.particles = [];
        this.comboCount = 0;
        this.isFinishHimMode = false;
        this.resetCombo();
        
        // Reset weapon costs (all free)
        this.weapons = [
            { id: 'punch', name: '👊 Punch', damage: 5, cost: 0, icon: '👊', color: '#ff6b6b', particleCount: 5, description: 'Basic melee attack', rarity: 'Common', fireRate: 'Fast' },
            { id: 'bat', name: '🏏 Bat', damage: 10, cost: 0, icon: '🏏', color: '#4ecdc4', particleCount: 8, description: 'Swing with force', rarity: 'Common', fireRate: 'Fast' },
            { id: 'hammer', name: '🔨 Hammer', damage: 15, cost: 0, icon: '🔨', color: '#ffe66d', particleCount: 12, description: 'Heavy crushing blow', rarity: 'Uncommon', fireRate: 'Medium' },
            { id: 'knife', name: '🔪 Knife', damage: 20, cost: 0, icon: '🔪', color: '#ff6b9d', particleCount: 15, description: 'Sharp and deadly', rarity: 'Uncommon', fireRate: 'Fast' },
            { id: 'gun', name: '🔫 Gun', damage: 30, cost: 0, icon: '🔫', color: '#c44569', particleCount: 20, description: 'Rapid fire weapon', rarity: 'Rare', fireRate: 'Very Fast' },
            { id: 'bomb', name: '💣 Bomb', damage: 50, cost: 0, icon: '💣', color: '#f38181', particleCount: 30, description: 'Explosive damage', rarity: 'Rare', fireRate: 'Medium' },
            { id: 'lightning', name: '⚡ Lightning', damage: 75, cost: 0, icon: '⚡', color: '#ffeb3b', particleCount: 40, description: 'Electrifying power', rarity: 'Epic', fireRate: 'Fast' },
            { id: 'rocket', name: '🚀 Rocket', damage: 100, cost: 0, icon: '🚀', color: '#ff5722', particleCount: 50, description: 'Ultimate destruction', rarity: 'Legendary', fireRate: 'Medium' }
        ];
        this.selectedWeapon = this.weapons[0];
        
        this.boss.classList.remove('defeated', 'hurt', 'damaged');
        this.gameOverScreen.classList.remove('show');
        
        this.updateHealth();
        this.updateTotalDamage();
        this.updateMoney();
        this.renderWeapons();
    }

    private gameLoop(): void {
        this.updateParticles();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize game when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    new Game();
});

