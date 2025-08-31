// ゲームオブジェクトの基本クラス
export class GameObject {
    constructor(x, y, width, height, speed, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.color = color;
    }
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            color: this.color
        };
    }
    collidesWith(other) {
        const bounds1 = this.getBounds();
        const bounds2 = other.getBounds();
        return bounds1.x < bounds2.x + bounds2.width &&
            bounds1.x + bounds1.width > bounds2.x &&
            bounds1.y < bounds2.y + bounds2.height &&
            bounds1.y + bounds1.height > bounds2.y;
    }
}
// 改善版プレイヤークラス（Kenney.nl素材を参考にしたデザイン）
export class ImprovedPlayer extends GameObject {
    constructor(x, y) {
        super(x, y, 40, 40, 5, '#4A90E2');
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
    }
    update() {
        // 無敵時間の処理
        if (this.invulnerable) {
            this.invulnerableTime--;
            if (this.invulnerableTime <= 0) {
                this.invulnerable = false;
            }
        }
        // アニメーション時間の更新
        this.animationTime += 0.016;
        // 速度と移動状態の計算
        this.velocityX = this.x - this.lastX;
        this.isMoving = Math.abs(this.velocityX) > 0.1;
        if (this.velocityX > 0.1) {
            this.direction = 1;
        }
        else if (this.velocityX < -0.1) {
            this.direction = -1;
        }
        else if (Math.abs(this.velocityX) <= 0.1) {
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
        this.lastX = this.x;
    }
    jump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.jumpTime = 0;
        }
    }
    attack() {
        this.attackMode = true;
        this.attackTime = 0;
    }
    draw(ctx) {
        if (this.invulnerable && Math.floor(this.invulnerableTime / 5) % 2 === 0) {
            return; // 点滅効果
        }
        ctx.save();
        // Kenney.nl風のアニメーション
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
        // Kenney.nl風カラーパレット（明るく親しみやすい色）
        const kenneyColors = {
            primary: '#4A90E2', // メインの青
            secondary: '#7ED321', // アクセントの緑
            accent: '#F5A623', // オレンジ
            background: '#FFFFFF', // 白い背景
            outline: '#2C3E50', // ダークアウトライン
            highlight: '#50E3C2' // ハイライトの青緑
        };
        // 影（Kenney風のシンプルな影）
        ctx.fillStyle = 'rgba(44, 62, 80, 0.3)';
        ctx.beginPath();
        ctx.ellipse(centerX, this.y + this.height + 2, this.width / 2.5, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        // 移動時の追加影
        if (this.isMoving) {
            ctx.fillStyle = 'rgba(44, 62, 80, 0.2)';
            ctx.beginPath();
            ctx.ellipse(centerX - this.direction * 3, this.y + this.height + 1, this.width / 2.5, 3, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        // 体（Kenney風の丸い体）
        ctx.save();
        ctx.translate(centerX, centerY + 5);
        ctx.rotate(tiltAngle);
        ctx.scale(this.breathingEffect, this.breathingEffect);
        // 体のグラデーション
        const bodyGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.width / 2.5);
        bodyGradient.addColorStop(0, kenneyColors.primary);
        bodyGradient.addColorStop(0.7, kenneyColors.highlight);
        bodyGradient.addColorStop(1, kenneyColors.primary);
        ctx.fillStyle = bodyGradient;
        ctx.strokeStyle = kenneyColors.outline;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width / 2.5, this.height / 2.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // 体の装飾（Kenney風のシンプルな装飾）
        ctx.fillStyle = kenneyColors.secondary;
        ctx.beginPath();
        ctx.arc(0, -5, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        // 頭（Kenney風の丸い頭）
        ctx.save();
        ctx.translate(centerX, centerY - 8);
        ctx.rotate(tiltAngle * 0.5);
        ctx.scale(this.breathingEffect * 0.9, this.breathingEffect * 0.9);
        const headGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.width / 2.2);
        headGradient.addColorStop(0, kenneyColors.primary);
        headGradient.addColorStop(0.7, kenneyColors.highlight);
        headGradient.addColorStop(1, kenneyColors.primary);
        ctx.fillStyle = headGradient;
        ctx.strokeStyle = kenneyColors.outline;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        // 耳（Kenney風の小さな耳）
        const earPulse = Math.sin(this.animationTime * 15) * 0.1 + 0.9;
        const earSway = this.isMoving ? Math.sin(this.animationTime * 25) * 0.1 : 0;
        const earJump = this.isJumping ? Math.sin(this.jumpTime * 20) * 0.2 : 0;
        // 左耳
        ctx.save();
        ctx.translate(centerX - 10 + earSway, centerY - 18 + earJump);
        ctx.scale(earPulse, earPulse);
        ctx.fillStyle = kenneyColors.accent;
        ctx.strokeStyle = kenneyColors.outline;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        // 右耳
        ctx.save();
        ctx.translate(centerX + 10 - earSway, centerY - 18 + earJump);
        ctx.scale(earPulse, earPulse);
        ctx.fillStyle = kenneyColors.accent;
        ctx.strokeStyle = kenneyColors.outline;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        // 目（Kenney風の大きな目）
        const eyePulse = Math.sin(this.animationTime * 20) * 0.1 + 0.9;
        const eyeSquint = this.isMoving ? Math.sin(this.animationTime * 30) * 0.05 : 0;
        const eyeAttack = this.attackMode ? Math.sin(this.attackTime * 60) * 0.1 : 0;
        // 左目
        ctx.fillStyle = kenneyColors.background;
        ctx.strokeStyle = kenneyColors.outline;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX - 8, centerY - 12, 6 - eyeSquint + eyeAttack, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // 右目
        ctx.beginPath();
        ctx.arc(centerX + 8, centerY - 12, 6 - eyeSquint + eyeAttack, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // 瞳
        ctx.fillStyle = kenneyColors.outline;
        ctx.beginPath();
        ctx.arc(centerX - 8, centerY - 12, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 8, centerY - 12, 3, 0, Math.PI * 2);
        ctx.fill();
        // 目のハイライト
        const highlightOffset = this.isMoving ? Math.sin(this.animationTime * 40) * 0.3 : 0;
        ctx.fillStyle = kenneyColors.background;
        ctx.beginPath();
        ctx.arc(centerX - 6 + highlightOffset, centerY - 14, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 10 - highlightOffset, centerY - 14, 1.5, 0, Math.PI * 2);
        ctx.fill();
        // 鼻（Kenney風の小さな鼻）
        const nosePulse = Math.sin(this.animationTime * 25) * 0.1 + 0.9;
        ctx.fillStyle = kenneyColors.accent;
        ctx.strokeStyle = kenneyColors.outline;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY - 2, 3 * nosePulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // 口（Kenney風の笑顔）
        const mouthPulse = Math.sin(this.animationTime * 18) * 0.05 + 0.95;
        const attackMouth = this.attackMode ? Math.sin(this.attackTime * 50) * 0.1 : 0;
        ctx.fillStyle = kenneyColors.outline;
        ctx.strokeStyle = kenneyColors.outline;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY + 2, (5 + attackMouth) * mouthPulse, 0, Math.PI);
        ctx.stroke();
        // 手（Kenney風の手）
        const armSway = this.isMoving ? Math.sin(this.animationTime * 35) * 0.2 : 0;
        const armPulse = Math.sin(this.animationTime * 22) * 0.05 + 0.95;
        const attackArm = this.attackMode ? Math.sin(this.attackTime * 70) * 0.2 : 0;
        // 左手
        ctx.fillStyle = kenneyColors.primary;
        ctx.strokeStyle = kenneyColors.outline;
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
        // 足（Kenney風の足）
        const footPulse = Math.sin(this.animationTime * 16) * 0.05 + 0.95;
        // 左足
        ctx.fillStyle = kenneyColors.secondary;
        ctx.strokeStyle = kenneyColors.outline;
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
        // Kenney風エフェクト
        const outerPulse = Math.sin(this.animationTime * 12) * 0.1 + 0.9;
        ctx.strokeStyle = `rgba(74, 144, 226, ${outerPulse * 0.3})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY - 8, this.width / 2.2 + 2, 0, Math.PI * 2);
        ctx.stroke();
        // 移動時の追加エフェクト
        if (this.isMoving) {
            // Kenney風の動き線
            const lineCount = 2;
            for (let i = 0; i < lineCount; i++) {
                const lineAlpha = 0.4 - (i * 0.2);
                ctx.strokeStyle = `rgba(74, 144, 226, ${lineAlpha})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(centerX - this.direction * (15 + i * 8), centerY - 5 + i * 5);
                ctx.lineTo(centerX - this.direction * (25 + i * 8), centerY + i * 5);
                ctx.stroke();
            }
            // Kenney風の星エフェクト
            const starCount = 2;
            for (let i = 0; i < starCount; i++) {
                const starAlpha = 0.6 - (i * 0.3);
                ctx.fillStyle = `rgba(245, 166, 35, ${starAlpha})`;
                ctx.beginPath();
                ctx.arc(centerX - this.direction * (10 + i * 8) + Math.sin(this.animationTime * 15 + i) * 2, centerY + Math.cos(this.animationTime * 10 + i) * 2, 2 + Math.sin(this.animationTime * 20 + i) * 1, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        // ジャンプ時の追加エフェクト
        if (this.isJumping) {
            // Kenney風のジャンプエフェクト
            const sparkleCount = 4;
            for (let i = 0; i < sparkleCount; i++) {
                const sparkleAlpha = 0.7 - (i * 0.2);
                const sparkleAngle = (i / sparkleCount) * Math.PI * 2;
                const sparkleRadius = 8 + Math.sin(this.jumpTime * 15 + i) * 4;
                ctx.fillStyle = `rgba(126, 211, 33, ${sparkleAlpha})`;
                ctx.beginPath();
                ctx.arc(centerX + Math.cos(sparkleAngle) * sparkleRadius, centerY + Math.sin(sparkleAngle) * sparkleRadius, 2 + Math.sin(this.jumpTime * 25 + i) * 1, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        // 攻撃時の追加エフェクト
        if (this.attackMode) {
            // Kenney風の攻撃エフェクト
            const exclamationCount = 3;
            for (let i = 0; i < exclamationCount; i++) {
                const exclamationAlpha = 0.8 - (i * 0.3);
                const exclamationAngle = (i / exclamationCount) * Math.PI * 2;
                const exclamationRadius = 12 + Math.sin(this.attackTime * 80 + i) * 6;
                ctx.fillStyle = `rgba(245, 166, 35, ${exclamationAlpha})`;
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('!', centerX + Math.cos(exclamationAngle) * exclamationRadius, centerY + Math.sin(exclamationAngle) * exclamationRadius);
            }
        }
        ctx.restore();
    }
    moveLeft() {
        this.x = Math.max(0, this.x - this.speed);
    }
    moveRight() {
        this.x = Math.min(400 - this.width, this.x + this.speed);
    }
    takeDamage() {
        if (!this.invulnerable) {
            this.lives--;
            this.invulnerable = true;
            this.invulnerableTime = 120; // 2秒間無敵
        }
    }
    getLives() {
        return this.lives;
    }
    isAlive() {
        return this.lives > 0;
    }
}
// 改善版弾クラス
export class ImprovedBullet extends GameObject {
    constructor(x, y) {
        super(x, y, 6, 12, 8, '#F5A623');
    }
    update() {
        this.y -= this.speed;
    }
    draw(ctx) {
        ctx.save();
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        // Kenney風の弾デザイン
        const bulletGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, this.width / 2 + 2);
        bulletGradient.addColorStop(0, '#FFFFFF');
        bulletGradient.addColorStop(0.5, '#F5A623');
        bulletGradient.addColorStop(1, '#E67E22');
        ctx.fillStyle = bulletGradient;
        ctx.strokeStyle = '#D35400';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, this.width / 2 + 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // 弾のコア
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(centerX, centerY, this.width / 2 - 1, 0, Math.PI * 2);
        ctx.fill();
        // 弾のハイライト
        ctx.fillStyle = '#F8F9FA';
        ctx.beginPath();
        ctx.arc(centerX - 1, centerY - 1, this.width / 2 - 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    isOffScreen() {
        return this.y + this.height < 0;
    }
}
// 改善版敵クラス
export class ImprovedEnemy extends GameObject {
    constructor(x, y, type) {
        const colors = {
            'dog': '#E67E22',
            'bird': '#3498DB',
            'rabbit': '#9B59B6',
            'pig': '#E91E63'
        };
        super(x, y, 35, 35, 2, colors[type] || '#95A5A6');
        this.type = type;
        this.animationTime = 0;
        this.isMoving = false;
        this.attackMode = false;
        this.attackTime = 0;
        this.breathingEffect = 1;
    }
    update() {
        this.animationTime += 0.01;
        this.breathingEffect = 1 + Math.sin(this.animationTime * 10) * 0.1;
        // 移動モードの切り替え
        if (this.animationTime > 100 && this.animationTime < 200) {
            this.isMoving = true;
        }
        else if (this.animationTime > 300 && this.animationTime < 400) {
            this.isMoving = false;
        }
        // 攻撃モードの切り替え
        if (this.animationTime > 250 && this.animationTime < 350) {
            this.attackMode = true;
            this.attackTime = 0;
        }
        else if (this.animationTime > 450 && this.animationTime < 550) {
            this.attackMode = false;
            this.attackTime = 0;
        }
        this.y += this.speed;
    }
    draw(ctx) {
        ctx.save();
        // Kenney風のアニメーション
        const bounce = Math.sin(this.animationTime * 8) * 0.3;
        const sway = Math.sin(this.animationTime * 12) * 0.2;
        const movementBounce = this.isMoving ? Math.sin(this.animationTime * 20) * 0.4 : 0;
        const movementSway = this.isMoving ? Math.sin(this.animationTime * 15) * 0.3 : 0;
        const attackEffect = this.attackMode ? Math.sin(this.attackTime * 40) * 0.3 : 0;
        const centerX = this.x + this.width / 2 + sway + movementSway;
        const centerY = this.y + this.height / 2 + bounce + movementBounce + attackEffect;
        // Kenney風カラーパレット
        const kenneyColors = {
            primary: this.color,
            secondary: '#FFFFFF',
            accent: '#F5A623',
            outline: '#2C3E50',
            highlight: '#50E3C2'
        };
        // 影
        ctx.fillStyle = 'rgba(44, 62, 80, 0.3)';
        ctx.beginPath();
        ctx.ellipse(centerX, this.y + this.height + 2, this.width / 2.5, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        // 体（Kenney風のデザイン）
        ctx.save();
        ctx.translate(centerX, centerY + 5);
        ctx.scale(this.breathingEffect, this.breathingEffect);
        const bodyGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.width / 2.5);
        bodyGradient.addColorStop(0, kenneyColors.primary);
        bodyGradient.addColorStop(0.7, kenneyColors.highlight);
        bodyGradient.addColorStop(1, kenneyColors.primary);
        ctx.fillStyle = bodyGradient;
        ctx.strokeStyle = kenneyColors.outline;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width / 2.5, this.height / 2.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // 体の装飾
        ctx.fillStyle = kenneyColors.accent;
        ctx.beginPath();
        ctx.arc(0, -3, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        // 頭
        ctx.save();
        ctx.translate(centerX, centerY - 8);
        ctx.scale(this.breathingEffect * 0.9, this.breathingEffect * 0.9);
        const headGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.width / 2.2);
        headGradient.addColorStop(0, kenneyColors.primary);
        headGradient.addColorStop(0.7, kenneyColors.highlight);
        headGradient.addColorStop(1, kenneyColors.primary);
        ctx.fillStyle = headGradient;
        ctx.strokeStyle = kenneyColors.outline;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        // 目
        const eyePulse = Math.sin(this.animationTime * 20) * 0.1 + 0.9;
        ctx.fillStyle = kenneyColors.secondary;
        ctx.strokeStyle = kenneyColors.outline;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX - 6, centerY - 12, 4 * eyePulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(centerX + 6, centerY - 12, 4 * eyePulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // 瞳
        ctx.fillStyle = kenneyColors.outline;
        ctx.beginPath();
        ctx.arc(centerX - 6, centerY - 12, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 6, centerY - 12, 2, 0, Math.PI * 2);
        ctx.fill();
        // 鼻
        ctx.fillStyle = kenneyColors.accent;
        ctx.strokeStyle = kenneyColors.outline;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY - 2, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // 口
        ctx.fillStyle = kenneyColors.outline;
        ctx.strokeStyle = kenneyColors.outline;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY + 2, 4, 0, Math.PI);
        ctx.stroke();
        // Kenney風エフェクト
        const outerPulse = Math.sin(this.animationTime * 12) * 0.1 + 0.9;
        ctx.strokeStyle = `rgba(74, 144, 226, ${outerPulse * 0.3})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY - 8, this.width / 2.2 + 2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
    isOffScreen() {
        return this.y > 600;
    }
}
// パーティクルエフェクトクラス
export class ImprovedParticle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 10;
        this.vy = (Math.random() - 0.5) * 10;
        this.maxLife = 30;
        this.life = this.maxLife;
        this.color = color;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.3; // 重力
        this.life--;
        return this.life > 0;
    }
    draw(ctx) {
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
