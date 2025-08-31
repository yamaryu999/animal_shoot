import { Bounds, EnemyType } from './types';

// ゲームオブジェクトの基本クラス
export abstract class GameObject {
    protected x: number;
    protected y: number;
    protected width: number;
    protected height: number;
    protected speed: number;
    protected color: string;

    constructor(x: number, y: number, width: number, height: number, speed: number, color: string) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.color = color;
    }

    abstract update(): void;
    abstract draw(ctx: CanvasRenderingContext2D): void;

    getBounds(): Bounds {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            color: this.color
        };
    }

    collidesWith(other: GameObject): boolean {
        const bounds1 = this.getBounds();
        const bounds2 = other.getBounds();
        
        return bounds1.x < bounds2.x + bounds2.width &&
               bounds1.x + bounds1.width > bounds2.x &&
               bounds1.y < bounds2.y + bounds2.height &&
               bounds1.y + bounds1.height > bounds2.y;
    }
}

// プレイヤークラス（ネコキャラクター）
export class Player extends GameObject {
    private lives: number;
    private invulnerable: boolean;
    private invulnerableTime: number;

    constructor(x: number, y: number) {
        super(x, y, 40, 40, 5, '#FF6B6B');
        this.lives = 3;
        this.invulnerable = false;
        this.invulnerableTime = 0;
    }

