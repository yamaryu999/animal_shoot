// レンダラークラス
export class Renderer {
    constructor(ctx, config) {
        this.ctx = ctx;
        this.config = config;
    }
    // 背景の描画
    drawBackground() {
        // レトロアニメ風のサイバーパンク背景
        this.ctx.save();
        // 動くサイバーグリッド
        this.ctx.strokeStyle = 'rgba(0, 255, 65, 0.3)';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < 20; i++) {
            const x = (i * 40 + performance.now() * 0.01) % (this.config.canvasWidth + 40) - 20;
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.config.canvasHeight);
            this.ctx.stroke();
        }
        for (let i = 0; i < 30; i++) {
            const y = (i * 40 + performance.now() * 0.005) % (this.config.canvasHeight + 40) - 20;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.config.canvasWidth, y);
            this.ctx.stroke();
        }
        // サイバー星（ピクセル風）
        this.ctx.fillStyle = 'rgba(0, 255, 65, 0.8)';
        for (let i = 0; i < 50; i++) {
            const x = (i * 123 + performance.now() * 0.02) % this.config.canvasWidth;
            const y = (i * 456 + performance.now() * 0.01) % this.config.canvasHeight;
            const size = Math.sin(performance.now() * 0.001 + i) * 0.5 + 1;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        // サイバー雲（データストリーム風）
        this.ctx.fillStyle = 'rgba(0, 102, 255, 0.2)';
        this.ctx.strokeStyle = 'rgba(0, 255, 65, 0.5)';
        this.ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
            const x = (i * 150 + performance.now() * 0.015) % (this.config.canvasWidth + 150) - 75;
            const y = 80 + i * 120;
            const pulse = Math.sin(performance.now() * 0.002 + i) * 0.3 + 0.7;
            this.drawCyberCloud(x, y, pulse);
        }
        // サイバー雨（データストリーム）
        this.ctx.strokeStyle = 'rgba(0, 255, 65, 0.4)';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < 100; i++) {
            const x = (i * 7 + performance.now() * 0.1) % this.config.canvasWidth;
            const y = (i * 13 + performance.now() * 0.05) % this.config.canvasHeight;
            const length = Math.random() * 20 + 10;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x, y + length);
            this.ctx.stroke();
        }
        this.ctx.restore();
    }
    drawCyberCloud(x, y, pulse) {
        // サイバー雲（データストリーム風）
        this.ctx.save();
        this.ctx.globalAlpha = pulse;
        // メインの雲の形
        this.ctx.beginPath();
        this.ctx.arc(x, y, 18, 0, Math.PI * 2);
        this.ctx.arc(x + 22, y, 22, 0, Math.PI * 2);
        this.ctx.arc(x + 44, y, 18, 0, Math.PI * 2);
        this.ctx.arc(x + 22, y - 12, 14, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        // サイバー装飾（データストリーム）
        this.ctx.strokeStyle = 'rgba(0, 255, 65, 0.8)';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            const offsetX = Math.sin(performance.now() * 0.001 + i) * 10;
            const offsetY = Math.cos(performance.now() * 0.001 + i) * 5;
            this.ctx.beginPath();
            this.ctx.moveTo(x + offsetX, y + offsetY);
            this.ctx.lineTo(x + offsetX + 20, y + offsetY - 10);
            this.ctx.stroke();
        }
        // サイバー表情（HUD風）
        const cloudId = Math.floor(x / 100) + Math.floor(y / 100);
        if (cloudId % 3 === 0) {
            this.ctx.fillStyle = '#00ff41';
            this.ctx.beginPath();
            this.ctx.arc(x + 15, y - 5, 2, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(x + 29, y - 5, 2, 0, Math.PI * 2);
            this.ctx.fill();
            // サイバー笑顔
            this.ctx.strokeStyle = '#00ff41';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.arc(x + 22, y + 2, 6, 0.2, Math.PI - 0.2);
            this.ctx.stroke();
        }
        this.ctx.restore();
    }
    // ステージ情報の描画
    drawStageInfo(currentStage, stageName, enemiesDefeated, stageTarget) {
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
    drawGameOver(score) {
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
    clear() {
        this.ctx.clearRect(0, 0, this.config.canvasWidth, this.config.canvasHeight);
    }
}
