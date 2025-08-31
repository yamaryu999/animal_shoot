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
