import { GameConfig } from './types';

// レンダラークラス
export class Renderer {
    private ctx: CanvasRenderingContext2D;
    private config: GameConfig;

    constructor(ctx: CanvasRenderingContext2D, config: GameConfig) {
        this.ctx = ctx;
        this.config = config;
    }

    // 背景の描画
    drawBackground(): void {
        this.ctx.save();

        // 1930年代風のセピア調背景色
        this.ctx.fillStyle = '#D2B48C'; // セピア調の茶色
        this.ctx.fillRect(0, 0, this.config.canvasWidth, this.config.canvasHeight);

        // レンガ壁の描画
        this.ctx.fillStyle = '#8B4513'; // 茶色のレンガ
        this.ctx.strokeStyle = '#A0522D'; // 濃い茶色の目地
        this.ctx.lineWidth = 1;
        const brickWidth = 40;
        const brickHeight = 20;
        for (let y = 0; y < this.config.canvasHeight; y += brickHeight) {
            for (let x = 0; x < this.config.canvasWidth; x += brickWidth) {
                this.ctx.strokeRect(x, y, brickWidth, brickHeight);
                this.ctx.fillRect(x, y, brickWidth, brickHeight);
            }
        }

        // 地面の描画（コンクリート風）
        this.ctx.fillStyle = '#696969'; // グレー
        this.ctx.fillRect(0, this.config.canvasHeight - 50, this.config.canvasWidth, 50);
        this.ctx.strokeStyle = '#808080';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(0, this.config.canvasHeight - 50, this.config.canvasWidth, 50);

        // 大きな歯車の描画（背景要素）
        this.ctx.fillStyle = '#A9A9A9'; // ダークグレー
        this.ctx.strokeStyle = '#2F2F2F';
        this.ctx.lineWidth = 2;

        this.drawGear(50, 100, 40, performance.now() * 0.0001, 12); // 左上の歯車
        this.drawGear(this.config.canvasWidth - 50, 200, 60, -performance.now() * 0.00008, 16); // 右側の大きな歯車
        this.drawGear(150, this.config.canvasHeight - 80, 30, performance.now() * 0.00015, 10); // 左下の歯車

        // 動くベルトコンベア
        this.drawConveyorBelt(0, this.config.canvasHeight - 70, this.config.canvasWidth, 20, performance.now() * 0.005);

        // 蒸気・霧のエフェクト
        this.drawSteamEffect();
        
        this.ctx.restore();
    }

    // 歯車を描画するヘルパー関数
    private drawGear(x: number, y: number, radius: number, rotation: number, teeth: number): void {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);