    update(): void {
        // 無敵時間の処理
        if (this.invulnerable) {
            this.invulnerableTime--;
            if (this.invulnerableTime <= 0) {
                this.invulnerable = false;
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        // 無敵時間中は点滅表示
        if (this.invulnerable && Math.floor(this.invulnerableTime / 10) % 2 === 0) {
            return;
        }

        // 超派手なサイバーネコキャラクター
        ctx.save();
        
        // アニメーション用の軽い揺れ
        const bounce = Math.sin(performance.now() * 0.01) * 0.5;
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2 + bounce;
        
        // 超派手なサイバー影（虹色効果）
        const shadowColors = ['#ff006e', '#00ff41', '#8338ec', '#ffbe0b', '#fb5607'];
        const shadowIndex = Math.floor(performance.now() * 0.01) % shadowColors.length;
        ctx.fillStyle = `${shadowColors[shadowIndex]}40`;
        ctx.beginPath();
        ctx.ellipse(centerX, this.y + this.height + 2, this.width / 2.5, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 体（超派手なサイバーパンク風の装甲）
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, this.width / 2);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(0.5, '#16213e');
        gradient.addColorStop(1, '#0f3460');
        ctx.fillStyle = gradient;
        ctx.strokeStyle = '#00ff41';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + 5, this.width / 2.5, this.height / 2.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 超派手なサイバー装甲の装飾（回転するリング）
        const rotation = performance.now() * 0.005;
        ctx.save();
        ctx.translate(centerX, centerY + 5);
        ctx.rotate(rotation);
        ctx.strokeStyle = '#06ffa5';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2.5 - 2, 0, Math.PI * 2);
        ctx.stroke();
        
        // 内側の回転リング
        ctx.rotate(-rotation * 2);
        ctx.strokeStyle = '#ff006e';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2.5 - 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        
        // 頭（超派手なサイバーヘルメット風）
        const headGradient = ctx.createRadialGradient(centerX, centerY - 8, 0, centerX, centerY - 8, this.width / 2.2);
        headGradient.addColorStop(0, '#000428');
        headGradient.addColorStop(0.7, '#001f3f');
        headGradient.addColorStop(1, '#003366');
        ctx.fillStyle = headGradient;
        ctx.strokeStyle = '#00ff41';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(centerX, centerY - 8, this.width / 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 超派手なサイバー耳（アンテナ風、パルス効果付き）
        const pulse = Math.sin(performance.now() * 0.02) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(0, 255, 65, ${pulse})`;
        ctx.strokeStyle = '#06ffa5';
        ctx.lineWidth = 3;
        
        // 左アンテナ（より大きく）
        ctx.beginPath();
        ctx.moveTo(centerX - 15, centerY - 18);
        ctx.lineTo(centerX - 10, centerY - 35);
        ctx.lineTo(centerX - 5, centerY - 18);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // 右アンテナ（より大きく）
        ctx.beginPath();
        ctx.moveTo(centerX + 5, centerY - 18);
        ctx.lineTo(centerX + 10, centerY - 35);
        ctx.lineTo(centerX + 15, centerY - 18);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // アンテナの先端にパーティクル効果
        ctx.fillStyle = '#ff006e';
        ctx.beginPath();
        ctx.arc(centerX - 10, centerY - 35, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 10, centerY - 35, 3, 0, Math.PI * 2);
        ctx.fill();

        // 超派手なサイバー目（HUD風、アニメーション付き）
        const eyePulse = Math.sin(performance.now() * 0.03) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(0, 255, 65, ${eyePulse})`;
        ctx.strokeStyle = '#06ffa5';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX - 8, centerY - 12, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(centerX + 8, centerY - 12, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 目のハイライト（より大きく）
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(centerX - 6, centerY - 14, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 10, centerY - 14, 3, 0, Math.PI * 2);
        ctx.fill();

        // 超派手なサイバー鼻（センサー風、色変化）
        const noseColors = ['#ff006e', '#8338ec', '#ffbe0b', '#fb5607'];
        const noseIndex = Math.floor(performance.now() * 0.02) % noseColors.length;
        ctx.fillStyle = noseColors[noseIndex];
        ctx.strokeStyle = '#00ff41';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY - 2, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 超派手なサイバー口（スピーカー風、音波効果）
        ctx.fillStyle = '#8338ec';
        ctx.strokeStyle = '#00ff41';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 10, 0.2, Math.PI - 0.2);
        ctx.fill();
        ctx.stroke();
        
        // 音波効果
        const waveCount = 3;
        for (let i = 0; i < waveCount; i++) {
            const waveAlpha = 0.3 - (i * 0.1);
            ctx.strokeStyle = `rgba(131, 56, 236, ${waveAlpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(centerX, centerY, 10 + (i * 5), 0.2, Math.PI - 0.2);
            ctx.stroke();
        }
        
        // 超派手なサイバーアーム（武器システム、より大きく）
        ctx.fillStyle = '#1a1a2e';
        ctx.strokeStyle = '#00ff41';
        ctx.lineWidth = 3;
        
        // 左手（より大きく）
        ctx.beginPath();
        ctx.arc(centerX - 22, centerY + 2, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 右手（より大きく）
        ctx.beginPath();
        ctx.arc(centerX + 22, centerY + 2, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // アームの武器エフェクト
        ctx.fillStyle = '#ff006e';
        ctx.beginPath();
        ctx.arc(centerX - 22, centerY + 2, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 22, centerY + 2, 3, 0, Math.PI * 2);
        ctx.fill();

        // 超派手なサイバーエフェクト（パルス + 回転）
        const outerPulse = Math.sin(performance.now() * 0.01) * 0.3 + 0.7;
        ctx.strokeStyle = `rgba(0, 255, 65, ${outerPulse})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY - 8, this.width / 2.2 + 3, 0, Math.PI * 2);
        ctx.stroke();
        
        // 追加の回転エフェクト
        ctx.save();
        ctx.translate(centerX, centerY - 8);
        ctx.rotate(performance.now() * 0.003);
        ctx.strokeStyle = `rgba(255, 0, 110, ${outerPulse})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-this.width / 2.2, 0);
        ctx.lineTo(this.width / 2.2, 0);
        ctx.moveTo(0, -this.width / 2.2);
        ctx.lineTo(0, this.width / 2.2);
        ctx.stroke();
        ctx.restore();

        ctx.restore();
    }

    moveLeft(): void {
        this.x = Math.max(0, this.x - this.speed);
    }

    moveRight(): void {
        this.x = Math.min(400 - this.width, this.x + this.speed);
    }

    takeDamage(): void {
        if (!this.invulnerable) {
            this.lives--;
            this.invulnerable = true;
            this.invulnerableTime = 120; // 2秒間無敵
        }
    }

    getLives(): number {
        return this.lives;
    }

    isAlive(): boolean {
        return this.lives > 0;
    }
}

// 弾クラス
export class Bullet extends GameObject {
    constructor(x: number, y: number) {
        super(x, y, 4, 10, 8, '#F1C40F');
    }

    update(): void {
        this.y -= this.speed;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        
        // 超派手なサイバー弾
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        
        // 超派手な外側のネオン効果（虹色）
        const outerColors = ['#ff006e', '#00ff41', '#8338ec', '#ffbe0b', '#fb5607'];
        const outerIndex = Math.floor(performance.now() * 0.02) % outerColors.length;
        ctx.fillStyle = `${outerColors[outerIndex]}30`;
        ctx.beginPath();
        ctx.arc(centerX, centerY, this.width / 2 + 5, 0, Math.PI * 2);
        ctx.fill();
        
        // 中層のネオン効果
        ctx.fillStyle = `${outerColors[(outerIndex + 1) % outerColors.length]}40`;
        ctx.beginPath();
        ctx.arc(centerX, centerY, this.width / 2 + 3, 0, Math.PI * 2);
        ctx.fill();
        
        // 超派手なサイバー弾の本体（グラデーション）
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, this.width / 2 + 1);
        gradient.addColorStop(0, '#00ff41');
        gradient.addColorStop(0.7, '#06ffa5');
        gradient.addColorStop(1, '#00cc88');
        ctx.fillStyle = gradient;
        ctx.strokeStyle = '#06ffa5';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, this.width / 2 + 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 内側のコア（より大きく）
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(centerX, centerY, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // コアのハイライト
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(centerX - 1, centerY - 1, this.width / 2 - 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 超派手なサイバーエフェクト（多重回転）
        const rotation1 = performance.now() * 0.015;
        const rotation2 = performance.now() * 0.01;
        
        // 第一層の回転エフェクト
        ctx.strokeStyle = '#ff006e';
        ctx.lineWidth = 2;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation1);
        ctx.beginPath();
        ctx.moveTo(-this.width / 2 - 2, 0);
        ctx.lineTo(this.width / 2 + 2, 0);
        ctx.moveTo(0, -this.width / 2 - 2);
        ctx.lineTo(0, this.width / 2 + 2);
        ctx.stroke();
        ctx.restore();
        
        // 第二層の回転エフェクト
        ctx.strokeStyle = '#8338ec';
        ctx.lineWidth = 1;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(-rotation2);
        ctx.beginPath();
        ctx.moveTo(-this.width / 2 - 1, 0);
        ctx.lineTo(this.width / 2 + 1, 0);
        ctx.moveTo(0, -this.width / 2 - 1);
        ctx.lineTo(0, this.width / 2 + 1);
        ctx.stroke();
        ctx.restore();
        
        // 超派手なパルス効果（多重）
        const pulse1 = Math.sin(performance.now() * 0.03) * 0.5 + 0.5;
        const pulse2 = Math.sin(performance.now() * 0.02) * 0.3 + 0.7;
        
        ctx.strokeStyle = `rgba(0, 255, 65, ${pulse1})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, this.width / 2 + 3, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.strokeStyle = `rgba(255, 0, 110, ${pulse2})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, this.width / 2 + 4, 0, Math.PI * 2);
        ctx.stroke();
        
        // 追加の星型エフェクト
        ctx.strokeStyle = '#ffbe0b';
        ctx.lineWidth = 1;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(performance.now() * 0.005);
        for (let i = 0; i < 4; i++) {
            ctx.rotate(Math.PI / 2);
            ctx.beginPath();
            ctx.moveTo(-this.width / 2 - 1, 0);
            ctx.lineTo(this.width / 2 + 1, 0);
            ctx.stroke();
        }
        ctx.restore();
        
        ctx.restore();
    }

    isOffScreen(): boolean {
        return this.y + this.height < 0;
    }
}

// 敵クラス（いろいろなどうぶつ）
export class Enemy extends GameObject {
    private type: EnemyType;
    private animationFrame: number;

    constructor(x: number, y: number, type: EnemyType) {
        const colors = {
            'dog': '#E67E22',
            'bird': '#3498DB',
            'rabbit': '#9B59B6',
            'pig': '#E91E63'
        };
        super(x, y, 35, 35, 2, colors[type] || '#95A5A6');
        this.type = type;
        this.animationFrame = 0;
    }

    update(): void {
        this.y += this.speed;
        this.animationFrame++;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        
        switch (this.type) {
            case 'dog':
                this.drawDog(ctx);
                break;
            case 'bird':
                this.drawBird(ctx);
                break;
            case 'rabbit':
                this.drawRabbit(ctx);
                break;
            case 'pig':
                this.drawPig(ctx);
                break;
        }
        
        ctx.restore();
    }

    private drawDog(ctx: CanvasRenderingContext2D): void {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const bounce = Math.sin(this.animationFrame * 0.1) * 1;
        
        // 超派手なサイバー影（虹色効果）
        const shadowColors = ['#ff006e', '#8338ec', '#ffbe0b', '#fb5607', '#00ff41'];
        const shadowIndex = Math.floor(this.animationFrame * 0.1) % shadowColors.length;
        ctx.fillStyle = `${shadowColors[shadowIndex]}40`;
        ctx.beginPath();
        ctx.ellipse(centerX, this.y + this.height + 2, this.width / 2.5, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 体（超派手なサイバーロボット風、グラデーション付き）
        const bodyGradient = ctx.createRadialGradient(centerX, centerY + bounce, 0, centerX, centerY + bounce, this.width / 2.5);
        bodyGradient.addColorStop(0, '#1a1a2e');
        bodyGradient.addColorStop(0.6, '#16213e');
        bodyGradient.addColorStop(1, '#0f3460');
        ctx.fillStyle = bodyGradient;
        ctx.strokeStyle = '#ff006e';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + bounce, this.width / 2.5, this.height / 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 超派手なサイバー装甲の装飾（回転する装飾）
        const rotation = this.animationFrame * 0.02;
        ctx.save();
        ctx.translate(centerX, centerY + bounce);
        ctx.rotate(rotation);
        
        ctx.fillStyle = '#8338ec';
        ctx.beginPath();
        ctx.arc(-8, -5, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(6, 3, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // 追加の装飾リング
        ctx.strokeStyle = '#ffbe0b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2.5 - 3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // 超派手なサイバーアンテナ（耳、より大きく）
        const antennaPulse = Math.sin(this.animationFrame * 0.15) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(255, 0, 110, ${antennaPulse})`;
        ctx.strokeStyle = '#8338ec';
        ctx.lineWidth = 3;
        
        // 左アンテナ（より大きく）
        ctx.beginPath();
        ctx.ellipse(centerX - 15, centerY - 8 + bounce, 8, 15, Math.PI / 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 右アンテナ（より大きく）
        ctx.beginPath();
        ctx.ellipse(centerX + 15, centerY - 8 + bounce, 8, 15, -Math.PI / 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // アンテナの先端にパーティクル効果
        ctx.fillStyle = '#ffbe0b';
        ctx.beginPath();
        ctx.arc(centerX - 15, centerY - 20 + bounce, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 15, centerY - 20 + bounce, 4, 0, Math.PI * 2);
        ctx.fill();

        // 超派手なサイバーセンサー（目、アニメーション付き）
        const eyePulse = Math.sin(this.animationFrame * 0.2) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(255, 0, 110, ${eyePulse})`;
        ctx.strokeStyle = '#8338ec';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX - 8, centerY - 8 + bounce, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(centerX + 8, centerY - 8 + bounce, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // センサーのハイライト（より大きく）
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(centerX - 6, centerY - 10 + bounce, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 10, centerY - 10 + bounce, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // 超派手なサイバーセンサー（鼻、色変化）
        const noseColors = ['#00ff41', '#ffbe0b', '#fb5607', '#8338ec'];
        const noseIndex = Math.floor(this.animationFrame * 0.1) % noseColors.length;
        ctx.fillStyle = noseColors[noseIndex];
        ctx.strokeStyle = '#ff006e';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY - 2 + bounce, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 超派手なサイバースピーカー（口、音波効果）
        ctx.fillStyle = '#8338ec';
        ctx.strokeStyle = '#ff006e';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY + 2 + bounce, 8, 0.3, Math.PI - 0.3);
        ctx.fill();
        ctx.stroke();
        
        // 音波効果
        const waveCount = 3;
        for (let i = 0; i < waveCount; i++) {
            const waveAlpha = 0.4 - (i * 0.1);
            ctx.strokeStyle = `rgba(131, 56, 236, ${waveAlpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(centerX, centerY + 2 + bounce, 8 + (i * 4), 0.3, Math.PI - 0.3);
            ctx.stroke();
        }
        
        // 超派手なサイバーエフェクト（パルス + 回転）
        const outerPulse = Math.sin(this.animationFrame * 0.1) * 0.5 + 0.5;
        ctx.strokeStyle = `rgba(255, 0, 110, ${outerPulse})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY + bounce, this.width / 2.5 + 3, 0, Math.PI * 2);
        ctx.stroke();
        
        // 追加の回転エフェクト
        ctx.save();
        ctx.translate(centerX, centerY + bounce);
        ctx.rotate(this.animationFrame * 0.01);
        ctx.strokeStyle = `rgba(255, 190, 11, ${outerPulse})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-this.width / 2.5, 0);
        ctx.lineTo(this.width / 2.5, 0);
        ctx.moveTo(0, -this.width / 2.5);
        ctx.lineTo(0, this.width / 2.5);
        ctx.stroke();
        ctx.restore();
    }

    private drawBird(ctx: CanvasRenderingContext2D): void {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const bounce = Math.sin(this.animationFrame * 0.15) * 1.5;
        
        // 超派手なサイバー影（虹色効果）
        const shadowColors = ['#0066ff', '#00ccff', '#ff006e', '#ffbe0b', '#8338ec'];
        const shadowIndex = Math.floor(this.animationFrame * 0.15) % shadowColors.length;
        ctx.fillStyle = `${shadowColors[shadowIndex]}40`;
        ctx.beginPath();
        ctx.ellipse(centerX, this.y + this.height + 2, this.width / 2.5, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 体（超派手なサイバードローン風、グラデーション付き）
        const bodyGradient = ctx.createRadialGradient(centerX, centerY + bounce, 0, centerX, centerY + bounce, this.width / 2.2);
        bodyGradient.addColorStop(0, '#000428');
        bodyGradient.addColorStop(0.6, '#001f3f');
        bodyGradient.addColorStop(1, '#003366');
        ctx.fillStyle = bodyGradient;
        ctx.strokeStyle = '#0066ff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + bounce, this.width / 2.2, this.height / 2.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 超派手なサイバー装甲の装飾（回転する装飾）
        const rotation = this.animationFrame * 0.03;
        ctx.save();
        ctx.translate(centerX, centerY + bounce);
        ctx.rotate(rotation);
        
        ctx.fillStyle = '#00ccff';
        ctx.beginPath();
        ctx.ellipse(-6, -3, 5, 7, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(6, -3, 5, 7, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        
        // 追加の装飾リング
        ctx.strokeStyle = '#ffbe0b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2.2 - 3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // 超派手なサイバー翼（プロペラ風、より大きく）
        const wingPulse = Math.sin(this.animationFrame * 0.2) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(0, 102, 255, ${wingPulse})`;
        ctx.strokeStyle = '#00ccff';
        ctx.lineWidth = 3;
        const wingFlap = Math.sin(this.animationFrame * 0.4) * 20;
        
        // 左プロペラ（より大きく）
        ctx.save();
        ctx.translate(centerX - 18, centerY + bounce);
        ctx.rotate((wingFlap * Math.PI) / 180);
        ctx.beginPath();
        ctx.ellipse(0, 0, 10, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        
        // 右プロペラ（より大きく）
        ctx.save();
        ctx.translate(centerX + 18, centerY + bounce);
        ctx.rotate((-wingFlap * Math.PI) / 180);
        ctx.beginPath();
        ctx.ellipse(0, 0, 10, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // プロペラの先端にパーティクル効果
        ctx.fillStyle = '#ff006e';
        ctx.save();
        ctx.translate(centerX - 18, centerY + bounce);
        ctx.rotate((wingFlap * Math.PI) / 180);
        ctx.beginPath();
        ctx.arc(10, 0, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        ctx.save();
        ctx.translate(centerX + 18, centerY + bounce);
        ctx.rotate((-wingFlap * Math.PI) / 180);
        ctx.beginPath();
        ctx.arc(10, 0, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 超派手なサイバーセンサー（目、アニメーション付き）
        const eyePulse = Math.sin(this.animationFrame * 0.25) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(0, 102, 255, ${eyePulse})`;
        ctx.strokeStyle = '#00ccff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX - 8, centerY - 6 + bounce, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(centerX + 8, centerY - 6 + bounce, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // センサーのハイライト（より大きく）
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(centerX - 6, centerY - 8 + bounce, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 10, centerY - 8 + bounce, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // 超派手なサイバーレーザー（くちばし、色変化）
        const beakColors = ['#ff006e', '#ffbe0b', '#fb5607', '#8338ec'];
        const beakIndex = Math.floor(this.animationFrame * 0.15) % beakColors.length;
        ctx.fillStyle = beakColors[beakIndex];
        ctx.strokeStyle = '#0066ff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 2 + bounce);
        ctx.lineTo(centerX + 10, centerY - 10 + bounce);
        ctx.lineTo(centerX + 8, centerY + 2 + bounce);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // レーザーの光線効果
        const laserCount = 3;
        for (let i = 0; i < laserCount; i++) {
            const laserAlpha = 0.4 - (i * 0.1);
            ctx.strokeStyle = `rgba(255, 0, 110, ${laserAlpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY - 2 + bounce);
            ctx.lineTo(centerX + 10 + (i * 3), centerY - 10 + bounce);
            ctx.stroke();
        }
        
        // 超派手なサイバーエフェクト（パルス + 回転）
        const outerPulse = Math.sin(this.animationFrame * 0.15) * 0.5 + 0.5;
        ctx.strokeStyle = `rgba(0, 102, 255, ${outerPulse})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY + bounce, this.width / 2.2 + 3, 0, Math.PI * 2);
        ctx.stroke();
        
        // 追加の回転エフェクト
        ctx.save();
        ctx.translate(centerX, centerY + bounce);
        ctx.rotate(this.animationFrame * 0.02);
        ctx.strokeStyle = `rgba(0, 204, 255, ${outerPulse})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-this.width / 2.2, 0);
        ctx.lineTo(this.width / 2.2, 0);
        ctx.moveTo(0, -this.width / 2.2);
        ctx.lineTo(0, this.width / 2.2);
        ctx.stroke();
        ctx.restore();
    }

    private drawRabbit(ctx: CanvasRenderingContext2D): void {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const bounce = Math.sin(this.animationFrame * 0.12) * 1;
        
        // 超派手な影（虹色効果）
        const shadowColors = ['#FF69B4', '#9370DB', '#FFB6C1', '#FF1493', '#FFC0CB'];
        const shadowIndex = Math.floor(this.animationFrame * 0.12) % shadowColors.length;
        ctx.fillStyle = `${shadowColors[shadowIndex]}40`;
        ctx.beginPath();
        ctx.ellipse(centerX, this.y + this.height + 2, this.width / 2.5, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 体（超派手なカップヘッド風の白いベース、グラデーション付き）
        const bodyGradient = ctx.createRadialGradient(centerX, centerY + bounce, 0, centerX, centerY + bounce, this.width / 2.3);
        bodyGradient.addColorStop(0, '#FFFFFF');
        bodyGradient.addColorStop(0.7, '#F8F8FF');
        bodyGradient.addColorStop(1, '#E6E6FA');
        ctx.fillStyle = bodyGradient;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + bounce, this.width / 2.3, this.height / 2.3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 超派手な紫の斑点模様（アニメーション付き）
        const spotPulse = Math.sin(this.animationFrame * 0.1) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(147, 112, 219, ${spotPulse})`;
        ctx.beginPath();
        ctx.arc(centerX - 5, centerY - 4 + bounce, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 7, centerY + 2 + bounce, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // 追加の装飾斑点
        ctx.fillStyle = `rgba(255, 105, 180, ${spotPulse})`;
        ctx.beginPath();
        ctx.arc(centerX - 2, centerY + 6 + bounce, 2, 0, Math.PI * 2);
        ctx.fill();

        // 超派手なカップヘッド風の長い耳（アニメーション付き、より大きく）
        const earPulse = Math.sin(this.animationFrame * 0.15) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(255, 182, 193, ${earPulse})`;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        const earSway = Math.sin(this.animationFrame * 0.08) * 8;
        
        // 左耳（より大きく）
        ctx.save();
        ctx.translate(centerX - 10, centerY - 18 + bounce);
        ctx.rotate((earSway * Math.PI) / 180);
        ctx.beginPath();
        ctx.ellipse(0, 0, 5, 18, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        
        // 右耳（より大きく）
        ctx.save();
        ctx.translate(centerX + 10, centerY - 18 + bounce);
        ctx.rotate((-earSway * Math.PI) / 180);
        ctx.beginPath();
        ctx.ellipse(0, 0, 5, 18, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        
        // 耳の内側（より派手）
        ctx.fillStyle = `rgba(255, 105, 180, ${earPulse})`;
        ctx.save();
        ctx.translate(centerX - 10, centerY - 18 + bounce);
        ctx.rotate((earSway * Math.PI) / 180);
        ctx.beginPath();
        ctx.ellipse(0, 0, 3, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        ctx.save();
        ctx.translate(centerX + 10, centerY - 18 + bounce);
        ctx.rotate((-earSway * Math.PI) / 180);
        ctx.beginPath();
        ctx.ellipse(0, 0, 3, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 耳の先端にパーティクル効果
        ctx.fillStyle = '#FF1493';
        ctx.save();
        ctx.translate(centerX - 10, centerY - 18 + bounce);
        ctx.rotate((earSway * Math.PI) / 180);
        ctx.beginPath();
        ctx.arc(0, -18, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        ctx.save();
        ctx.translate(centerX + 10, centerY - 18 + bounce);
        ctx.rotate((-earSway * Math.PI) / 180);
        ctx.beginPath();
        ctx.arc(0, -18, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 超派手なカップヘッド風の大きな目（アニメーション付き）
        const eyePulse = Math.sin(this.animationFrame * 0.2) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(0, 0, 0, ${eyePulse})`;
        ctx.beginPath();
        ctx.arc(centerX - 8, centerY - 6 + bounce, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 8, centerY - 6 + bounce, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // 目のハイライト（より大きく）
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(centerX - 6, centerY - 8 + bounce, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 10, centerY - 8 + bounce, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // 超派手なピンクの鼻（ハート型風、色変化）
        const noseColors = ['#FF1493', '#FF69B4', '#FFB6C1', '#FFC0CB'];
        const noseIndex = Math.floor(this.animationFrame * 0.1) % noseColors.length;
        ctx.fillStyle = noseColors[noseIndex];
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX - 1, centerY - 1 + bounce, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 1, centerY - 1 + bounce, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(centerX - 3, centerY + bounce);
        ctx.lineTo(centerX, centerY + 4 + bounce);
        ctx.lineTo(centerX + 3, centerY + bounce);
        ctx.fill();
        
        // 超派手な前歯（より大きく）
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(centerX - 3, centerY + 4 + bounce, 3, 5);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.rect(centerX + 1, centerY + 4 + bounce, 3, 5);
        ctx.fill();
        ctx.stroke();
        
        // 歯のハイライト
        ctx.fillStyle = '#FFFFE0';
        ctx.beginPath();
        ctx.rect(centerX - 2, centerY + 5 + bounce, 2, 3);
        ctx.fill();
        ctx.beginPath();
        ctx.rect(centerX + 2, centerY + 5 + bounce, 2, 3);
        ctx.fill();
        
        // 超派手なエフェクト（パルス + 回転）
        const outerPulse = Math.sin(this.animationFrame * 0.12) * 0.5 + 0.5;
        ctx.strokeStyle = `rgba(255, 105, 180, ${outerPulse})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY + bounce, this.width / 2.3 + 3, 0, Math.PI * 2);
        ctx.stroke();
        
        // 追加の回転エフェクト
        ctx.save();
        ctx.translate(centerX, centerY + bounce);
        ctx.rotate(this.animationFrame * 0.01);
        ctx.strokeStyle = `rgba(147, 112, 219, ${outerPulse})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-this.width / 2.3, 0);
        ctx.lineTo(this.width / 2.3, 0);
        ctx.moveTo(0, -this.width / 2.3);
        ctx.lineTo(0, this.width / 2.3);
        ctx.stroke();
        ctx.restore();
    }

    private drawPig(ctx: CanvasRenderingContext2D): void {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const bounce = Math.sin(this.animationFrame * 0.08) * 2;
        
        // 超派手な影（虹色効果、より大きく）
        const shadowColors = ['#FF69B4', '#FFB6C1', '#FF1493', '#FFC0CB', '#FF69B4'];
        const shadowIndex = Math.floor(this.animationFrame * 0.08) % shadowColors.length;
        ctx.fillStyle = `${shadowColors[shadowIndex]}50`;
        ctx.beginPath();
        ctx.ellipse(centerX, this.y + this.height + 3, this.width / 2, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 体（超派手なカップヘッド風の白いベース、グラデーション付き、より大きく）
        const bodyGradient = ctx.createRadialGradient(centerX, centerY + bounce, 0, centerX, centerY + bounce, this.width / 2);
        bodyGradient.addColorStop(0, '#FFFFFF');
        bodyGradient.addColorStop(0.7, '#F8F8FF');
        bodyGradient.addColorStop(1, '#E6E6FA');
        ctx.fillStyle = bodyGradient;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + bounce, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 超派手なピンクの斑点模様（アニメーション付き）
        const spotPulse = Math.sin(this.animationFrame * 0.1) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(255, 105, 180, ${spotPulse})`;
        ctx.beginPath();
        ctx.arc(centerX - 8, centerY - 6 + bounce, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 6, centerY + 4 + bounce, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX - 2, centerY + 8 + bounce, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // 追加の装飾斑点
        ctx.fillStyle = `rgba(255, 182, 193, ${spotPulse})`;
        ctx.beginPath();
        ctx.arc(centerX + 8, centerY - 4 + bounce, 2, 0, Math.PI * 2);
        ctx.fill();

        // 超派手なカップヘッド風の小さな三角耳（より大きく）
        const earPulse = Math.sin(this.animationFrame * 0.15) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(255, 182, 193, ${earPulse})`;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        
        // 左耳（より大きく）
        ctx.beginPath();
        ctx.moveTo(centerX - 15, centerY - 15 + bounce);
        ctx.lineTo(centerX - 10, centerY - 25 + bounce);
        ctx.lineTo(centerX - 5, centerY - 15 + bounce);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // 右耳（より大きく）
        ctx.beginPath();
        ctx.moveTo(centerX + 5, centerY - 15 + bounce);
        ctx.lineTo(centerX + 10, centerY - 25 + bounce);
        ctx.lineTo(centerX + 15, centerY - 15 + bounce);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 耳の先端にパーティクル効果
        ctx.fillStyle = '#FF1493';
        ctx.beginPath();
        ctx.arc(centerX - 10, centerY - 25 + bounce, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 10, centerY - 25 + bounce, 3, 0, Math.PI * 2);
        ctx.fill();

        // 超派手なカップヘッド風の大きな目（アニメーション付き、より怒った表情）
        const eyePulse = Math.sin(this.animationFrame * 0.2) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(0, 0, 0, ${eyePulse})`;
        ctx.beginPath();
        ctx.arc(centerX - 10, centerY - 8 + bounce, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 10, centerY - 8 + bounce, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // 目のハイライト（より大きく）
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(centerX - 8, centerY - 12 + bounce, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 12, centerY - 12 + bounce, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // 超派手な怒った眉毛（アニメーション付き）
        const eyebrowPulse = Math.sin(this.animationFrame * 0.1) * 0.3 + 0.7;
        ctx.strokeStyle = `rgba(0, 0, 0, ${eyebrowPulse})`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(centerX - 15, centerY - 15 + bounce);
        ctx.lineTo(centerX - 5, centerY - 8 + bounce);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(centerX + 5, centerY - 8 + bounce);
        ctx.lineTo(centerX + 15, centerY - 15 + bounce);
        ctx.stroke();

        // 超派手なカップヘッド風の大きな豚の鼻（色変化）
        const noseColors = ['#FF1493', '#FF69B4', '#FFB6C1', '#FFC0CB'];
        const noseIndex = Math.floor(this.animationFrame * 0.1) % noseColors.length;
        ctx.fillStyle = noseColors[noseIndex];
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + 2 + bounce, 7, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 鼻の穴（より大きく）
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(centerX - 3, centerY + 2 + bounce, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 3, centerY + 2 + bounce, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 超派手な怒った口（より大きく）
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY + 10 + bounce, 8, 0.8, Math.PI - 0.8);
        ctx.stroke();
        
        // 超派手な牙（より大きく）
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX - 6, centerY + 8 + bounce);
        ctx.lineTo(centerX - 3, centerY + 15 + bounce);
        ctx.lineTo(centerX - 8, centerY + 12 + bounce);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(centerX + 6, centerY + 8 + bounce);
        ctx.lineTo(centerX + 3, centerY + 15 + bounce);
        ctx.lineTo(centerX + 8, centerY + 12 + bounce);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // 牙のハイライト
        ctx.fillStyle = '#FFFFE0';
        ctx.beginPath();
        ctx.moveTo(centerX - 5, centerY + 9 + bounce);
        ctx.lineTo(centerX - 3, centerY + 13 + bounce);
        ctx.lineTo(centerX - 7, centerY + 11 + bounce);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(centerX + 5, centerY + 9 + bounce);
        ctx.lineTo(centerX + 3, centerY + 13 + bounce);
        ctx.lineTo(centerX + 7, centerY + 11 + bounce);
        ctx.closePath();
        ctx.fill();
        
        // 超派手なエフェクト（パルス + 回転）
        const outerPulse = Math.sin(this.animationFrame * 0.08) * 0.5 + 0.5;
        ctx.strokeStyle = `rgba(255, 105, 180, ${outerPulse})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY + bounce, this.width / 2 + 4, 0, Math.PI * 2);
        ctx.stroke();
        
        // 追加の回転エフェクト
        ctx.save();
        ctx.translate(centerX, centerY + bounce);
        ctx.rotate(this.animationFrame * 0.01);
        ctx.strokeStyle = `rgba(255, 182, 193, ${outerPulse})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-this.width / 2, 0);
        ctx.lineTo(this.width / 2, 0);
        ctx.moveTo(0, -this.width / 2);
        ctx.lineTo(0, this.width / 2);
        ctx.stroke();
        ctx.restore();
    }

    isOffScreen(): boolean {
        return this.y > 600;
    }
}

// パーティクルエフェクトクラス
export class Particle {
    private x: number;
    private y: number;
    private vx: number;
    private vy: number;
    private life: number;
    private maxLife: number;
    private color: string;

    constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 10;
        this.vy = (Math.random() - 0.5) * 10;
        this.maxLife = 30;
        this.life = this.maxLife;
        this.color = color;
    }

    update(): boolean {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.3; // 重力
        this.life--;
        return this.life > 0;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const alpha = this.life / this.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

