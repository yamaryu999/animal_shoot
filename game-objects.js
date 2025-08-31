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
// プレイヤークラス（1930年代風メカニックキャラクター）
export class Player extends GameObject {
    constructor(x, y) {
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
        this.headBob = 0;
        this.idleSway = 0;
        this.hairSway = 0;
        this.hatTilt = 0;
        this.currentExpression = 'happy';
        this.armSwing = 0;
        this.gloveStretch = 0;
        this.legSwing = 0;
        this.toolBeltSwing = 0;
        this.footStep = 0;
        this.overallFlap = 0;
        this.isBlinking = false;
        this.blinkTime = 0;
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
        this.animationTime += 0.016; // 約60FPS
        // まばたき処理
        if (Math.random() < 0.005) { // 0.5%の確率でまばたき
            this.isBlinking = true;
            this.blinkTime = 0.2;
        }
        if (this.isBlinking) {
            this.blinkTime -= 0.016;
            if (this.blinkTime <= 0) {
                this.isBlinking = false;
            }
        }
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
        // ホイッスル効果（ランダムに発生）
        if (Math.random() < 0.001) { // 0.1%の確率
            this.whistleTime = 1.0;
        }
        if (this.whistleTime > 0) {
            this.whistleTime -= 0.016;
        }
        // 表情の動的変更
        this.updateExpression();
        // アニメーション効果の更新
        this.headBob = Math.sin(this.animationTime * 10) * 0.5; // 頭の上下動
        this.idleSway = Math.sin(this.animationTime * 5) * 0.1; // アイドル時の左右ゆれ
        this.hairSway = Math.sin(this.animationTime * 10) * 0.05; // 髪の左右ゆれ
        this.hatTilt = Math.sin(this.animationTime * 15) * 0.1; // 帽子の傾き
        this.armSwing = this.isMoving ? Math.sin(this.animationTime * 20) * 0.2 : 0; // 腕の振り
        this.gloveStretch = Math.sin(this.animationTime * 15) * 0.1; // 手袋の伸び
        this.legSwing = this.isMoving ? Math.sin(this.animationTime * 15) * 0.1 : 0; // 足の振り
        this.toolBeltSwing = Math.sin(this.animationTime * 10) * 0.1; // ツールベルトの揺れ
        this.footStep = Math.sin(this.animationTime * 10) * 0.1; // 足音エフェクト
        this.overallFlap = this.isMoving ? Math.sin(this.animationTime * 12) * 0.05 : 0; // オーバーオールの揺れ
        this.lastX = this.x;
    }
    // 表情の動的更新
    updateExpression() {
        // 攻撃中は真剣な表情
        if (this.attackMode) {
            this.currentExpression = 'focused';
        }
        // ジャンプ中は驚いた表情
        else if (this.isJumping) {
            this.currentExpression = 'surprised';
        }
        // 移動中は笑顔
        else if (this.isMoving) {
            this.currentExpression = 'happy';
        }
        // アイドル時は通常表情
        else {
            this.currentExpression = 'normal';
        }
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
        // 1930年代風の豊富なアニメーション
        const bounce = Math.sin(this.animationTime * 6) * 0.2;
        const sway = Math.sin(this.animationTime * 8) * 0.1;
        const movementBounce = this.isMoving ? Math.sin(this.animationTime * 15) * 0.3 : 0;
        const jumpEffect = this.isJumping ? Math.sin(this.jumpTime * 16) * 0.2 : 0;
        const attackEffect = this.attackMode ? Math.sin(this.attackTime * 40) * 0.2 : 0;
        // 新しいアニメーション効果を組み合わせ
        const totalBounce = bounce + movementBounce + jumpEffect + attackEffect + this.headBob;
        const totalSway = sway + this.idleSway + this.hairSway;
        const centerX = this.x + this.width / 2 + totalSway;
        const centerY = this.y + this.height / 2 + totalBounce - this.jumpHeight;
        // 移動方向に応じた傾き効果（慣性を考慮）
        const tiltAngle = this.direction * 0.05 + this.hatTilt;
        // 1930年代風メカニックカラーパレット
        const mechanicColors = {
            skin: '#D2B48C', // セピア調肌色
            overalls: '#8B4513', // 茶色のオーバーオール
            shirt: '#F5F5DC', // ベージュのシャツ
            hat: '#654321', // 茶色の帽子
            gloves: '#DEB887', // ベージュの手袋
            tools: '#696969', // グレーの工具
            outline: '#2F2F2F' // 濃いグレーのアウトライン
        };
        // 1930年代風のシンプルな影
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(centerX, this.y + this.height + 2, this.width / 2.5, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        // 体（オーバーオール）- 揺れ効果付き
        ctx.save();
        ctx.translate(centerX, centerY + 5);
        ctx.rotate(tiltAngle);
        ctx.scale(this.breathingEffect * (1 + this.overallFlap), this.breathingEffect * (1 + this.overallFlap));
        // オーバーオール
        ctx.fillStyle = mechanicColors.overalls;
        ctx.strokeStyle = mechanicColors.outline;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width / 2.5, this.height / 2.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // オーバーオールのボタン
        ctx.fillStyle = mechanicColors.tools;
        ctx.beginPath();
        ctx.arc(0, -5, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 5, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        // 頭（肌色）- 頭の上下動付き
        ctx.save();
        ctx.translate(centerX, centerY - 8 + this.headBob);
        ctx.rotate(tiltAngle * 0.5);
        ctx.scale(this.breathingEffect * 0.9, this.breathingEffect * 0.9);
        ctx.fillStyle = mechanicColors.skin;
        ctx.strokeStyle = mechanicColors.outline;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        // 帽子 - 傾きと揺れ効果付き
        const hatPulse = Math.sin(this.animationTime * 10) * 0.05 + 0.95;
        ctx.save();
        ctx.translate(centerX, centerY - 18 + this.headBob);
        ctx.rotate(this.hatTilt);
        ctx.scale(hatPulse, hatPulse);
        ctx.fillStyle = mechanicColors.hat;
        ctx.strokeStyle = mechanicColors.outline;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width / 2.5, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        // 目（1930年代風の丸い目）- 表情に応じて変化
        const eyePulse = Math.sin(this.animationTime * 15) * 0.05 + 0.95;
        const eyeSquint = this.isMoving ? Math.sin(this.animationTime * 25) * 0.02 : 0;
        if (!this.isBlinking) {
            // 表情に応じた目の描画
            let eyeSize = 5 - eyeSquint;
            let eyeSpacing = 8;
            switch (this.currentExpression) {
                case 'happy':
                    eyeSize *= 0.8;
                    eyeSpacing *= 0.9;
                    break;
                case 'focused':
                    eyeSize *= 1.2;
                    eyeSpacing *= 1.1;
                    break;
                case 'surprised':
                    eyeSize *= 1.3;
                    eyeSpacing *= 1.2;
                    break;
            }
            // 左目の白い部分
            ctx.fillStyle = '#FFFFFF';
            ctx.strokeStyle = mechanicColors.outline;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(centerX - eyeSpacing, centerY - 12 + this.headBob, eyeSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            // 右目の白い部分
            ctx.beginPath();
            ctx.arc(centerX + eyeSpacing, centerY - 12 + this.headBob, eyeSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            // 瞳（黒い部分）
            ctx.fillStyle = mechanicColors.outline;
            ctx.beginPath();
            ctx.arc(centerX - eyeSpacing, centerY - 12 + this.headBob, eyeSize * 0.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(centerX + eyeSpacing, centerY - 12 + this.headBob, eyeSize * 0.5, 0, Math.PI * 2);
            ctx.fill();
            // 目のハイライト（1930年代風の小さなハイライト）
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(centerX - eyeSpacing - 2, centerY - 14 + this.headBob, 1, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(centerX + eyeSpacing + 2, centerY - 14 + this.headBob, 1, 0, Math.PI * 2);
            ctx.fill();
        }
        else {
            // まばたき時は細い線
            ctx.strokeStyle = mechanicColors.outline;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(centerX - 12, centerY - 12 + this.headBob);
            ctx.lineTo(centerX - 4, centerY - 12 + this.headBob);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(centerX + 4, centerY - 12 + this.headBob);
            ctx.lineTo(centerX + 12, centerY - 12 + this.headBob);
            ctx.stroke();
        }
        // 鼻（1930年代風の丸い鼻）
        const nosePulse = Math.sin(this.animationTime * 20) * 0.05 + 0.95;
        ctx.fillStyle = mechanicColors.skin;
        ctx.strokeStyle = mechanicColors.outline;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY - 2 + this.headBob, 3 * nosePulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // 口（1930年代風の表情付き）- 表情に応じて変化
        const mouthPulse = Math.sin(this.animationTime * 12) * 0.02 + 0.98;
        ctx.strokeStyle = mechanicColors.outline;
        ctx.lineWidth = 2;
        switch (this.currentExpression) {
            case 'happy':
                // 笑顔
                ctx.beginPath();
                ctx.arc(centerX, centerY + 2 + this.headBob, 4 * mouthPulse, 0, Math.PI);
                ctx.stroke();
                break;
            case 'focused':
                // 真剣な表情
                ctx.beginPath();
                ctx.arc(centerX, centerY + 4 + this.headBob, 3 * mouthPulse, Math.PI, Math.PI * 2);
                ctx.stroke();
                break;
            case 'surprised':
                // 驚いた表情
                ctx.beginPath();
                ctx.arc(centerX, centerY + 2 + this.headBob, 2 * mouthPulse, 0, Math.PI * 2);
                ctx.stroke();
                break;
            default:
                // 通常の表情
                ctx.beginPath();
                ctx.arc(centerX, centerY + 2 + this.headBob, 4 * mouthPulse, 0, Math.PI);
                ctx.stroke();
                break;
        }
        // 手（手袋）- 腕の振り効果付き
        const armSway = this.isMoving ? this.armSwing : 0;
        const armPulse = Math.sin(this.animationTime * 18) * 0.02 + 0.98;
        // 左手
        ctx.fillStyle = mechanicColors.gloves;
        ctx.strokeStyle = mechanicColors.outline;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX - 18 + armSway, centerY + 2, 4 * armPulse * (1 + this.gloveStretch), 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // 右手
        ctx.beginPath();
        ctx.arc(centerX + 18 - armSway, centerY + 2, 4 * armPulse * (1 + this.gloveStretch), 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // 足（1930年代風の靴）- 足の振り効果付き
        const footPulse = Math.sin(this.animationTime * 14) * 0.02 + 0.98;
        const legSway = this.isMoving ? this.legSwing : 0;
        // 左足
        ctx.fillStyle = mechanicColors.tools;
        ctx.strokeStyle = mechanicColors.outline;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX - 8 + legSway, centerY + 15, 5 * footPulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // 右足
        ctx.beginPath();
        ctx.arc(centerX + 8 - legSway, centerY + 15, 5 * footPulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // ツールベルト - 揺れ効果付き
        ctx.strokeStyle = mechanicColors.outline;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX - 15 + this.toolBeltSwing, centerY + 8);
        ctx.lineTo(centerX + 15 + this.toolBeltSwing, centerY + 8);
        ctx.stroke();
        // ツールベルトの装飾
        ctx.fillStyle = mechanicColors.tools;
        ctx.beginPath();
        ctx.arc(centerX - 10 + this.toolBeltSwing, centerY + 8, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 10 + this.toolBeltSwing, centerY + 8, 2, 0, Math.PI * 2);
        ctx.fill();
        // 1930年代風の控えめなエフェクト
        if (this.isMoving) {
            // 手描き風の動き線
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(centerX - this.direction * 20, centerY - 5);
            ctx.lineTo(centerX - this.direction * 30, centerY);
            ctx.stroke();
            // 足音エフェクト（歩行時）
            if (Math.sin(this.footStep) > 0.8) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                ctx.beginPath();
                ctx.ellipse(centerX, centerY + 20, 8, 2, 0, 0, Math.PI * 2);
                ctx.fill();
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
// 弾クラス
export class Bullet extends GameObject {
    constructor(x, y) {
        super(x, y, 4, 10, 8, '#F1C40F');
        this.animationTime = 0;
    }
    update() {
        this.y -= this.speed;
        this.animationTime += 0.016; // アニメーション時間の更新
    }
    draw(ctx) {
        ctx.save();
        // 1930年代風のシンプルな弾
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        // 1930年代風カラーパレット
        const bulletColors = {
            main: '#F4A460', // セピア調オレンジ
            outline: '#8B4513', // 茶色のアウトライン
            glow: '#DEB887' // ベージュのグロー
        };
        // 外側のグロー効果（控えめ）
        ctx.fillStyle = `${bulletColors.glow}40`;
        ctx.beginPath();
        ctx.arc(centerX, centerY, this.width / 2 + 3, 0, Math.PI * 2);
        ctx.fill();
        // 弾の本体
        ctx.fillStyle = bulletColors.main;
        ctx.strokeStyle = bulletColors.outline;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // 内側のハイライト
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(centerX - 1, centerY - 1, this.width / 2 - 2, 0, Math.PI * 2);
        ctx.fill();
        // 1930年代風の控えめなパルス効果
        const pulse = Math.sin(this.animationTime * 20) * 0.3 + 0.7;
        ctx.strokeStyle = `${bulletColors.outline}${Math.floor(pulse * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, this.width / 2 + 2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
    isOffScreen() {
        return this.y + this.height < 0;
    }
}
// 敵クラス（1930年代風動物キャラクター）
export class Enemy extends GameObject {
    constructor(x, y, type) {
        // 1930年代風のセピア調カラーパレット
        const colors = {
            'dog': '#CD853F', // セピア調オレンジ
            'bird': '#4682B4', // セピア調ブルー
            'rabbit': '#9370DB', // セピア調パープル
            'pig': '#DDA0DD' // セピア調ピンク
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
    update() {
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
        this.animationFrame++;
    }
    draw(ctx) {
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
            outline: '#2F2F2F', // 濃いグレーのアウトライン
            highlight: '#FFFFFF', // 白いハイライト
            shadow: '#1A1A1A' // 影色
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
    drawDog(ctx, colors) {
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
        }
        else {
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
    drawBird(ctx, colors) {
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
        }
        else {
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
    drawRabbit(ctx, colors) {
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
        }
        else {
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
    drawPig(ctx, colors) {
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
        }
        else {
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
    isOffScreen() {
        return this.y > 600;
    }
}
// パーティクルエフェクトクラス
export class Particle {
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
