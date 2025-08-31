// 改善版ゲームクラス
class ImprovedAnimalShootingGame {
    constructor() {
        this.bullets = [];
        this.enemies = [];
        this.particles = [];
        this.score = 0;
        this.gameOver = false;
        this.lastShot = 0;
        this.shotCooldown = 10;
        this.enemySpawnTimer = 0;
        this.keys = {};
        this.animationId = 0;
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) {
            throw new Error('Canvas element not found');
        }
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            throw new Error('Could not get 2D context');
        }
        this.player = new ImprovedPlayer(180, 520);
        this.setupEventListeners();
        this.gameLoop();
    }
    setupEventListeners() {
        // キーボードイベント
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            // ジャンプ
            if (e.code === 'Space') {
                e.preventDefault();
                this.player.jump();
            }
            // 攻撃
            if (e.code === 'KeyX') {
                e.preventDefault();
                this.player.attack();
            }
        });
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        // タッチイベント（モバイル対応）
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            // タッチ位置に基づいて移動
            if (x < this.canvas.width / 2) {
                this.keys['ArrowLeft'] = true;
                this.keys['ArrowRight'] = false;
            }
            else {
                this.keys['ArrowRight'] = true;
                this.keys['ArrowLeft'] = false;
            }
            // タッチで攻撃
            this.shoot();
        });
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.keys['ArrowLeft'] = false;
            this.keys['ArrowRight'] = false;
        });
    }
    update() {
        if (this.gameOver)
            return;
        // プレイヤーの更新
        this.player.update();
        // 移動処理
        if (this.keys['ArrowLeft']) {
            this.player.moveLeft();
        }
        if (this.keys['ArrowRight']) {
            this.player.moveRight();
        }
        // 自動攻撃
        if (this.keys['Space']) {
            this.shoot();
        }
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
        // 敵の生成
        this.enemySpawnTimer++;
        if (this.enemySpawnTimer >= 60) {
            this.spawnEnemy();
            this.enemySpawnTimer = 0;
        }
        // 衝突判定
        this.checkCollisions();
        // スコア更新
        this.updateScore();
    }
    shoot() {
        if (this.lastShot <= 0) {
            const bullet = new ImprovedBullet(this.player.x + this.player.width / 2 - 2, this.player.y);
            this.bullets.push(bullet);
            this.lastShot = this.shotCooldown;
        }
        this.lastShot--;
    }
    spawnEnemy() {
        const types = [EnemyType.DOG, EnemyType.BIRD, EnemyType.RABBIT, EnemyType.PIG];
        const randomType = types[Math.floor(Math.random() * types.length)];
        const x = Math.random() * (this.canvas.width - 35);
        const enemy = new ImprovedEnemy(x, -35, randomType);
        this.enemies.push(enemy);
    }
    checkCollisions() {
        // 弾と敵の衝突
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                if (this.bullets[i].collidesWith(this.enemies[j])) {
                    // パーティクルエフェクト
                    for (let k = 0; k < 8; k++) {
                        const particle = new ImprovedParticle(this.enemies[j].x + this.enemies[j].width / 2, this.enemies[j].y + this.enemies[j].height / 2, '#F5A623');
                        this.particles.push(particle);
                    }
                    this.bullets.splice(i, 1);
                    this.enemies.splice(j, 1);
                    this.score += 100;
                    break;
                }
            }
        }
        // プレイヤーと敵の衝突
        for (const enemy of this.enemies) {
            if (this.player.collidesWith(enemy)) {
                this.player.takeDamage();
                // パーティクルエフェクト
                for (let i = 0; i < 5; i++) {
                    const particle = new ImprovedParticle(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, '#E74C3C');
                    this.particles.push(particle);
                }
                if (!this.player.isAlive()) {
                    this.gameOver = true;
                }
                break;
            }
        }
    }
    updateScore() {
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            scoreElement.textContent = this.score.toString();
        }
        const livesElement = document.getElementById('lives');
        if (livesElement) {
            livesElement.textContent = this.player.getLives().toString();
        }
    }
    render() {
        // 背景をクリア
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // 雲の描画（Kenney風の背景）
        this.drawClouds();
        // ゲームオブジェクトの描画
        this.player.draw(this.ctx);
        for (const bullet of this.bullets) {
            bullet.draw(this.ctx);
        }
        for (const enemy of this.enemies) {
            enemy.draw(this.ctx);
        }
        for (const particle of this.particles) {
            particle.draw(this.ctx);
        }
        // ゲームオーバー画面
        if (this.gameOver) {
            this.drawGameOver();
        }
    }
    drawClouds() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        // 雲1
        this.ctx.beginPath();
        this.ctx.arc(50, 80, 20, 0, Math.PI * 2);
        this.ctx.arc(70, 80, 25, 0, Math.PI * 2);
        this.ctx.arc(90, 80, 20, 0, Math.PI * 2);
        this.ctx.fill();
        // 雲2
        this.ctx.beginPath();
        this.ctx.arc(300, 120, 15, 0, Math.PI * 2);
        this.ctx.arc(315, 120, 20, 0, Math.PI * 2);
        this.ctx.arc(330, 120, 15, 0, Math.PI * 2);
        this.ctx.fill();
        // 雲3
        this.ctx.beginPath();
        this.ctx.arc(150, 60, 18, 0, Math.PI * 2);
        this.ctx.arc(165, 60, 22, 0, Math.PI * 2);
        this.ctx.arc(180, 60, 18, 0, Math.PI * 2);
        this.ctx.fill();
    }
    drawGameOver() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 50);
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.font = '18px Arial';
        this.ctx.fillText('Press F5 to restart', this.canvas.width / 2, this.canvas.height / 2 + 50);
    }
    gameLoop() {
        this.update();
        this.render();
        this.animationId = requestAnimationFrame(() => this.gameLoop());
    }
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}
// ゲームの初期化
function initImprovedGame() {
    try {
        new ImprovedAnimalShootingGame();
        console.log('🎮 改善版ゲームが開始されました！');
        console.log('📚 Kenney.nlの素材を参考にしたデザインです');
        console.log('⚖️ ライセンス遵守のオリジナル実装です');
    }
    catch (error) {
        console.error('❌ ゲームの初期化に失敗しました:', error);
    }
}
// グローバル関数として公開
if (typeof window !== 'undefined') {
    window.initImprovedGame = initImprovedGame;
}
