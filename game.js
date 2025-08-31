// ゲームの基本設定

// テキストメッセージクラス
class TextMessage {
    constructor(text, x, y, duration, fontSize = 16, color = '#2C3E50') {
        this.text = text;
        this.x = x;
        this.y = y;
        this.duration = duration;
        this.fontSize = fontSize;
        this.color = color;
        this.alpha = 1;
        this.fadeStart = Date.now();
    }

    update() {
        const elapsed = Date.now() - this.fadeStart;
        if (elapsed > this.duration) {
            return false;
        }

        // フェードアウト効果
        if (elapsed > this.duration - 500) {
            this.alpha = 1 - (elapsed - (this.duration - 500)) / 500;
        }

        return true;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.font = `bold ${this.fontSize}px Comic Sans MS`;
        ctx.textAlign = 'center';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.strokeText(this.text, this.x, this.y);
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    }
}

// テキスト表示管理クラス
class TextDisplay {
    constructor(ctx) {
        this.ctx = ctx;
        this.messages = [];
    }

    addMessage(text, x, y, duration = 3000, fontSize = 16, color = '#2C3E50') {
        this.messages.push(new TextMessage(text, x, y, duration, fontSize, color));
    }

    update() {
        this.messages = this.messages.filter(msg => msg.update());
    }

    draw() {
        this.messages.forEach(msg => msg.draw(this.ctx));
    }
}

// ストーリーテキストクラス（タイピング効果付き）
class StoryText {
    constructor(ctx) {
        this.ctx = ctx;
        this.currentText = '';
        this.targetText = '';
        this.charIndex = 0;
        this.typingSpeed = 50;
        this.lastTypingTime = 0;
        this.isTyping = false;
        this.isVisible = false;
    }

    startTyping(text) {
        this.targetText = text;
        this.currentText = '';
        this.charIndex = 0;
        this.isTyping = true;
        this.isVisible = true;
        this.lastTypingTime = Date.now();
    }

    hide() {
        this.isVisible = false;
        this.isTyping = false;
    }

    update() {
        if (!this.isVisible) return false;

        const now = Date.now();
        if (this.isTyping && now - this.lastTypingTime > this.typingSpeed) {
            if (this.charIndex < this.targetText.length) {
                this.currentText += this.targetText[this.charIndex];
                this.charIndex++;
                this.lastTypingTime = now;
            } else {
                this.isTyping = false;
            }
        }

        return true;
    }

    draw() {
        if (!this.isVisible || this.currentText.length === 0) return;

        // テキストボックスの背景
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(50, 450, 300, 100);
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(50, 450, 300, 100);

        // テキスト
        this.ctx.fillStyle = 'white';
        this.ctx.font = '14px Comic Sans MS';
        this.ctx.textAlign = 'left';

        // 改良された複数行対応
        const words = this.currentText.split(' ');
        let line = '';
        let y = 470;
        const maxWidth = 260; // テキストボックス内の最大幅
        const lineHeight = 18;
        const maxLines = 4; // 最大行数
        let currentLine = 0;

        for (let word of words) {
            const testLine = line + word + ' ';
            const testWidth = this.ctx.measureText(testLine).width;
            
            if (testWidth > maxWidth && line !== '') {
                // 現在の行を描画
                if (currentLine < maxLines) {
                    this.ctx.fillText(line.trim(), 70, y);
                    y += lineHeight;
                    currentLine++;
                }
                line = word + ' ';
            } else {
                line = testLine;
            }
            
            // 最大行数に達した場合は省略記号を追加
            if (currentLine >= maxLines) {
                if (line.length > 0) {
                    const truncatedLine = line.substring(0, 30) + '...';
                    this.ctx.fillText(truncatedLine, 70, y - lineHeight);
                }
                break;
            }
        }
        
        // 最後の行を描画
        if (currentLine < maxLines && line.trim().length > 0) {
            this.ctx.fillText(line.trim(), 70, y);
        }

        // タイピングカーソル
        if (this.isTyping && currentLine < maxLines) {
            this.ctx.fillStyle = 'white';
            const cursorX = 70 + this.ctx.measureText(line.trim()).width;
            this.ctx.fillRect(cursorX, y - 15, 2, 15);
        }

        this.ctx.restore();
    }