        this.ctx.beginPath();
        for (let i = 0; i < teeth; i++) {
            const angle = (i / teeth) * Math.PI * 2;
            const innerRadius = radius * 0.8;
            const outerRadius = radius * 1.1;

            this.ctx.lineTo(Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius);
            this.ctx.lineTo(Math.cos(angle + Math.PI / (teeth * 3)) * outerRadius, Math.sin(angle + Math.PI / (teeth * 3)) * outerRadius);
            this.ctx.lineTo(Math.cos(angle + Math.PI / (teeth * 1.5)) * outerRadius, Math.sin(angle + Math.PI / (teeth * 1.5)) * outerRadius);
            this.ctx.lineTo(Math.cos(angle + Math.PI / teeth) * innerRadius, Math.sin(angle + Math.PI / teeth) * innerRadius);
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        // 中心部
        this.ctx.beginPath();
        this.ctx.arc(0, 0, radius * 0.4, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.restore();
    }

    // ベルトコンベアを描画するヘルパー関数
    private drawConveyorBelt(x: number, y: number, width: number, height: number, offset: number): void {
        this.ctx.save();
        this.ctx.translate(x, y);

        // ベルトのベース
        this.ctx.fillStyle = '#4F4F4F'; // 暗いグレー
        this.ctx.fillRect(0, 0, width, height);
        this.ctx.strokeStyle = '#2F2F2F';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(0, 0, width, height);

        // 動くベルトの線
        this.ctx.strokeStyle = '#808080';
        this.ctx.lineWidth = 1;
        const lineSpacing = 10;
        for (let i = 0; i < width / lineSpacing + 1; i++) {
            const lineX = (i * lineSpacing + offset) % (width + lineSpacing) - lineSpacing;
            this.ctx.beginPath();
            this.ctx.moveTo(lineX, 0);
            this.ctx.lineTo(lineX, height);
            this.ctx.stroke();
        }

        this.ctx.restore();
    }

    // 蒸気・霧のエフェクトを描画するヘルパー関数
    private drawSteamEffect(): void {
        const time = performance.now() * 0.00005;

        // 画面下部から立ち上る蒸気
        for (let i = 0; i < 5; i++) {
            const x = (i * 80 + time * 500) % (this.config.canvasWidth + 100) - 50; // 左右に動く
            const y = this.config.canvasHeight - 50 - (Math.sin(time * 10 + i) * 20 + 20); // 上下ふわふわ
            const radius = 30 + Math.sin(time * 15 + i) * 10; // 大きさが変化
            const alpha = 0.1 + Math.abs(Math.sin(time * 5 + i)) * 0.1;

            this.ctx.fillStyle = `rgba(200, 200, 200, ${alpha})`; // 白っぽい蒸気
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // 全体的な薄い霧
        this.ctx.fillStyle = 'rgba(210, 180, 140, 0.05)'; // セピア調の薄い霧
        this.ctx.fillRect(0, 0, this.config.canvasWidth, this.config.canvasHeight);
    }

    // ステージ情報の描画
    drawStageInfo(currentStage: number, stageName: string, enemiesDefeated: number, stageTarget: number): void {
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(10, 10, 200, 80);
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(10, 10, 200, 80);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '14px Comic Sans MS';
        this.ctx.textAlign = 'left';
        
        this.ctx.fillText(`ステージ: ${currentStage}`, 20, 30);
        this.ctx.fillText(`${stageName}`, 20, 50);
        this.ctx.fillText(`倒した敵: ${enemiesDefeated}/${stageTarget}`, 20, 70);
        
        this.ctx.restore();
    }

    // ゲームオーバー画面の描画
    drawGameOver(score: number): void {
        this.ctx.save();
        
        // 半透明の背景
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.config.canvasWidth, this.config.canvasHeight);
        
        // ゲームオーバーテキスト
        this.ctx.fillStyle = '#E74C3C';
        this.ctx.font = 'bold 48px Comic Sans MS';
        this.ctx.textAlign = 'center';
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 4;
        this.ctx.strokeText('GAME OVER', this.config.canvasWidth / 2, this.config.canvasHeight / 2 - 50);
        this.ctx.fillText('GAME OVER', this.config.canvasWidth / 2, this.config.canvasHeight / 2 - 50);
        
        // スコア表示
        this.ctx.fillStyle = '#F1C40F';
        this.ctx.font = 'bold 24px Comic Sans MS';
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 2;
        this.ctx.strokeText(`最終スコア: ${score}`, this.config.canvasWidth / 2, this.config.canvasHeight / 2);
        this.ctx.fillText(`最終スコア: ${score}`, this.config.canvasWidth / 2, this.config.canvasHeight / 2);
        
        // リスタート指示
        this.ctx.fillStyle = '#95A5A6';
        this.ctx.font = '16px Comic Sans MS';
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 1;
        this.ctx.strokeText('スペースキーまたはタップでリスタート', this.config.canvasWidth / 2, this.config.canvasHeight / 2 + 50);
        this.ctx.fillText('スペースキーまたはタップでリスタート', this.config.canvasWidth / 2, this.config.canvasHeight / 2 + 50);
        
        this.ctx.restore();
    }

    // 画面のクリア
    clear(): void {
        this.ctx.clearRect(0, 0, this.config.canvasWidth, this.config.canvasHeight);
    }
}
