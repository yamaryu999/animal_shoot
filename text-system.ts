import { gsap } from './types';

// テキストメッセージクラス
export class TextMessage {
    private text: string;
    private x: number;
    private y: number;
    private duration: number;
    private alpha: number = 1;
    private fadeStart: number;
    private fontSize: number;
    private color: string;

    constructor(text: string, x: number, y: number, duration: number, fontSize: number = 16, color: string = '#2C3E50') {
        this.text = text;
        this.x = x;
        this.y = y;
        this.duration = duration;
        this.fontSize = fontSize;
        this.color = color;
        this.fadeStart = performance.now();
    }

    update(): boolean {
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

    draw(ctx: CanvasRenderingContext2D) {
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
    private ctx: CanvasRenderingContext2D;
    private messages: TextMessage[] = [];

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    addMessage(text: string, x: number, y: number, duration: number = 3000, fontSize: number = 16, color: string = '#2C3E50') {
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
    private ctx: CanvasRenderingContext2D;
    private currentText: string = '';
    private targetText: string = '';
    private charIndex: number = 0;
    private typingSpeed: number = 50;
    private lastTypingTime: number = 0;
    private isTyping: boolean = false;
    private isVisible: boolean = false;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    startTyping(text: string) {
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

    update(): boolean {
        if (!this.isVisible) return false;

        const now = performance.now();
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

        // キャンバスのサイズを動的に取得
        const canvasWidth = this.ctx.canvas.width;
        const canvasHeight = this.ctx.canvas.height;

        // より安全なテキストボックスサイズの計算
        this.ctx.save();
        this.ctx.font = 'bold 16px Comic Sans MS';
        this.ctx.textAlign = 'left';
        
        // テキストの幅を事前に計算（より厳密に）
        const words = this.currentText.split(' ');
        const maxWidth = Math.min(canvasWidth * 0.9, 380); // 最大幅を増加
        const padding = 25;
        const lineHeight = 20;
        const maxLines = 8; // 最大行数をさらに増加
        
        // より厳密な行分割の計算
        const lines: string[] = [];
        let currentLine = '';
        
        for (let word of words) {
            const testLine = currentLine + word + ' ';
            const testWidth = this.ctx.measureText(testLine).width;
            
            if (testWidth > maxWidth - padding * 2 && currentLine !== '') {
                lines.push(currentLine.trim());
                currentLine = word + ' ';
            } else {
                currentLine = testLine;
            }
        }
        
        if (currentLine.trim().length > 0) {
            lines.push(currentLine.trim());
        }
        
        // 最大行数を超える場合は省略（より安全に）
        const displayLines = lines.slice(0, maxLines);
        if (lines.length > maxLines) {
            const lastLine = displayLines[maxLines - 1];
            if (lastLine && lastLine.length > 35) {
                displayLines[maxLines - 1] = lastLine.substring(0, 35) + '...';
            }
        }
        
        // ボックスサイズを動的に計算（より安全に）
        const boxWidth = maxWidth;
        const boxHeight = Math.max(100, displayLines.length * lineHeight + padding * 2);
        const boxX = Math.max(10, (canvasWidth - boxWidth) / 2); // 最小マージンを確保
        const boxY = Math.max(10, canvasHeight - boxHeight - 20); // 最小マージンを確保

        // テキストボックスの背景（1930年代風のデザイン）
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
        this.ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        
        // 枠線（1930年代風の茶色）
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
        
        // 内側の装飾線
        this.ctx.strokeStyle = '#D2691E';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(boxX + 4, boxY + 4, boxWidth - 8, boxHeight - 8);

        // テキストの描画
        this.ctx.fillStyle = '#F5F5DC'; // ベージュ色のテキスト
        this.ctx.font = 'bold 16px Comic Sans MS';
        this.ctx.textAlign = 'left';
        
        let y = boxY + padding + 16; // テキスト開始位置
        
        for (let i = 0; i < displayLines.length; i++) {
            const line = displayLines[i];
            // 各行のテキストが枠内に収まることを確認
            const textX = Math.max(boxX + padding, 15);
            const textY = Math.min(y, canvasHeight - 20);
            this.ctx.fillText(line, textX, textY);
            y += lineHeight;
        }

        // タイピングカーソル（点滅効果付き）
        if (this.isTyping && displayLines.length < maxLines) {
            const lastLine = displayLines[displayLines.length - 1] || '';
            const cursorX = Math.max(boxX + padding, 15) + this.ctx.measureText(lastLine).width;
            const cursorY = Math.min(y - lineHeight, canvasHeight - 20);
            
            // 点滅効果
            const blinkTime = Math.floor(performance.now() / 500) % 2;
            if (blinkTime === 0) {
                this.ctx.fillStyle = '#F5F5DC';
                this.ctx.fillRect(cursorX, cursorY - 15, 3, 18);
            }
        }

        this.ctx.restore();
    }

    isComplete(): boolean {
        return !this.isTyping && this.currentText.length > 0;
    }

    skipTyping(): void {
        // タイピングをスキップしてテキストを全表示
        this.currentText = this.targetText;
        this.charIndex = this.targetText.length;
        this.isTyping = false;
    }
}