    isComplete() {
        return !this.isTyping && this.currentText.length > 0;
    }
}

// ストーリーモード管理クラス
class StoryMode {
    constructor() {
        this.currentStage = 1;
        this.storyMessages = [
            [
                "ミケの村が危機に瀕しています...",
                "悪い動物たちが村を荒らしに来ています！",
                "ミケは村を守るために立ち上がりました。",
                "まずは犬の群れを撃退しましょう！"
            ],
            [
                "犬の群れを撃退しました！",
                "今度は空から鳥の攻撃が始まります...",
                "空の敵にも負けないでください！"
            ],
            [
                "鳥の攻撃も防ぎ切りました！",
                "森の中でウサギの罠が仕掛けられています...",
                "慎重に進んでください！"
            ],
            [
                "ウサギの罠も突破しました！",
                "最後の敵、巨大なブタが現れます...",
                "これが最後の戦いです！"
            ]
        ];
        this.currentMessageIndex = 0;
        this.storyShown = false;
    }

    getCurrentStage() {
        return this.currentStage;
    }

    getCurrentMessages() {
        return this.storyMessages[this.currentStage - 1] || [];
    }

    nextMessage() {
        const messages = this.getCurrentMessages();
        if (this.currentMessageIndex < messages.length) {
            return messages[this.currentMessageIndex++];
        }
        return null;
    }

    nextStage() {
        if (this.currentStage < this.storyMessages.length) {
            this.currentStage++;
            this.currentMessageIndex = 0;
            this.storyShown = false;
            return true;
        }
        return false;
    }

    isStoryComplete() {
        return this.currentStage > this.storyMessages.length;
    }

    resetStory() {
        this.currentStage = 1;
        this.currentMessageIndex = 0;
        this.storyShown = false;
    }
}

// ゲームオブジェクトの基本クラス
class GameObject {
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
            height: this.height
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

// プレイヤークラス（ネコキャラクター）
class Player extends GameObject {
    constructor(x, y) {
        super(x, y, 40, 40, 5, '#FF6B6B');
        this.lives = 3;
        this.invulnerable = false;
        this.invulnerableTime = 0;
    }

    update() {
        // 無敵時間の処理
        if (this.invulnerable) {
            this.invulnerableTime--;
            if (this.invulnerableTime <= 0) {
                this.invulnerable = false;
            }
        }
    }

