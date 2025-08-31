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
    private animationTime: number; // 敵のアニメーション時間
    private isMoving: boolean; // 敵が移動しているかどうか
    private attackMode: boolean; // 敵が攻撃モードにあるかどうか
    private attackTime: number; // 攻撃モードの時間
    private rageMode: boolean; // 敵がラージモードにあるかどうか
    private rageTime: number; // ラージモードの時間
    private breathingEffect: number; // 呼吸エフェクトの強さ

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
        this.animationTime = 0;
        this.isMoving = false;
        this.attackMode = false;
        this.attackTime = 0;
        this.rageMode = false;
        this.rageTime = 0;
        this.breathingEffect = 1;
    }

    update(): void {
        this.animationTime += 0.01; // アニメーション時間を進める
        this.breathingEffect = 1 + Math.sin(this.animationTime * 10) * 0.1; // 呼吸エフェクト

        // 移動モードの切り替え
        if (this.animationTime > 100 && this.animationTime < 200) {
            this.isMoving = true;
        } else if (this.animationTime > 300 && this.animationTime < 400) {
            this.isMoving = false;
        }

        // 攻撃モードの切り替え
        if (this.animationTime > 250 && this.animationTime < 350) {
            this.attackMode = true;
            this.attackTime = 0;
        } else if (this.animationTime > 450 && this.animationTime < 550) {
            this.attackMode = false;
            this.attackTime = 0;
        }

        // ラージモードの切り替え
        if (this.animationTime > 500 && this.animationTime < 600) {
            this.rageMode = true;
            this.rageTime = 0;
        } else if (this.animationTime > 700 && this.animationTime < 800) {
            this.rageMode = false;
            this.rageTime = 0;
        }

        this.y += this.speed;
        this.animationFrame++;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        
        // 滑らかなアニメーション用の複数の揺れ効果
        const bounce = Math.sin(this.animationTime * 8) * 0.3;
        const sway = Math.sin(this.animationTime * 12) * 0.2;
        const pulse = Math.sin(this.animationTime * 6) * 0.1;
        
        // 移動に応じた追加のアニメーション
        const movementBounce = this.isMoving ? Math.sin(this.animationTime * 20) * 0.4 : 0;
        const movementSway = this.isMoving ? Math.sin(this.animationTime * 15) * 0.3 : 0;
        
        // 攻撃モード効果
        const attackEffect = this.attackMode ? Math.sin(this.attackTime * 40) * 0.3 : 0;
        
        // ラージモード効果
        const rageEffect = this.rageMode ? Math.sin(this.rageTime * 30) * 0.4 : 0;
        
        // 体力効果
        const healthEffect = this.getHealthPercentage() * 0.5;
        
        const centerX = this.x + this.width / 2 + sway + movementSway;
        const centerY = this.y + this.height / 2 + bounce + movementBounce + attackEffect + rageEffect;
        
        // ラージモード時のオーラ
        if (this.rageMode) {
            const rageColors = ['#ff0000', '#ff6600', '#ffcc00'];
            const rageIndex = Math.floor(this.rageTime * 20) % rageColors.length;
            ctx.strokeStyle = `${rageColors[rageIndex]}80`;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(centerX, centerY, this.width / 2 + 15 + rageEffect * 8, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // 攻撃モード時のオーラ
        if (this.attackMode) {
            const attackColors = ['#ff006e', '#00ff41', '#8338ec'];
            const attackIndex = Math.floor(this.attackTime * 30) % attackColors.length;
            ctx.strokeStyle = `${attackColors[attackIndex]}60`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(centerX, centerY, this.width / 2 + 10 + attackEffect * 5, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // 超派手なサイバー影（虹色効果 + 移動エフェクト + 攻撃エフェクト）
        const shadowColors = ['#ff006e', '#00ff41', '#8338ec', '#ffbe0b', '#fb5607'];
        const shadowIndex = Math.floor(this.animationTime * 10) % shadowColors.length;
        const shadowAlpha = this.isMoving ? 0.6 : 0.4;
        const shadowScale = this.attackMode ? 1.2 : 1.0;
        
        ctx.fillStyle = `${shadowColors[shadowIndex]}${Math.floor(shadowAlpha * 255).toString(16).padStart(2, '0')}`;
        ctx.beginPath();
        ctx.ellipse(centerX, this.y + this.height + 2, this.width / 2.5 * shadowScale, 4 * shadowScale, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 移動時の追加影エフェクト
        if (this.isMoving) {
            ctx.fillStyle = `${shadowColors[(shadowIndex + 1) % shadowColors.length]}20`;
            ctx.beginPath();
            ctx.ellipse(centerX, this.y + this.height + 1, this.width / 2.5, 3, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // 体（超派手なサイバーパンク風の装甲 + 呼吸エフェクト + 攻撃エフェクト）
        ctx.save();
        ctx.translate(centerX, centerY + 5);
        ctx.scale(this.breathingEffect * (1 + attackEffect * 0.2), this.breathingEffect * (1 + attackEffect * 0.2));
        
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.width / 2);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(0.5, '#16213e');
        gradient.addColorStop(1, '#0f3460');
        ctx.fillStyle = gradient;
        ctx.strokeStyle = `rgba(0, 255, 65, ${0.8 + healthEffect})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width / 2.5, this.height / 2.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 超派手なサイバー装甲の装飾（回転するリング + 移動エフェクト + 攻撃エフェクト）
        const rotation = this.animationTime * 8;
        const armorMovementRotation = this.isMoving ? this.animationTime * 20 : 0;
        const attackRotation = this.attackMode ? this.attackTime * 100 : 0;
        const rageRotation = this.rageMode ? this.rageTime * 50 : 0;
        
        ctx.strokeStyle = `rgba(6, 255, 165, ${0.8 + healthEffect})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2.5 + 3, 0, Math.PI * 2);
        ctx.stroke();
        
        // 内側の回転リング（移動時に高速回転 + 攻撃時に超高速回転）
        ctx.rotate(-rotation * 2 - armorMovementRotation - attackRotation - rageRotation);
        ctx.strokeStyle = `rgba(255, 0, 110, ${0.8 + healthEffect})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2.5 + 1, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        
        // 頭（超派手なサイバーヘルメット風 + 攻撃エフェクト）
        ctx.save();
        ctx.translate(centerX, centerY - 8);
        ctx.scale(this.breathingEffect * 0.9 * (1 + attackEffect * 0.3), this.breathingEffect * 0.9 * (1 + attackEffect * 0.3));
        
        const headGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.width / 2.2);
        headGradient.addColorStop(0, '#000428');
        headGradient.addColorStop(0.7, '#001f3f');
        headGradient.addColorStop(1, '#004e92');
        ctx.fillStyle = headGradient;
        ctx.strokeStyle = `rgba(0, 255, 65, ${0.8 + healthEffect})`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // 超派手なサイバー耳（アンテナ風、パルス効果付き + 移動エフェクト + 攻撃エフェクト）
        const earPulse = Math.sin(this.animationTime * 15) * 0.3 + 0.7;
        const earSway = this.isMoving ? Math.sin(this.animationTime * 25) * 0.2 : 0;
        const earAttack = this.attackMode ? Math.sin(this.attackTime * 60) * 0.3 : 0;
        
        ctx.fillStyle = `rgba(0, 255, 65, ${earPulse + healthEffect})`;
        ctx.strokeStyle = '#06ffa5';
        ctx.lineWidth = 3;
        
        // 左アンテナ（より大きく + 移動エフェクト + 攻撃エフェクト）
        ctx.save();
        ctx.translate(centerX - 15 + earSway + earAttack, centerY - 18);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-5, -17);
        ctx.lineTo(5, -17);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        
        // 右アンテナ（より大きく + 移動エフェクト + 攻撃エフェクト）
        ctx.save();
        ctx.translate(centerX + 15 - earSway - earAttack, centerY - 18);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(5, -17);
        ctx.lineTo(-5, -17);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // アンテナの先端にパーティクル効果（移動時に強化 + 攻撃時に強化）
        const particleIntensity = this.isMoving ? 1.0 : 0.7;
        const attackParticle = this.attackMode ? 1.5 : 1.0;
        ctx.fillStyle = `rgba(255, 0, 110, ${particleIntensity * attackParticle + healthEffect})`;
        ctx.beginPath();
        ctx.arc(centerX - 15 + earSway + earAttack, centerY - 35, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 15 - earSway - earAttack, centerY - 35, 3, 0, Math.PI * 2);
        ctx.fill();

        // 超派手なサイバー目（HUD風、アニメーション付き + 移動エフェクト + 攻撃エフェクト + ラージエフェクト）
        const eyePulse = Math.sin(this.animationTime * 20) * 0.5 + 0.5;
        const eyeSquint = this.isMoving ? Math.sin(this.animationTime * 30) * 0.1 : 0;
        const eyeAttack = this.attackMode ? Math.sin(this.attackTime * 60) * 0.2 : 0;
        const eyeRage = this.rageMode ? Math.sin(this.rageTime * 40) * 0.3 : 0;
        
        // ラージモード時は目が赤くなる
        const eyeColor = this.rageMode ? `rgba(255, 0, 0, ${eyePulse + healthEffect})` : `rgba(0, 255, 65, ${eyePulse + healthEffect})`;
        ctx.fillStyle = eyeColor;
        ctx.strokeStyle = this.rageMode ? '#ff0000' : '#06ffa5';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX - 8, centerY - 12, 7 - eyeSquint + eyeAttack + eyeRage, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(centerX + 8, centerY - 12, 7 - eyeSquint + eyeAttack + eyeRage, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 目のハイライト（より大きく + 移動エフェクト + 攻撃エフェクト）
        const highlightOffset = this.isMoving ? Math.sin(this.animationTime * 40) * 0.5 : 0;
        const attackHighlight = this.attackMode ? Math.sin(this.attackTime * 80) * 0.3 : 0;
        ctx.fillStyle = this.rageMode ? '#ffcccc' : '#ffffff';
        ctx.beginPath();
        ctx.arc(centerX - 6 + highlightOffset + attackHighlight, centerY - 14, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 10 - highlightOffset - attackHighlight, centerY - 14, 3, 0, Math.PI * 2);
        ctx.fill();

        // 超派手なサイバー鼻（センサー風、色変化 + 移動エフェクト + 攻撃エフェクト）
        const noseColors = ['#ff006e', '#8338ec', '#ffbe0b', '#fb5607'];
        const noseIndex = Math.floor(this.animationTime * 15) % noseColors.length;
        const nosePulse = Math.sin(this.animationTime * 25) * 0.2 + 0.8;
        const noseAttack = this.attackMode ? Math.sin(this.attackTime * 70) * 0.3 : 0;
        
        ctx.fillStyle = noseColors[noseIndex];
        ctx.strokeStyle = '#00ff41';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY - 2, (4 + noseAttack) * nosePulse * (1 + healthEffect), 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 超派手なサイバー口（スピーカー風、音波効果 + 移動エフェクト + 攻撃エフェクト）
        const mouthPulse = Math.sin(this.animationTime * 18) * 0.1 + 0.9;
        const attackMouth = this.attackMode ? Math.sin(this.attackTime * 50) * 0.2 : 0;
        const rageMouth = this.rageMode ? Math.sin(this.rageTime * 35) * 0.4 : 0;
        ctx.fillStyle = this.rageMode ? '#ff0000' : '#8338ec';
        ctx.strokeStyle = this.rageMode ? '#ff6666' : '#00ff41';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, (10 + attackMouth + rageMouth) * mouthPulse, 0.2, Math.PI - 0.2);
        ctx.fill();
        ctx.stroke();
        
        // 音波効果（移動時に強化 + 攻撃時に強化 + ラージ時に強化）
        const waveCount = this.isMoving ? 4 : (this.attackMode ? 5 : (this.rageMode ? 6 : 3));
        for (let i = 0; i < waveCount; i++) {
            const waveAlpha = (0.3 - (i * 0.1)) * (this.isMoving ? 1.5 : 1.0) * (this.attackMode ? 2.0 : 1.0) * (this.rageMode ? 2.5 : 1.0);
            ctx.strokeStyle = this.rageMode ? `rgba(255, 0, 0, ${waveAlpha})` : `rgba(131, 56, 236, ${waveAlpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(centerX, centerY, (10 + (i * 5) + attackMouth + rageMouth) * mouthPulse, 0.2, Math.PI - 0.2);
            ctx.stroke();
        }
        
        // 超派手なサイバーアーム（武器システム、より大きく + 移動エフェクト + 攻撃エフェクト）
        const armSway = this.isMoving ? Math.sin(this.animationTime * 35) * 0.3 : 0;
        const armPulse = Math.sin(this.animationTime * 22) * 0.1 + 0.9;
        const attackArm = this.attackMode ? Math.sin(this.attackTime * 70) * 0.4 : 0;
        const rageArm = this.rageMode ? Math.sin(this.rageTime * 45) * 0.5 : 0;
        
        ctx.fillStyle = '#1a1a2e';
        ctx.strokeStyle = this.rageMode ? '#ff0000' : '#00ff41';
        ctx.lineWidth = 3;
        
        // 左手（より大きく + 移動エフェクト + 攻撃エフェクト）
        ctx.save();
        ctx.translate(centerX - 22 + armSway + attackArm + rageArm, centerY + 2);
        ctx.beginPath();
        ctx.arc(0, 0, (6 + attackArm + rageArm) * armPulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        
        // 右手（より大きく + 移動エフェクト + 攻撃エフェクト）
        ctx.save();
        ctx.translate(centerX + 22 - armSway - attackArm - rageArm, centerY + 2);
        ctx.beginPath();
        ctx.arc(0, 0, (6 + attackArm + rageArm) * armPulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // アームの武器エフェクト（移動時に強化 + 攻撃時に強化 + ラージ時に強化）
        const weaponIntensity = this.isMoving ? 1.0 : 0.8;
        const attackWeapon = this.attackMode ? 1.5 : 1.0;
        const rageWeapon = this.rageMode ? 2.0 : 1.0;
        ctx.fillStyle = this.rageMode ? `rgba(255, 0, 0, ${weaponIntensity * attackWeapon * rageWeapon + healthEffect})` : `rgba(255, 0, 110, ${weaponIntensity * attackWeapon + healthEffect})`;
        ctx.beginPath();
        ctx.arc(centerX - 22 + armSway + attackArm + rageArm, centerY + 2, (3 + attackArm + rageArm) * armPulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 22 - armSway - attackArm - rageArm, centerY + 2, (3 + attackArm + rageArm) * armPulse, 0, Math.PI * 2);
        ctx.fill();

        // 超派手なサイバーエフェクト（パルス + 回転 + 移動エフェクト + 攻撃エフェクト + ラージエフェクト）
        const outerPulse = Math.sin(this.animationTime * 12) * 0.3 + 0.7;
        const movementPulse = this.isMoving ? Math.sin(this.animationTime * 50) * 0.2 : 0;
        const attackPulse = this.attackMode ? Math.sin(this.attackTime * 90) * 0.3 : 0;
        const ragePulse = this.rageMode ? Math.sin(this.rageTime * 60) * 0.4 : 0;
        
        ctx.strokeStyle = this.rageMode ? `rgba(255, 0, 0, ${outerPulse + movementPulse + attackPulse + ragePulse})` : `rgba(0, 255, 65, ${outerPulse + movementPulse + attackPulse + healthEffect})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY - 8, this.width / 2.2 + 3, 0, Math.PI * 2);
        ctx.stroke();
        
        // 追加の回転エフェクト（移動時に高速回転 + 攻撃時に超高速回転 + ラージ時に超超高速回転）
        ctx.save();
        ctx.translate(centerX, centerY - 8);
        const baseRotation = this.animationTime * 5;
        const movementRotation = this.isMoving ? this.animationTime * 30 : 0;
        const attackRotation2 = this.attackMode ? this.attackTime * 200 : 0;
        const rageRotation2 = this.rageMode ? this.rageTime * 150 : 0;
        ctx.rotate(baseRotation + movementRotation + attackRotation2 + rageRotation2);
        ctx.strokeStyle = this.rageMode ? `rgba(255, 0, 0, ${outerPulse + movementPulse + attackPulse + ragePulse})` : `rgba(255, 0, 110, ${outerPulse + movementPulse + attackPulse + healthEffect})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2.2 + 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // 体力バー
        const healthBarWidth = 40;
        const healthBarHeight = 4;
        const healthBarX = centerX - healthBarWidth / 2;
        const healthBarY = centerY - 45;
        
        // 体力バーの背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
        
        // 体力バー
        const healthPercentage = this.getHealthPercentage();
        const healthColor = healthPercentage > 0.6 ? '#00ff00' : healthPercentage > 0.3 ? '#ffff00' : '#ff0000';
        ctx.fillStyle = healthColor;
        ctx.fillRect(healthBarX, healthBarY, healthBarWidth * healthPercentage, healthBarHeight);
        
        // 体力バーの枠線
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

        // 移動時の追加エフェクト
        if (this.isMoving) {
            // スピードライン
            const speedLineCount = 3;
            for (let i = 0; i < speedLineCount; i++) {
                const lineAlpha = 0.3 - (i * 0.1);
                ctx.strokeStyle = `rgba(0, 255, 65, ${lineAlpha})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(centerX, centerY - 10 + i * 5);
                ctx.lineTo(centerX, centerY - 5 + i * 5);
                ctx.stroke();
            }
            
            // 移動パーティクル
            const particleCount = 5;
            for (let i = 0; i < particleCount; i++) {
                const particleAlpha = 0.4 - (i * 0.08);
                ctx.fillStyle = `rgba(255, 0, 110, ${particleAlpha})`;
                ctx.beginPath();
                ctx.arc(
                    centerX + Math.sin(this.animationTime * 20 + i) * 2,
                    centerY + 5 + Math.cos(this.animationTime * 15 + i) * 2,
                    1 + Math.sin(this.animationTime * 25 + i) * 0.5,
                    0, Math.PI * 2
                );
                ctx.fill();
            }
        }

        // 攻撃時の追加エフェクト
        if (this.attackMode) {
            // 攻撃パーティクル
            const attackParticleCount = 12;
            for (let i = 0; i < attackParticleCount; i++) {
                const particleAlpha = 0.8 - (i * 0.07);
                const particleAngle = (i / attackParticleCount) * Math.PI * 2;
                const particleRadius = 15 + Math.sin(this.attackTime * 100 + i) * 8;
                ctx.fillStyle = `rgba(255, 0, 110, ${particleAlpha})`;
                ctx.beginPath();
                ctx.arc(
                    centerX + Math.cos(particleAngle) * particleRadius,
                    centerY + Math.sin(particleAngle) * particleRadius,
                    3 + Math.sin(this.attackTime * 120 + i) * 2,
                    0, Math.PI * 2
                );
                ctx.fill();
            }
        }

        // ラージモード時の追加エフェクト
        if (this.rageMode) {
            // ラージパーティクル
            const rageParticleCount = 15;
            for (let i = 0; i < rageParticleCount; i++) {
                const particleAlpha = 0.9 - (i * 0.06);
                const particleAngle = (i / rageParticleCount) * Math.PI * 2;
                const particleRadius = 20 + Math.sin(this.rageTime * 80 + i) * 10;
                ctx.fillStyle = `rgba(255, 0, 0, ${particleAlpha})`;
                ctx.beginPath();
                ctx.arc(
                    centerX + Math.cos(particleAngle) * particleRadius,
                    centerY + Math.sin(particleAngle) * particleRadius,
                    4 + Math.sin(this.rageTime * 100 + i) * 3,
                    0, Math.PI * 2
                );
                ctx.fill();
            }
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

