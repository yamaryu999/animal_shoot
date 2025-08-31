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

// プレイヤークラス（ミッキーマウス・レトロ風）
export class Player extends GameObject {
    private lives: number;
    private invulnerable: boolean;
    private invulnerableTime: number;
    private animationTime: number;
    private lastX: number;
    private velocityX: number;
    private isMoving: boolean;
    private direction: number; // -1: 左, 0: 停止, 1: 右
    private jumpHeight: number;
    private isJumping: boolean;
    private jumpTime: number;
    private attackMode: boolean;
    private attackTime: number;
    private breathingEffect: number;
    private whistleTime: number;

    constructor(x: number, y: number) {
        super(x, y, 40, 40, 5, '#000000');
        this.lives = 3;
        this.invulnerable = false;
        this.invulnerableTime = 0;
        this.animationTime = 0;
        this.lastX = x;
        this.velocityX = 0;
        this.isMoving = false;
        this.direction = 0;
        this.jumpHeight = 0;
        this.isJumping = false;
        this.jumpTime = 0;
        this.attackMode = false;
        this.attackTime = 0;
        this.breathingEffect = 0;
        this.whistleTime = 0;
    }

    update(): void {
        // 無敵時間の処理
        if (this.invulnerable) {
            this.invulnerableTime--;
            if (this.invulnerableTime <= 0) {
                this.invulnerable = false;
            }
        }

        // アニメーション時間の更新
        this.animationTime += 0.016; // 約60FPS

        // 速度と移動状態の計算
        this.velocityX = this.x - this.lastX;
        this.isMoving = Math.abs(this.velocityX) > 0.1;

        if (this.velocityX > 0.1) {
            this.direction = 1;
        } else if (this.velocityX < -0.1) {
            this.direction = -1;
        } else if (Math.abs(this.velocityX) <= 0.1) {
            this.direction = 0;
        }

        // ジャンプ処理
        if (this.isJumping) {
            this.jumpTime += 0.016;
            this.jumpHeight = Math.sin(this.jumpTime * 8) * 15;
            if (this.jumpTime > 0.5) {
                this.isJumping = false;
                this.jumpHeight = 0;
                this.jumpTime = 0;
            }
        }

        // 攻撃モード処理
        if (this.attackMode) {
            this.attackTime += 0.016;
            if (this.attackTime > 0.3) {
                this.attackMode = false;
                this.attackTime = 0;
            }
        }

        // 呼吸エフェクト
        this.breathingEffect = Math.sin(this.animationTime * 3) * 0.05 + 1.0;

        // ホイッスル効果（ランダムに発生）
        if (Math.random() < 0.001) { // 0.1%の確率
            this.whistleTime = 1.0;
        }
        if (this.whistleTime > 0) {
            this.whistleTime -= 0.016;
        }

        this.lastX = this.x;
    }

    jump(): void {
        if (!this.isJumping) {
            this.isJumping = true;
            this.jumpTime = 0;
        }
    }