    draw(ctx) {
        // 無敵時間中は点滅表示
        if (this.invulnerable && Math.floor(this.invulnerableTime / 10) % 2 === 0) {
            return;
        }

        // カップヘッドスタイルのネコキャラクター
        ctx.save();
        
        // アニメーション用の軽い揺れ
        const bounce = Math.sin(Date.now() * 0.01) * 0.5;
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2 + bounce;
        
        // 影
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(centerX, this.y + this.height + 2, this.width / 2.5, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // 体（楕円形）
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + 5, this.width / 2.5, this.height / 2.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 頭（大きな円）
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(centerX, centerY - 8, this.width / 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // カップヘッド風の耳（三角形、より大きく）
        ctx.fillStyle = '#FFB6C1';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        
        // 左耳
        ctx.beginPath();
        ctx.moveTo(centerX - 12, centerY - 18);
        ctx.lineTo(centerX - 8, centerY - 28);
        ctx.lineTo(centerX - 4, centerY - 18);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // 右耳
        ctx.beginPath();
        ctx.moveTo(centerX + 4, centerY - 18);
        ctx.lineTo(centerX + 8, centerY - 28);
        ctx.lineTo(centerX + 12, centerY - 18);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // カップヘッド風の大きな目（パイチャート型）
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(centerX - 8, centerY - 12, 6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(centerX + 8, centerY - 12, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // 目の白いハイライト
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(centerX - 6, centerY - 14, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 10, centerY - 14, 2, 0, Math.PI * 2);
        ctx.fill();

        // カップヘッド風の鼻（小さな三角形）
        ctx.fillStyle = '#FFB6C1';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX - 2, centerY - 5);
        ctx.lineTo(centerX + 2, centerY - 5);
        ctx.lineTo(centerX, centerY - 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // カップヘッド風の口（大きな笑顔）
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8, 0.2, Math.PI - 0.2);
        ctx.stroke();
        
        // 手（グローブ風）
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#000000';
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
class Bullet extends GameObject {
    constructor(x, y) {
        super(x, y, 4, 10, 8, '#F1C40F');
    }

    update() {
        this.y -= this.speed;
    }

    draw(ctx) {
        ctx.save();
        
        // カップヘッド風の弾（白いベースに黒い輪郭）
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        
        // 弾を円形に
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2 + 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 内側の黄色い光
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2 - 1, 0, Math.PI * 2);
        ctx.fill();
        
        // 光の効果
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2 - 1, this.y + this.height / 2 - 1, 1, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    isOffScreen() {
        return this.y + this.height < 0;
    }
}

// 敵クラス（いろいろなどうぶつ）
class Enemy extends GameObject {
    constructor(x, y, type) {
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

    update() {
        this.y += this.speed;
        this.animationFrame++;
    }

    draw(ctx) {
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

    drawDog(ctx) {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const bounce = Math.sin(this.animationFrame * 0.1) * 1;
        
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
        ctx.ellipse(centerX, centerY + bounce, this.width / 2.5, this.height / 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 犬の特徴的な茶色の斑点
        ctx.fillStyle = '#D2691E';
        ctx.beginPath();
        ctx.arc(centerX - 8, centerY - 5 + bounce, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 6, centerY + 3 + bounce, 3, 0, Math.PI * 2);
        ctx.fill();

        // カップヘッド風の大きな垂れ耳
        ctx.fillStyle = '#8B4513';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        
        // 左耳
        ctx.beginPath();
        ctx.ellipse(centerX - 12, centerY - 8 + bounce, 6, 10, Math.PI / 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 右耳
        ctx.beginPath();
        ctx.ellipse(centerX + 12, centerY - 8 + bounce, 6, 10, -Math.PI / 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // カップヘッド風の大きな目
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(centerX - 6, centerY - 8 + bounce, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 6, centerY - 8 + bounce, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // 目のハイライト
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(centerX - 4, centerY - 10 + bounce, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX + 8, centerY - 10 + bounce, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // 大きな黒い鼻
        ctx.fillStyle = '#000000';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY - 2 + bounce, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // 口（笑顔）
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY + 2 + bounce, 6, 0.3, Math.PI - 0.3);
        ctx.stroke();
        
        // 舌
        ctx.fillStyle = '#FF69B4';
        ctx.beginPath();
        ctx.ellipse(centerX + 2, centerY + 6 + bounce, 3, 2, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    drawBird(ctx) {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const bounce = Math.sin(this.animationFrame * 0.15) * 1.5;
        
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
        ctx.ellipse(centerX, centerY + bounce, this.width / 2.2, this.height / 2.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // 青い羽根の模様
        ctx.fillStyle = '#4169E1';
        ctx.beginPath();
        ctx.ellipse(centerX - 6, centerY - 3 + bounce, 4, 6, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(centerX + 6, centerY - 3 + bounce, 4, 6, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        // カップヘッド風の翼（アニメーション付き）
        ctx.fillStyle = '#87CEEB';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        const wingFlap = Math.sin(this.animationFrame * 0.4) * 15;
        
        // 左翼
        ctx.save();
        ctx.translate(centerX - 15, centerY + bounce);
        ctx.rotate((wingFlap * Math.PI) / 180);
        ctx.beginPath();
        ctx.ellipse(0, 0, 8, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        
        // 右翼
        ctx.save();
        ctx.translate(centerX + 15, centerY + bounce);
        ctx.rotate((-wingFlap * Math.PI) / 180);
        ctx.beginPath();
        ctx.ellipse(0, 0, 8, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
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

        // カップヘッド風の大きなくちばし
        ctx.fillStyle = '#FFA500';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 2 + bounce);
        ctx.lineTo(centerX + 8, centerY - 8 + bounce);
        ctx.lineTo(centerX + 6, centerY + 2 + bounce);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // 小さな羽根の装飾
        ctx.fillStyle = '#4169E1';
        ctx.beginPath();
        ctx.arc(centerX, centerY - 12 + bounce, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    drawRabbit(ctx) {
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

    drawPig(ctx) {
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

    isOffScreen() {
        return this.y > 600;
    }
}

// パーティクルエフェクトクラス
class Particle {
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

// メインゲームクラス
class AnimalShootingGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.config = {
            canvasWidth: 400,
            canvasHeight: 600,
            playerSpeed: 5,
            bulletSpeed: 8,
            enemySpeed: 2,
            enemySpawnRate: 60
        };

        this.player = new Player(180, 520);
        this.bullets = [];
        this.enemies = [];
        this.particles = [];
        
        this.score = 0;
        this.gameOver = false;
        this.keys = {};
        this.lastShot = 0;
        this.shotCooldown = 10;
        this.enemySpawnTimer = 0;
        
        // ストーリー関連の初期化
        this.textDisplay = new TextDisplay(this.ctx);
        this.storyText = new StoryText(this.ctx);
        this.storyMode = new StoryMode();
        this.currentStoryMessage = null;
        this.storyPaused = false;
        this.stageProgress = 0;
        this.enemiesDefeated = 0;
        this.stageTarget = 10;
        
        // モバイル操作関連
        this.isMobile = false;
        this.touchPosition = null;
        this.lastTouchTime = 0;
        this.touchThreshold = 200; // タップ判定の時間閾値（ミリ秒）
        this.autoShoot = false; // 自動攻撃モード
        this.shootButtonPressed = false; // 攻撃ボタンの状態
        
        // モバイル検出
        this.detectMobile();
        
        this.setupEventListeners();
        this.setupTouchControls();
        this.startStory();
        this.gameLoop();
    }

    detectMobile() {
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                       ('ontouchstart' in window) ||
                       (window.innerWidth <= 768);
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            // ストーリーテキストのスキップ
            if (e.code === 'Space' && this.storyPaused) {
                this.skipStoryText();
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // タッチイベント（ストーリースキップ用）
        if (this.isMobile) {
            this.canvas.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (this.storyPaused) {
                    this.skipStoryText();
                }
            });
        }
    }

    setupTouchControls() {
        if (!this.isMobile) return;

        let touchStartTime = 0;
        let touchStartPos = { x: 0, y: 0 };

        // タッチ開始
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.storyPaused) {
                this.skipStoryText();
                return;
            }

            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            
            touchStartTime = Date.now();
            touchStartPos = {
                x: (touch.clientX - rect.left) * scaleX,
                y: (touch.clientY - rect.top) * scaleY
            };

            this.touchPosition = touchStartPos;
            this.createTouchFeedback(touch.clientX, touch.clientY);
        });

        // タッチ移動
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (this.storyPaused) return;

            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            
            this.touchPosition = {
                x: (touch.clientX - rect.left) * scaleX,
                y: (touch.clientY - rect.top) * scaleY
            };
        });

        // タッチ終了
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (this.storyPaused) return;

            const touchEndTime = Date.now();
            const touchDuration = touchEndTime - touchStartTime;

            // 短いタッチ（タップ）の場合は攻撃
            if (touchDuration < this.touchThreshold) {
                this.shoot();
            }

            this.touchPosition = null;
        });

        // タッチキャンセル
        this.canvas.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            this.touchPosition = null;
        });

        // 攻撃ボタンのイベントリスナー
        const shootBtn = document.getElementById('shootBtn');
        if (shootBtn) {
            shootBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.shootButtonPressed = true;
                shootBtn.classList.add('pressed');
            });

            shootBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.shootButtonPressed = false;
                shootBtn.classList.remove('pressed');
            });

            shootBtn.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                this.shootButtonPressed = false;
                shootBtn.classList.remove('pressed');
            });

            // デスクトップでのテスト用
            shootBtn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.shootButtonPressed = true;
                shootBtn.classList.add('pressed');
            });

            shootBtn.addEventListener('mouseup', (e) => {
                e.preventDefault();
                this.shootButtonPressed = false;
                shootBtn.classList.remove('pressed');
            });

            shootBtn.addEventListener('mouseleave', (e) => {
                e.preventDefault();
                this.shootButtonPressed = false;
                shootBtn.classList.remove('pressed');
            });
        }

        // 自動攻撃ボタンのイベントリスナー
        const autoShootBtn = document.getElementById('autoShootBtn');
        if (autoShootBtn) {
            autoShootBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.autoShoot = !this.autoShoot;
                autoShootBtn.classList.toggle('active');
                autoShootBtn.textContent = this.autoShoot ? '🔴' : '⚪';
            });

            autoShootBtn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.autoShoot = !this.autoShoot;
                autoShootBtn.classList.toggle('active');
                autoShootBtn.textContent = this.autoShoot ? '🔴' : '⚪';
            });
        }
    }

    createTouchFeedback(clientX, clientY) {
        const feedback = document.createElement('div');
        feedback.className = 'touch-feedback';
        feedback.style.left = (clientX - 20) + 'px';
        feedback.style.top = (clientY - 20) + 'px';
        
        document.body.appendChild(feedback);
        
        // アニメーション終了後に削除
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 300);
    }
    
    startStory() {
        this.storyPaused = true;
        this.currentStoryMessage = this.storyMode.nextMessage();
        if (this.currentStoryMessage) {
            this.storyText.startTyping(this.currentStoryMessage);
        }
    }
    
    skipStoryText() {
        if (this.storyText.isComplete()) {
            this.currentStoryMessage = this.storyMode.nextMessage();
            if (this.currentStoryMessage) {
                this.storyText.startTyping(this.currentStoryMessage);
            } else {
                // ストーリー終了、ゲーム開始
                this.storyPaused = false;
                this.storyText.hide();
                this.textDisplay.addMessage("ゲーム開始！", 200, 100, 2000, 20, '#27AE60');
            }
        } else {
            // タイピングをスキップ
            this.storyText.startTyping(this.currentStoryMessage || '');
        }
    }
    
    checkStageProgress() {
        const currentStage = this.storyMode.getCurrentStage();
        const stageMessages = this.storyMode.getCurrentMessages();
        
        // ステージ進行条件をチェック
        if (this.enemiesDefeated >= this.stageTarget) {
            this.stageProgress++;
            this.enemiesDefeated = 0;
            
            if (this.stageProgress >= stageMessages.length - 1) {
                // ステージクリア
                this.textDisplay.addMessage(`ステージ${currentStage}クリア！`, 200, 150, 3000, 24, '#E74C3C');
                
                if (this.storyMode.nextStage()) {
                    // 次のステージへ
                    setTimeout(() => {
                        this.storyPaused = true;
                        this.currentStoryMessage = this.storyMode.nextMessage();
                        if (this.currentStoryMessage) {
                            this.storyText.startTyping(this.currentStoryMessage);
                        }
                    }, 3000);
                } else {
                    // ゲームクリア
                    this.textDisplay.addMessage("ゲームクリア！お疲れ様でした！", 200, 200, 5000, 28, '#F39C12');
                }
            }
        }
    }

    handleInput() {
        // キーボード入力
        if (this.keys['ArrowLeft']) {
            this.player.moveLeft();
        }
        if (this.keys['ArrowRight']) {
            this.player.moveRight();
        }
        if (this.keys['Space']) {
            this.shoot();
        }

        // タッチ入力（モバイル）
        if (this.isMobile && this.touchPosition) {
            this.handleTouchMovement();
        }

        // モバイル攻撃ボタン
        if (this.isMobile && this.shootButtonPressed) {
            this.shoot();
        }

        // 自動攻撃
        if (this.isMobile && this.autoShoot) {
            this.shoot();
        }
    }

    handleTouchMovement() {
        if (!this.touchPosition) return;

        const playerBounds = this.player.getBounds();
        const playerCenterX = playerBounds.x + playerBounds.width / 2;
        const touchX = this.touchPosition.x;

        // タッチ位置とプレイヤーの距離を計算
        const distance = Math.abs(touchX - playerCenterX);
        const threshold = 10; // 移動を停止する距離の閾値

        if (distance > threshold) {
            if (touchX < playerCenterX) {
                this.player.moveLeft();
            } else if (touchX > playerCenterX) {
                this.player.moveRight();
            }
        }
    }

    shoot() {
        const now = Date.now();
        if (now - this.lastShot > this.shotCooldown * 16) { // 60FPS想定
            const bullet = new Bullet(
                this.player.getBounds().x + this.player.getBounds().width / 2 - 2,
                this.player.getBounds().y
            );
            this.bullets.push(bullet);
            this.lastShot = now;
        }
    }

    spawnEnemy() {
        if (this.storyPaused) return;
        
        this.enemySpawnTimer++;
        if (this.enemySpawnTimer >= this.config.enemySpawnRate) {
            const currentStage = this.storyMode.getCurrentStage();
            let types;
            
            // ステージに応じて敵の種類を制限
            switch (currentStage) {
                case 1:
                    types = ['dog'];
                    break;
                case 2:
                    types = ['bird'];
                    break;
                case 3:
                    types = ['rabbit'];
                    break;
                case 4:
                    types = ['pig'];
                    break;
                default:
                    types = ['dog', 'bird', 'rabbit', 'pig'];
            }
            
            const type = types[Math.floor(Math.random() * types.length)];
            const x = Math.random() * (this.config.canvasWidth - 35);
            const enemy = new Enemy(x, -35, type);
            this.enemies.push(enemy);
            this.enemySpawnTimer = 0;
            
            // 難易度調整
            this.config.enemySpawnRate = Math.max(20, this.config.enemySpawnRate - 0.1);
        }
    }

    updateGameObjects() {
        // プレイヤーの更新
        this.player.update();

        // 弾の更新
        this.bullets = this.bullets.filter(bullet => {
            bullet.update();
            return !bullet.isOffScreen();
        });

        // 敵の更新
        this.enemies = this.enemies.filter(enemy => {
            enemy.update();
            return !enemy.isOffScreen();
        });

        // パーティクルの更新
        this.particles = this.particles.filter(particle => {
            return particle.update();
        });
        
        // テキスト表示の更新
        this.textDisplay.update();
        this.storyText.update();
    }

    checkCollisions() {
        // 弾と敵の衝突判定
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                if (this.bullets[i].collidesWith(this.enemies[j])) {
                    // パーティクルエフェクト
                    for (let k = 0; k < 10; k++) {
                        this.particles.push(new Particle(
                            this.enemies[j].getBounds().x + this.enemies[j].getBounds().width / 2,
                            this.enemies[j].getBounds().y + this.enemies[j].getBounds().height / 2,
                            this.enemies[j].getBounds().color || '#FF6B6B'
                        ));
                    }
                    
                    this.bullets.splice(i, 1);
                    this.enemies.splice(j, 1);
                    this.score += 100;
                    this.enemiesDefeated++;
                    
                    // 敵を倒した時のメッセージ
                    this.textDisplay.addMessage("+100点！", 
                        this.enemies[j]?.getBounds().x || 200, 
                        this.enemies[j]?.getBounds().y || 100, 
                        1000, 16, '#F1C40F');
                    
                    // ステージ進行チェック
                    this.checkStageProgress();
                    break;
                }
            }
        }

        // プレイヤーと敵の衝突判定
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            if (this.player.collidesWith(this.enemies[i])) {
                this.player.takeDamage();
                this.enemies.splice(i, 1);
                
                // パーティクルエフェクト
                for (let k = 0; k < 15; k++) {
                    this.particles.push(new Particle(
                        this.player.getBounds().x + this.player.getBounds().width / 2,
                        this.player.getBounds().y + this.player.getBounds().height / 2,
                        '#FF6B6B'
                    ));
                }
                
                if (!this.player.isAlive()) {
                    this.gameOver = true;
                }
                break;
            }
        }
    }

    draw() {
        // 背景のクリア
        this.ctx.clearRect(0, 0, this.config.canvasWidth, this.config.canvasHeight);

        // 背景の雲を描画
        this.drawBackground();

        // ゲームオブジェクトの描画
        this.player.draw(this.ctx);
        this.bullets.forEach(bullet => bullet.draw(this.ctx));
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        this.particles.forEach(particle => particle.draw(this.ctx));
        
        // テキスト表示の描画
        this.textDisplay.draw();
        this.storyText.draw();
        
        // ステージ情報の表示
        if (!this.storyPaused) {
            this.drawStageInfo();
        }
    }
    
    drawStageInfo() {
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(10, 10, 200, 60);
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(10, 10, 200, 60);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '14px Comic Sans MS';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`ステージ: ${this.storyMode.getCurrentStage()}`, 20, 30);
        this.ctx.fillText(`倒した敵: ${this.enemiesDefeated}/${this.stageTarget}`, 20, 50);
        
        this.ctx.restore();
    }

    drawBackground() {
        // カップヘッド風の背景
        this.ctx.save();
        
        // 動く雲（カップヘッドスタイル）
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 2;
        for (let i = 0; i < 4; i++) {
            const x = (i * 120 + Date.now() * 0.02) % (this.config.canvasWidth + 120) - 60;
            const y = 60 + i * 100;
            const bounce = Math.sin(Date.now() * 0.003 + i) * 3;
            this.drawCupheadCloud(x, y + bounce);
        }
        
        // 背景の装飾的な線（1930年代風）
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < 8; i++) {
            const x = (i * 60 + Date.now() * 0.005) % (this.config.canvasWidth + 60);
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.config.canvasHeight);
            this.ctx.stroke();
        }
        
        // 背景のドット模様
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 30; j++) {
                if ((i + j) % 3 === 0) {
                    this.ctx.beginPath();
                    this.ctx.arc(i * 20 + 10, j * 20 + 10, 1, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        }
        
        this.ctx.restore();
    }

    drawCupheadCloud(x, y) {
        // カップヘッド風の雲（輪郭付き）
        this.ctx.beginPath();
        this.ctx.arc(x, y, 18, 0, Math.PI * 2);
        this.ctx.arc(x + 22, y, 22, 0, Math.PI * 2);
        this.ctx.arc(x + 44, y, 18, 0, Math.PI * 2);
        this.ctx.arc(x + 22, y - 12, 14, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        // 雲の表情（位置に基づいて固定的に決定）
        const cloudId = Math.floor(x / 100) + Math.floor(y / 100);
        if (cloudId % 3 === 0) { // 3つに1つの雲に表情を付ける
            this.ctx.fillStyle = '#000000';
            this.ctx.beginPath();
            this.ctx.arc(x + 15, y - 5, 2, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(x + 29, y - 5, 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 笑顔
            this.ctx.strokeStyle = '#000000';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.arc(x + 22, y + 2, 6, 0.2, Math.PI - 0.2);
            this.ctx.stroke();
        }
    }

    updateUI() {
        document.getElementById('score').textContent = this.score.toString();
        document.getElementById('lives').textContent = this.player.getLives().toString();
    }

    showGameOver() {
        const gameOverElement = document.getElementById('gameOver');
        const finalScoreElement = document.getElementById('finalScore');
        finalScoreElement.textContent = this.score.toString();
        gameOverElement.style.display = 'block';
    }

    gameLoop() {
        if (!this.gameOver) {
            if (!this.storyPaused) {
                this.handleInput();
                this.spawnEnemy();
                this.updateGameObjects();
                this.checkCollisions();
            } else {
                // ストーリー中はテキストのみ更新
                this.updateGameObjects();
            }
            this.draw();
            this.updateUI();
        } else {
            this.showGameOver();
        }
        
        requestAnimationFrame(() => this.gameLoop());
    }

    restart() {
        this.player = new Player(180, 520);
        this.bullets = [];
        this.enemies = [];
        this.particles = [];
        this.score = 0;
        this.gameOver = false;
        this.enemySpawnTimer = 0;
        this.config.enemySpawnRate = 60;
        
        // ストーリー関連のリセット
        this.storyMode.resetStory();
        this.storyPaused = false;
        this.stageProgress = 0;
        this.enemiesDefeated = 0;
        this.stageTarget = 10;
        this.textDisplay = new TextDisplay(this.ctx);
        this.storyText = new StoryText(this.ctx);
        
        // タッチコントロールのリセット
        this.touchPosition = null;
        this.shootButtonPressed = false;
        this.autoShoot = false;
        
        // ストーリー再開
        this.startStory();
        
        document.getElementById('gameOver').style.display = 'none';
    }
}

// グローバル関数（HTMLから呼び出し用）
let game;

function restartGame() {
    if (game) {
        game.restart();
    }
}

// ゲーム開始
window.addEventListener('load', () => {
    game = new AnimalShootingGame();
});