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
    
    private health: number = 100;
    private maxHealth: number = 100;
    private totalDamage: number = 0;
    private money: number = 1000;
    private particles: Particle[] = [];
    private selectedWeapon: Weapon;
    private isGameOver: boolean = false;
    
    private weapons: Weapon[] = [
        { id: 'punch', name: '👊 Punch', damage: 5, cost: 0, icon: '👊', color: '#ff6b6b', particleCount: 5 },
        { id: 'bat', name: '🏏 Bat', damage: 10, cost: 100, icon: '🏏', color: '#4ecdc4', particleCount: 8 },
        { id: 'hammer', name: '🔨 Hammer', damage: 15, cost: 200, icon: '🔨', color: '#ffe66d', particleCount: 12 },
        { id: 'knife', name: '🔪 Knife', damage: 20, cost: 300, icon: '🔪', color: '#ff6b9d', particleCount: 15 },
        { id: 'gun', name: '🔫 Gun', damage: 30, cost: 500, icon: '🔫', color: '#c44569', particleCount: 20 },
        { id: 'bomb', name: '💣 Bomb', damage: 50, cost: 800, icon: '💣', color: '#f38181', particleCount: 30 },
        { id: 'lightning', name: '⚡ Lightning', damage: 75, cost: 1200, icon: '⚡', color: '#ffeb3b', particleCount: 40 },
        { id: 'rocket', name: '🚀 Rocket', damage: 100, cost: 2000, icon: '🚀', color: '#ff5722', particleCount: 50 }
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
        
        this.selectedWeapon = this.weapons[0];
        
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
    }

    private renderWeapons(): void {
        this.weaponsGrid.innerHTML = '';
        
        this.weapons.forEach(weapon => {
            const weaponCard = document.createElement('div');
            weaponCard.className = 'weapon-card';
            
            if (weapon.id === this.selectedWeapon.id) {
                weaponCard.classList.add('selected');
            }
            
            const canAfford = this.money >= weapon.cost || weapon.cost === 0;
            if (!canAfford) {
                weaponCard.classList.add('locked');
            }
            
            weaponCard.innerHTML = `
                <div class="weapon-icon">${weapon.icon}</div>
                <div class="weapon-name">${weapon.name}</div>
                <div class="weapon-damage">⚔️ ${weapon.damage}</div>
                <div class="weapon-cost">${weapon.cost === 0 ? 'FREE' : '$' + weapon.cost}</div>
            `;
            
            weaponCard.addEventListener('click', () => {
                if (canAfford && this.buyWeapon(weapon)) {
                    this.selectedWeapon = weapon;
                    this.renderWeapons();
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
        
        // Apply damage
        const damage = this.selectedWeapon.damage;
        this.health = Math.max(0, this.health - damage);
        this.totalDamage += damage;
        this.money += damage; // Earn money based on damage
        
        // Update UI
        this.updateHealth();
        this.updateTotalDamage();
        this.updateMoney();
        this.renderWeapons();
        
        // Visual effects
        this.showDamageNumber(event.clientX, event.clientY, damage);
        this.createParticles(x, y, this.selectedWeapon.color, this.selectedWeapon.particleCount);
        this.shakeBoss();
        
        // Check game over
        if (this.health <= 0) {
            this.endGame();
        }
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
        
        // Reset weapon costs
        this.weapons = [
            { id: 'punch', name: '👊 Punch', damage: 5, cost: 0, icon: '👊', color: '#ff6b6b', particleCount: 5 },
            { id: 'bat', name: '🏏 Bat', damage: 10, cost: 100, icon: '🏏', color: '#4ecdc4', particleCount: 8 },
            { id: 'hammer', name: '🔨 Hammer', damage: 15, cost: 200, icon: '🔨', color: '#ffe66d', particleCount: 12 },
            { id: 'knife', name: '🔪 Knife', damage: 20, cost: 300, icon: '🔪', color: '#ff6b9d', particleCount: 15 },
            { id: 'gun', name: '🔫 Gun', damage: 30, cost: 500, icon: '🔫', color: '#c44569', particleCount: 20 },
            { id: 'bomb', name: '💣 Bomb', damage: 50, cost: 800, icon: '💣', color: '#f38181', particleCount: 30 },
            { id: 'lightning', name: '⚡ Lightning', damage: 75, cost: 1200, icon: '⚡', color: '#ffeb3b', particleCount: 40 },
            { id: 'rocket', name: '🚀 Rocket', damage: 100, cost: 2000, icon: '🚀', color: '#ff5722', particleCount: 50 }
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