    attack(): void {
        this.attackMode = true;
        this.attackTime = 0;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (this.invulnerable && Math.floor(this.invulnerableTime / 5) % 2 === 0) {
            return; // 点滅効果
        }

        ctx.save();
        
        // レトロミッキーマウス風アニメーション
        const bounce = Math.sin(this.animationTime * 8) * 0.3;
        const sway = Math.sin(this.animationTime * 12) * 0.2;
        const movementBounce = this.isMoving ? Math.sin(this.animationTime * 20) * 0.4 : 0;
        const movementSway = this.isMoving ? Math.sin(this.animationTime * 15) * 0.3 : 0;
        const jumpEffect = this.isJumping ? Math.sin(this.jumpTime * 16) * 0.2 : 0;
        const attackEffect = this.attackMode ? Math.sin(this.attackTime * 40) * 0.3 : 0;
        
        const centerX = this.x + this.width / 2 + sway + movementSway;
        const centerY = this.y + this.height / 2 + bounce + movementBounce - this.jumpHeight + jumpEffect;
        
        // 移動方向に応じた傾き効果
        const tiltAngle = this.direction * 0.1;
        
        // レトロミッキーマウスカラーパレット
        const mickeyColors = {
            black: '#000000',      // メインの黒
            skin: '#FFB6C1',       // 肌色（手と顔）
            red: '#FF0000',        // 赤いズボン
            yellow: '#FFD700',     // 黄色い靴
            white: '#FFFFFF',      // 白い手袋
            outline: '#000000'     // アウトライン
        };
        
        // 影（レトロ風のシンプルな影）
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(centerX, this.y + this.height + 2, this.width / 2.5, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 移動時の追加影
        if (this.isMoving) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.beginPath();
            ctx.ellipse(centerX - this.direction * 3, this.y + this.height + 1, this.width / 2.5, 3, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // 体（赤いズボン）
        ctx.save();
        ctx.translate(centerX, centerY + 5);
        ctx.rotate(tiltAngle);
        ctx.scale(this.breathingEffect, this.breathingEffect);
        
        // ズボン
        ctx.fillStyle = mickeyColors.red;
        ctx.strokeStyle = mickeyColors.outline;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width / 2.5, this.height / 2.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // ズボンのボタン
        ctx.fillStyle = mickeyColors.yellow;
        ctx.beginPath();
        ctx.arc(0, -5, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 5, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.restore();
        
        // 頭（黒い丸）
        ctx.save();
        ctx.translate(centerX, centerY - 8);
        ctx.rotate(tiltAngle * 0.5);
        ctx.scale(this.breathingEffect * 0.9, this.breathingEffect * 0.9);
        
        ctx.fillStyle = mickeyColors.black;
        ctx.strokeStyle = mickeyColors.outline;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        
        // 耳（黒い丸）
        const earPulse = Math.sin(this.animationTime * 15) * 0.1 + 0.9;
        const earSway = this.isMoving ? Math.sin(this.animationTime * 25) * 0.1 : 0;
        const earJump = this.isJumping ? Math.sin(this.jumpTime * 20) * 0.2 : 0;
        
        // 左耳
        ctx.save();
        ctx.translate(centerX - 12 + earSway, centerY - 18 + earJump);
        ctx.scale(earPulse, earPulse);
        ctx.fillStyle = mickeyColors.black;
        ctx.strokeStyle = mickeyColors.outline;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        
        // 右耳
        ctx.save();
        ctx.translate(centerX + 12 - earSway, centerY - 18 + earJump);
        ctx.scale(earPulse, earPulse);
        ctx.fillStyle = mickeyColors.black;
        ctx.strokeStyle = mickeyColors.outline;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        
        // 目（白い部分）
        const eyePulse = Math.sin(this.animationTime * 20) * 0.1 + 0.9;
        const eyeSquint = this.isMoving ? Math.sin(this.animationTime * 30) * 0.05 : 0;
        const eyeAttack = this.attackMode ? Math.sin(this.attackTime * 60) * 0.1 : 0;
        
        // 左目の白い部分
        ctx.fillStyle = mickeyColors.white;
        ctx.strokeStyle = mickeyColors.outline;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX - 8, centerY - 12, 6 - eyeSquint + eyeAttack, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 右目の白い部分
        ctx.beginPath();
        ctx.arc(centerX + 8, centerY - 12, 6 - eyeSquint + eyeAttack, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 瞳（黒い部分）
        ctx.fillStyle = mickeyColors.black;
        ctx.beginPath();
        ctx.arc(centerX - 8, centerY - 12, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 8, centerY - 12, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // 目のハイライト
        const highlightOffset = this.isMoving ? Math.sin(this.animationTime * 40) * 0.3 : 0;
        ctx.fillStyle = mickeyColors.white;
        ctx.beginPath();
        ctx.arc(centerX - 6 + highlightOffset, centerY - 14, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 10 - highlightOffset, centerY - 14, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // 鼻（黒い丸）
        const nosePulse = Math.sin(this.animationTime * 25) * 0.1 + 0.9;
        ctx.fillStyle = mickeyColors.black;
        ctx.strokeStyle = mickeyColors.outline;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY - 2, 4 * nosePulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 口（笑顔）
        const mouthPulse = Math.sin(this.animationTime * 18) * 0.05 + 0.95;
        const attackMouth = this.attackMode ? Math.sin(this.attackTime * 50) * 0.1 : 0;
        
        ctx.fillStyle = mickeyColors.black;
        ctx.strokeStyle = mickeyColors.outline;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY + 2, (6 + attackMouth) * mouthPulse, 0, Math.PI);
        ctx.stroke();
        
        // ホイッスル効果
        if (this.whistleTime > 0) {
            const whistleAlpha = this.whistleTime;
            ctx.strokeStyle = `rgba(255, 255, 255, ${whistleAlpha})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(centerX, centerY + 2, (8 + attackMouth) * mouthPulse, 0, Math.PI);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(centerX, centerY + 2, (10 + attackMouth) * mouthPulse, 0, Math.PI);
            ctx.stroke();
        }
        
        // 手（白い手袋）
        const armSway = this.isMoving ? Math.sin(this.animationTime * 35) * 0.2 : 0;
        const armPulse = Math.sin(this.animationTime * 22) * 0.05 + 0.95;
        const attackArm = this.attackMode ? Math.sin(this.attackTime * 70) * 0.2 : 0;
        
        // 左手
        ctx.fillStyle = mickeyColors.white;
        ctx.strokeStyle = mickeyColors.outline;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX - 18 + armSway, centerY + 2, 5 * armPulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 右手
        ctx.beginPath();
        ctx.arc(centerX + 18 - armSway, centerY + 2, 5 * armPulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 手の指（黒い線）
        ctx.strokeStyle = mickeyColors.outline;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX - 18 + armSway - 3, centerY + 2);
        ctx.lineTo(centerX - 18 + armSway - 3, centerY - 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(centerX - 18 + armSway + 3, centerY + 2);
        ctx.lineTo(centerX - 18 + armSway + 3, centerY - 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(centerX + 18 - armSway - 3, centerY + 2);
        ctx.lineTo(centerX + 18 - armSway - 3, centerY - 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(centerX + 18 - armSway + 3, centerY + 2);
        ctx.lineTo(centerX + 18 - armSway + 3, centerY - 2);
        ctx.stroke();
        
        // 足（黄色い靴）
        const footPulse = Math.sin(this.animationTime * 16) * 0.05 + 0.95;
        
        // 左足
        ctx.fillStyle = mickeyColors.yellow;
        ctx.strokeStyle = mickeyColors.outline;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX - 8, centerY + 15, 6 * footPulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 右足
        ctx.beginPath();
        ctx.arc(centerX + 8, centerY + 15, 6 * footPulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 靴の装飾
        ctx.strokeStyle = mickeyColors.outline;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX - 8, centerY + 15, 4, 0, Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(centerX + 8, centerY + 15, 4, 0, Math.PI);
        ctx.stroke();
        
        // レトロ風エフェクト
        const outerPulse = Math.sin(this.animationTime * 12) * 0.1 + 0.9;
        ctx.strokeStyle = `rgba(0, 0, 0, ${outerPulse * 0.3})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY - 8, this.width / 2.2 + 2, 0, Math.PI * 2);
        ctx.stroke();
        
        // 移動時の追加エフェクト
        if (this.isMoving) {
            // レトロ風の動き線
            const lineCount = 2;
            for (let i = 0; i < lineCount; i++) {
                const lineAlpha = 0.4 - (i * 0.2);
                ctx.strokeStyle = `rgba(0, 0, 0, ${lineAlpha})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(centerX - this.direction * (15 + i * 8), centerY - 5 + i * 5);
                ctx.lineTo(centerX - this.direction * (25 + i * 8), centerY + i * 5);
                ctx.stroke();
            }
            
            // レトロ風の星エフェクト
            const starCount = 2;
            for (let i = 0; i < starCount; i++) {
                const starAlpha = 0.6 - (i * 0.3);
                ctx.fillStyle = `rgba(255, 255, 0, ${starAlpha})`;
                ctx.beginPath();
                ctx.arc(
                    centerX - this.direction * (10 + i * 8) + Math.sin(this.animationTime * 15 + i) * 2,
                    centerY + Math.cos(this.animationTime * 10 + i) * 2,
                    2 + Math.sin(this.animationTime * 20 + i) * 1,
                    0, Math.PI * 2
                );
                ctx.fill();
            }
        }
        
        // ジャンプ時の追加エフェクト
        if (this.isJumping) {
            // レトロ風のジャンプエフェクト
            const sparkleCount = 4;
            for (let i = 0; i < sparkleCount; i++) {
                const sparkleAlpha = 0.7 - (i * 0.2);
                const sparkleAngle = (i / sparkleCount) * Math.PI * 2;
                const sparkleRadius = 8 + Math.sin(this.jumpTime * 15 + i) * 4;
                ctx.fillStyle = `rgba(255, 255, 0, ${sparkleAlpha})`;
                ctx.beginPath();
                ctx.arc(
                    centerX + Math.cos(sparkleAngle) * sparkleRadius,
                    centerY + Math.sin(sparkleAngle) * sparkleRadius,
                    2 + Math.sin(this.jumpTime * 25 + i) * 1,
                    0, Math.PI * 2
                );
                ctx.fill();
            }
        }
        
        // 攻撃時の追加エフェクト
        if (this.attackMode) {
            // レトロ風の攻撃エフェクト
            const exclamationCount = 3;
            for (let i = 0; i < exclamationCount; i++) {
                const exclamationAlpha = 0.8 - (i * 0.3);
                const exclamationAngle = (i / exclamationCount) * Math.PI * 2;
                const exclamationRadius = 12 + Math.sin(this.attackTime * 80 + i) * 6;
                ctx.fillStyle = `rgba(255, 0, 0, ${exclamationAlpha})`;
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('!', 
                    centerX + Math.cos(exclamationAngle) * exclamationRadius,
                    centerY + Math.sin(exclamationAngle) * exclamationRadius
                );
            }
        }

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

// 敵クラス（1930年代風動物キャラクター）
export class Enemy extends GameObject {
    private type: EnemyType;
    private animationFrame: number;
    private animationTime: number;
    private isMoving: boolean;
    private attackMode: boolean;
    private attackTime: number;
    private breathingEffect: number;
    private blinkTime: number;
    private isBlinking: boolean;

    constructor(x: number, y: number, type: EnemyType) {
        // 1930年代風のセピア調カラーパレット
        const colors = {
            'dog': '#CD853F',      // セピア調オレンジ
            'bird': '#4682B4',     // セピア調ブルー
            'rabbit': '#9370DB',   // セピア調パープル
            'pig': '#DDA0DD'       // セピア調ピンク
        };
        super(x, y, 35, 35, 2, colors[type] || '#8B7355');
        this.type = type;
        this.animationFrame = 0;
        this.animationTime = 0;
        this.isMoving = false;
        this.attackMode = false;
        this.attackTime = 0;
        this.breathingEffect = 1;
        this.blinkTime = 0;
        this.isBlinking = false;
    }

    update(): void {
        this.animationTime += 0.01;
        this.breathingEffect = 1 + Math.sin(this.animationTime * 8) * 0.05; // 控えめな呼吸エフェクト

        // まばたき処理
        if (Math.random() < 0.003) { // 0.3%の確率でまばたき
            this.isBlinking = true;
            this.blinkTime = 0.15;
        }
        if (this.isBlinking) {
            this.blinkTime -= 0.016;
            if (this.blinkTime <= 0) {
                this.isBlinking = false;
            }
        }

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

        this.y += this.speed;
        this.animationFrame++;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        
        // 1930年代風の控えめなアニメーション
        const bounce = Math.sin(this.animationTime * 6) * 0.2;
        const sway = Math.sin(this.animationTime * 8) * 0.1;
        const movementBounce = this.isMoving ? Math.sin(this.animationTime * 15) * 0.2 : 0;
        const attackEffect = this.attackMode ? Math.sin(this.attackTime * 40) * 0.15 : 0;
        
        const centerX = this.x + this.width / 2 + sway;
        const centerY = this.y + this.height / 2 + bounce + movementBounce + attackEffect;
        
        // 1930年代風のシンプルな影
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(centerX, this.y + this.height + 2, this.width / 2.5, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 1930年代風カラーパレット
        const retroColors = {
            outline: '#2F2F2F',    // 濃いグレーのアウトライン
            highlight: '#FFFFFF',  // 白いハイライト
            shadow: '#1A1A1A'      // 影色
        };
        
        // 体（基本形状）
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.scale(this.breathingEffect, this.breathingEffect);
        
        // 体の基本色
        ctx.fillStyle = this.color;
        ctx.strokeStyle = retroColors.outline;
        ctx.lineWidth = 2;
        
        // 敵の種類に応じた描画
        switch (this.type) {
            case 'dog':
                this.drawDog(ctx, retroColors);
                break;
            case 'bird':
                this.drawBird(ctx, retroColors);
                break;
            case 'rabbit':
                this.drawRabbit(ctx, retroColors);
                break;
            case 'pig':
                this.drawPig(ctx, retroColors);
                break;
        }
        
        ctx.restore();
        
        // 1930年代風の控えめなエフェクト
        if (this.isMoving) {
            // 手描き風の動き線
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(centerX - 15, centerY);
            ctx.lineTo(centerX - 25, centerY + 5);
            ctx.stroke();
        }
        
        ctx.restore();
    }

    private drawDog(ctx: CanvasRenderingContext2D, colors: any): void {
        // 犬の体
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width / 2.5, this.height / 2.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 犬の頭
        ctx.beginPath();
        ctx.arc(0, -8, this.width / 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 犬の耳（垂れ耳）
        ctx.beginPath();
        ctx.ellipse(-8, -12, 4, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(8, -12, 4, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 犬の目
        if (!this.isBlinking) {
            ctx.fillStyle = colors.highlight;
            ctx.beginPath();
            ctx.arc(-4, -10, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(4, -10, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            ctx.fillStyle = colors.outline;
            ctx.beginPath();
            ctx.arc(-4, -10, 1.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(4, -10, 1.5, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.strokeStyle = colors.outline;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-7, -10);
            ctx.lineTo(-1, -10);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(1, -10);
            ctx.lineTo(7, -10);
            ctx.stroke();
        }
        
        // 犬の鼻
        ctx.fillStyle = colors.shadow;
        ctx.beginPath();
        ctx.arc(0, -6, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 犬の口
        ctx.strokeStyle = colors.outline;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, -2, 3, 0, Math.PI);
        ctx.stroke();
    }

    private drawBird(ctx: CanvasRenderingContext2D, colors: any): void {
        // 鳥の体
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width / 2.5, this.height / 2.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 鳥の頭
        ctx.beginPath();
        ctx.arc(0, -8, this.width / 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 鳥のくちばし
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.moveTo(0, -6);
        ctx.lineTo(0, -2);
        ctx.lineTo(4, -4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // 鳥の目
        if (!this.isBlinking) {
            ctx.fillStyle = colors.highlight;
            ctx.beginPath();
            ctx.arc(-2, -10, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            ctx.fillStyle = colors.outline;
            ctx.beginPath();
            ctx.arc(-2, -10, 1, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.strokeStyle = colors.outline;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-4, -10);
            ctx.lineTo(0, -10);
            ctx.stroke();
        }
        
        // 鳥の翼
        const wingSway = Math.sin(this.animationTime * 20) * 0.1;
        ctx.beginPath();
        ctx.ellipse(-12 + wingSway, -2, 6, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(12 - wingSway, -2, 6, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    private drawRabbit(ctx: CanvasRenderingContext2D, colors: any): void {
        // ウサギの体
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width / 2.5, this.height / 2.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // ウサギの頭
        ctx.beginPath();
        ctx.arc(0, -8, this.width / 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // ウサギの耳（長い耳）
        ctx.beginPath();
        ctx.ellipse(-6, -18, 3, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(6, -18, 3, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // ウサギの目
        if (!this.isBlinking) {
            ctx.fillStyle = colors.highlight;
            ctx.beginPath();
            ctx.arc(-4, -10, 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(4, -10, 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            ctx.fillStyle = colors.outline;
            ctx.beginPath();
            ctx.arc(-4, -10, 1.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(4, -10, 1.2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.strokeStyle = colors.outline;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-6, -10);
            ctx.lineTo(-2, -10);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(2, -10);
            ctx.lineTo(6, -10);
            ctx.stroke();
        }
        
        // ウサギの鼻
        ctx.fillStyle = colors.shadow;
        ctx.beginPath();
        ctx.arc(0, -6, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // ウサギの口
        ctx.strokeStyle = colors.outline;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, -2, 2, 0, Math.PI);
        ctx.stroke();
    }

    private drawPig(ctx: CanvasRenderingContext2D, colors: any): void {
        // ブタの体
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width / 2.5, this.height / 2.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // ブタの頭
        ctx.beginPath();
        ctx.arc(0, -8, this.width / 2.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // ブタの耳（小さな耳）
        ctx.beginPath();
        ctx.ellipse(-8, -12, 3, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(8, -12, 3, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // ブタの目
        if (!this.isBlinking) {
            ctx.fillStyle = colors.highlight;
            ctx.beginPath();
            ctx.arc(-4, -10, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(4, -10, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            ctx.fillStyle = colors.outline;
            ctx.beginPath();
            ctx.arc(-4, -10, 1, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(4, -10, 1, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.strokeStyle = colors.outline;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-6, -10);
            ctx.lineTo(-2, -10);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(2, -10);
            ctx.lineTo(6, -10);
            ctx.stroke();
        }
        
        // ブタの鼻（丸い鼻）
        ctx.fillStyle = '#FFB6C1';
        ctx.beginPath();
        ctx.arc(0, -6, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // ブタの鼻の穴
        ctx.fillStyle = colors.shadow;
        ctx.beginPath();
        ctx.arc(-1, -6, 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(1, -6, 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        // ブタの口
        ctx.strokeStyle = colors.outline;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, -2, 2.5, 0, Math.PI);
        ctx.stroke();
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

