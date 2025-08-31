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

        // レトロアニメ風のサイバーネコキャラクター
        ctx.save();
        
        // アニメーション用の軽い揺れ
        const bounce = Math.sin(performance.now() * 0.01) * 0.5;
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2 + bounce;
        
        // サイバー影（ネオン効果）
        ctx.fillStyle = 'rgba(0, 255, 65, 0.3)';
        ctx.beginPath();
        ctx.ellipse(centerX, this.y + this.height + 2, this.width / 2.5, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 体（サイバーパンク風の装甲）
        ctx.fillStyle = '#1a1a2e';
        ctx.strokeStyle = '#00ff41';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + 5, this.width / 2.5, this.height / 2.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // サイバー装甲の装飾
        ctx.strokeStyle = '#06ffa5';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY + 5, this.width / 2.5 - 2, 0, Math.PI * 2);
        ctx.stroke();
        
        // 頭（サイバーヘルメット風）
        ctx.fillStyle = '#000428';
        ctx.strokeStyle = '#00ff41';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, centerY - 8, this.width / 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // サイバー耳（アンテナ風）
        ctx.fillStyle = '#00ff41';
        ctx.strokeStyle = '#06ffa5';
        ctx.lineWidth = 2;
        
        // 左アンテナ
        ctx.beginPath();
        ctx.moveTo(centerX - 12, centerY - 18);
        ctx.lineTo(centerX - 8, centerY - 28);
        ctx.lineTo(centerX - 4, centerY - 18);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // 右アンテナ
        ctx.beginPath();
        ctx.moveTo(centerX + 4, centerY - 18);
        ctx.lineTo(centerX + 8, centerY - 28);
        ctx.lineTo(centerX + 12, centerY - 18);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // サイバー目（HUD風）
        ctx.fillStyle = '#00ff41';
        ctx.strokeStyle = '#06ffa5';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX - 8, centerY - 12, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(centerX + 8, centerY - 12, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 目のハイライト（ピクセル風）
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(centerX - 6, centerY - 14, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 10, centerY - 14, 2, 0, Math.PI * 2);
        ctx.fill();

        // サイバー鼻（センサー風）
        ctx.fillStyle = '#ff006e';
        ctx.strokeStyle = '#00ff41';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY - 2, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // サイバー口（スピーカー風）
        ctx.fillStyle = '#8338ec';
        ctx.strokeStyle = '#00ff41';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8, 0.2, Math.PI - 0.2);
        ctx.fill();
        ctx.stroke();
        
        // サイバーアーム（武器システム）
        ctx.fillStyle = '#1a1a2e';
        ctx.strokeStyle = '#00ff41';
        ctx.lineWidth = 2;
        
        // 左手
        ctx.beginPath();
        ctx.arc(centerX - 18, centerY + 2, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 右手
        ctx.beginPath();
        ctx.arc(centerX + 18, centerY + 2, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // サイバーエフェクト（パルス）
        const pulse = Math.sin(performance.now() * 0.01) * 0.3 + 0.7;
        ctx.strokeStyle = `rgba(0, 255, 65, ${pulse})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY - 8, this.width / 2.2 + 2, 0, Math.PI * 2);
        ctx.stroke();

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
        
        // レトロアニメ風のサイバー弾
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        
        // 外側のネオン効果
        ctx.fillStyle = 'rgba(0, 255, 65, 0.3)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, this.width / 2 + 3, 0, Math.PI * 2);
        ctx.fill();
        
        // サイバー弾の本体
        ctx.fillStyle = '#00ff41';
        ctx.strokeStyle = '#06ffa5';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, this.width / 2 + 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 内側のコア
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(centerX, centerY, this.width / 2 - 1, 0, Math.PI * 2);
        ctx.fill();
        
        // サイバーエフェクト（回転）
        const rotation = performance.now() * 0.01;
        ctx.strokeStyle = '#ff006e';
        ctx.lineWidth = 1;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);
        ctx.beginPath();
        ctx.moveTo(-this.width / 2, 0);
        ctx.lineTo(this.width / 2, 0);
        ctx.moveTo(0, -this.width / 2);
        ctx.lineTo(0, this.width / 2);
        ctx.stroke();
        ctx.restore();
        
        // パルス効果
        const pulse = Math.sin(performance.now() * 0.02) * 0.5 + 0.5;
        ctx.strokeStyle = `rgba(0, 255, 65, ${pulse})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, this.width / 2 + 2, 0, Math.PI * 2);
        ctx.stroke();
        
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
        
        // サイバー影
        ctx.fillStyle = 'rgba(255, 0, 110, 0.3)';
        ctx.beginPath();
        ctx.ellipse(centerX, this.y + this.height + 2, this.width / 2.5, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 体（サイバーロボット風）
        ctx.fillStyle = '#1a1a2e';
        ctx.strokeStyle = '#ff006e';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + bounce, this.width / 2.5, this.height / 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // サイバー装甲の装飾
        ctx.fillStyle = '#8338ec';
        ctx.beginPath();
        ctx.arc(centerX - 8, centerY - 5 + bounce, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 6, centerY + 3 + bounce, 3, 0, Math.PI * 2);
        ctx.fill();

        // サイバーアンテナ（耳）
        ctx.fillStyle = '#ff006e';
        ctx.strokeStyle = '#8338ec';
        ctx.lineWidth = 2;
        
        // 左アンテナ
        ctx.beginPath();
        ctx.ellipse(centerX - 12, centerY - 8 + bounce, 6, 10, Math.PI / 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 右アンテナ
        ctx.beginPath();
        ctx.ellipse(centerX + 12, centerY - 8 + bounce, 6, 10, -Math.PI / 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // サイバーセンサー（目）
        ctx.fillStyle = '#ff006e';
        ctx.strokeStyle = '#8338ec';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX - 6, centerY - 8 + bounce, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(centerX + 6, centerY - 8 + bounce, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // センサーのハイライト
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(centerX - 4, centerY - 10 + bounce, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 8, centerY - 10 + bounce, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // サイバーセンサー（鼻）
        ctx.fillStyle = '#00ff41';
        ctx.strokeStyle = '#ff006e';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY - 2 + bounce, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // サイバースピーカー（口）
        ctx.fillStyle = '#8338ec';
        ctx.strokeStyle = '#ff006e';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY + 2 + bounce, 6, 0.3, Math.PI - 0.3);
        ctx.fill();
        ctx.stroke();
        
        // サイバーエフェクト（パルス）
        const pulse = Math.sin(this.animationFrame * 0.1) * 0.5 + 0.5;
        ctx.strokeStyle = `rgba(255, 0, 110, ${pulse})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY + bounce, this.width / 2.5 + 2, 0, Math.PI * 2);
        ctx.stroke();
    }

    private drawBird(ctx: CanvasRenderingContext2D): void {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const bounce = Math.sin(this.animationFrame * 0.15) * 1.5;
        
        // サイバー影
        ctx.fillStyle = 'rgba(0, 102, 255, 0.3)';
        ctx.beginPath();
        ctx.ellipse(centerX, this.y + this.height + 2, this.width / 2.5, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 体（サイバードローン風）
        ctx.fillStyle = '#000428';
        ctx.strokeStyle = '#0066ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + bounce, this.width / 2.2, this.height / 2.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // サイバー装甲の装飾
        ctx.fillStyle = '#00ccff';
        ctx.beginPath();
        ctx.ellipse(centerX - 6, centerY - 3 + bounce, 4, 6, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(centerX + 6, centerY - 3 + bounce, 4, 6, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        // サイバー翼（プロペラ風）
        ctx.fillStyle = '#0066ff';
        ctx.strokeStyle = '#00ccff';
        ctx.lineWidth = 2;
        const wingFlap = Math.sin(this.animationFrame * 0.4) * 15;
        
        // 左プロペラ
        ctx.save();
        ctx.translate(centerX - 15, centerY + bounce);
        ctx.rotate((wingFlap * Math.PI) / 180);
        ctx.beginPath();
        ctx.ellipse(0, 0, 8, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        
        // 右プロペラ
        ctx.save();
        ctx.translate(centerX + 15, centerY + bounce);
        ctx.rotate((-wingFlap * Math.PI) / 180);
        ctx.beginPath();
        ctx.ellipse(0, 0, 8, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // サイバーセンサー（目）
        ctx.fillStyle = '#0066ff';
        ctx.strokeStyle = '#00ccff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX - 6, centerY - 6 + bounce, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(centerX + 6, centerY - 6 + bounce, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // センサーのハイライト
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(centerX - 4, centerY - 8 + bounce, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 8, centerY - 8 + bounce, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // サイバーレーザー（くちばし）
        ctx.fillStyle = '#ff006e';
        ctx.strokeStyle = '#0066ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 2 + bounce);
        ctx.lineTo(centerX + 8, centerY - 8 + bounce);
        ctx.lineTo(centerX + 6, centerY + 2 + bounce);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // サイバーエフェクト（パルス）
        const pulse = Math.sin(this.animationFrame * 0.15) * 0.5 + 0.5;
        ctx.strokeStyle = `rgba(0, 102, 255, ${pulse})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY + bounce, this.width / 2.2 + 2, 0, Math.PI * 2);
        ctx.stroke();
    }

    private drawRabbit(ctx: CanvasRenderingContext2D): void {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const bounce = Math.sin(this.animationFrame * 0.12) * 1;
        
        // 影
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(centerX, this.y + this.height + 2, this.width / 2.5, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 体（カップヘッド風の白いベース）
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + bounce, this.width / 2.3, this.height / 2.3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 紫の斑点模様
        ctx.fillStyle = '#9370DB';
        ctx.beginPath();
        ctx.arc(centerX - 5, centerY - 4 + bounce, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 7, centerY + 2 + bounce, 2, 0, Math.PI * 2);
        ctx.fill();

        // カップヘッド風の長い耳（アニメーション付き）
        ctx.fillStyle = '#FFB6C1';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        const earSway = Math.sin(this.animationFrame * 0.08) * 5;
        
        // 左耳
        ctx.save();
        ctx.translate(centerX - 8, centerY - 15 + bounce);
        ctx.rotate((earSway * Math.PI) / 180);
        ctx.beginPath();
        ctx.ellipse(0, 0, 4, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        
        // 右耳
        ctx.save();
        ctx.translate(centerX + 8, centerY - 15 + bounce);
        ctx.rotate((-earSway * Math.PI) / 180);
        ctx.beginPath();
        ctx.ellipse(0, 0, 4, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        
        // 耳の内側
        ctx.fillStyle = '#FF69B4';
        ctx.save();
        ctx.translate(centerX - 8, centerY - 15 + bounce);
        ctx.rotate((earSway * Math.PI) / 180);
        ctx.beginPath();
        ctx.ellipse(0, 0, 2, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        ctx.save();
        ctx.translate(centerX + 8, centerY - 15 + bounce);
        ctx.rotate((-earSway * Math.PI) / 180);
        ctx.beginPath();
        ctx.ellipse(0, 0, 2, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // カップヘッド風の大きな目
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(centerX - 6, centerY - 6 + bounce, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 6, centerY - 6 + bounce, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // 目のハイライト
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(centerX - 4, centerY - 8 + bounce, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 8, centerY - 8 + bounce, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // ピンクの鼻（ハート型風）
        ctx.fillStyle = '#FF1493';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX - 1, centerY - 1 + bounce, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 1, centerY - 1 + bounce, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(centerX - 2, centerY + bounce);
        ctx.lineTo(centerX, centerY + 3 + bounce);
        ctx.lineTo(centerX + 2, centerY + bounce);
        ctx.fill();
        
        // 前歯
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(centerX - 2, centerY + 4 + bounce, 2, 4);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.rect(centerX + 1, centerY + 4 + bounce, 2, 4);
        ctx.fill();
        ctx.stroke();
    }

    private drawPig(ctx: CanvasRenderingContext2D): void {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const bounce = Math.sin(this.animationFrame * 0.08) * 2;
        
        // 影（より大きく）
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(centerX, this.y + this.height + 3, this.width / 2, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 体（カップヘッド風の白いベース、より大きく）
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + bounce, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // ピンクの斑点模様
        ctx.fillStyle = '#FF69B4';
        ctx.beginPath();
        ctx.arc(centerX - 8, centerY - 6 + bounce, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 6, centerY + 4 + bounce, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX - 2, centerY + 8 + bounce, 2, 0, Math.PI * 2);
        ctx.fill();

        // カップヘッド風の小さな三角耳
        ctx.fillStyle = '#FFB6C1';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        
        // 左耳
        ctx.beginPath();
        ctx.moveTo(centerX - 12, centerY - 12 + bounce);
        ctx.lineTo(centerX - 8, centerY - 20 + bounce);
        ctx.lineTo(centerX - 4, centerY - 12 + bounce);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // 右耳
        ctx.beginPath();
        ctx.moveTo(centerX + 4, centerY - 12 + bounce);
        ctx.lineTo(centerX + 8, centerY - 20 + bounce);
        ctx.lineTo(centerX + 12, centerY - 12 + bounce);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // カップヘッド風の大きな目（少し怒った表情）
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(centerX - 8, centerY - 8 + bounce, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 8, centerY - 8 + bounce, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // 目のハイライト
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(centerX - 6, centerY - 10 + bounce, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 10, centerY - 10 + bounce, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 怒った眉毛
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX - 12, centerY - 12 + bounce);
        ctx.lineTo(centerX - 4, centerY - 8 + bounce);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(centerX + 4, centerY - 8 + bounce);
        ctx.lineTo(centerX + 12, centerY - 12 + bounce);
        ctx.stroke();

        // カップヘッド風の大きな豚の鼻
        ctx.fillStyle = '#FF1493';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + 2 + bounce, 6, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 鼻の穴
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(centerX - 2, centerY + 2 + bounce, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 2, centerY + 2 + bounce, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // 怒った口
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY + 8 + bounce, 6, 0.8, Math.PI - 0.8);
        ctx.stroke();
        
        // 牙
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX - 4, centerY + 6 + bounce);
        ctx.lineTo(centerX - 2, centerY + 12 + bounce);
        ctx.lineTo(centerX - 6, centerY + 10 + bounce);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(centerX + 4, centerY + 6 + bounce);
        ctx.lineTo(centerX + 2, centerY + 12 + bounce);
        ctx.lineTo(centerX + 6, centerY + 10 + bounce);
        ctx.closePath();
        ctx.fill();
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
