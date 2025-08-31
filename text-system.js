// テキストメッセージクラス
export class TextMessage {
    constructor(text, x, y, duration, fontSize = 16, color = '#2C3E50') {
        this.alpha = 1;
        this.text = text;
        this.x = x;
        this.y = y;
        this.duration = duration;
        this.fontSize = fontSize;
        this.color = color;
        this.fadeStart = performance.now();
    }
    update() {
        const elapsed = performance.now() - this.fadeStart;
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
export class TextDisplay {
    constructor(ctx) {
        this.messages = [];
        this.ctx = ctx;
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
export class StoryText {
    constructor(ctx) {
        this.currentText = '';
        this.targetText = '';
        this.charIndex = 0;
        this.typingSpeed = 50;
        this.lastTypingTime = 0;
        this.isTyping = false;
        this.isVisible = false;
        this.ctx = ctx;
    }
    startTyping(text) {
        this.targetText = text;
        this.currentText = '';
        this.charIndex = 0;
        this.isTyping = true;
        this.isVisible = true;
        this.lastTypingTime = performance.now();
    }
    hide() {
        this.isVisible = false;
        this.isTyping = false;
    }
    update() {
        if (!this.isVisible)
            return false;
        const now = performance.now();
        if (this.isTyping && now - this.lastTypingTime > this.typingSpeed) {
            if (this.charIndex < this.targetText.length) {
                this.currentText += this.targetText[this.charIndex];
                this.charIndex++;
                this.lastTypingTime = now;
            }
            else {
                this.isTyping = false;
            }
        }
        return true;
    }
    draw() {
        if (!this.isVisible || this.currentText.length === 0)
            return;
        // テキストボックスの背景（1930年代風デザイン）
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(139, 69, 19, 0.9)'; // セピア調の背景
        this.ctx.fillRect(20, 480, 360, 100);
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(20, 480, 360, 100);
        
        // 1930年代風の装飾枠
        this.ctx.strokeStyle = '#DEB887';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(25, 485, 350, 90);
        
        // テキスト
        this.ctx.fillStyle = '#F5F5DC'; // ベージュのテキスト
        this.ctx.font = 'bold 16px "Playfair Display", serif';
        this.ctx.textAlign = 'left';
        
        // 改良された複数行対応
        const words = this.currentText.split(' ');
        let line = '';
        let y = 500;
        const maxWidth = 330; // テキストボックス内の最大幅をさらに拡大
        const lineHeight = 22;
        const maxLines = 4; // 最大行数
        let currentLine = 0;
        for (let word of words) {
            const testLine = line + word + ' ';
            const testWidth = this.ctx.measureText(testLine).width;
            if (testWidth > maxWidth && line !== '') {
                // 現在の行を描画
                if (currentLine < maxLines) {
                    this.ctx.fillText(line.trim(), 40, y);
                    y += lineHeight;
                    currentLine++;
                }
                line = word + ' ';
            }
            else {
                line = testLine;
            }
            // 最大行数に達した場合は省略記号を追加
            if (currentLine >= maxLines) {
                if (line.length > 0) {
                    const truncatedLine = line.substring(0, 35) + '...';
                    this.ctx.fillText(truncatedLine, 40, y - lineHeight);
                }
                break;
            }
        }
        // 最後の行を描画
        if (currentLine < maxLines && line.trim().length > 0) {
            this.ctx.fillText(line.trim(), 40, y);
        }
        // タイピングカーソル（1930年代風）
        if (this.isTyping && currentLine < maxLines) {
            this.ctx.fillStyle = '#F4A460'; // セピア調のカーソル
            const cursorX = 40 + this.ctx.measureText(line.trim()).width;
            this.ctx.fillRect(cursorX, y - 18, 3, 18);
        }
        this.ctx.restore();
    }
    isComplete() {
        return !this.isTyping && this.currentText.length > 0;
    }
    skipTyping() {
        // タイピングをスキップしてテキストを全表示
        this.currentText = this.targetText;
        this.charIndex = this.targetText.length;
        this.isTyping = false;
    }
}
