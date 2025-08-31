import { GameConfig, EnemyType } from './types';
import { TextDisplay, StoryText } from './text-system';
import { StoryMode } from './story-mode';
import { Player, Bullet, Enemy, Particle } from './game-objects';
import { InputHandler } from './input-handler';
import { Renderer } from './renderer';

// GSAP型定義
declare const gsap: any;

// メインゲームクラス
export class AnimalShootingGame {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private config: GameConfig;
    
    private player: Player;
    private bullets: Bullet[] = [];
    private enemies: Enemy[] = [];
    private particles: Particle[] = [];
    
    private score: number = 0;
    private gameOver: boolean = false;
    private lastShot: number = 0;
    private shotCooldown: number = 10;
    private enemySpawnTimer: number = 0;
    
    // ストーリー関連
    private textDisplay: TextDisplay;
    private storyText: StoryText;
    private storyMode: StoryMode;
    private currentStoryMessage: string | null = null;
    private storyPaused: boolean = false;
    private stageProgress: number = 0;
    private enemiesDefeated: number = 0;
    private stageTarget: number = 10;
    
    // システム関連
    private inputHandler: InputHandler;
    private renderer: Renderer;
    
    // パフォーマンス改善用
    private lastFrameTime: number = 0;
    private animationId: number = 0;

    constructor() {
        this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        if (!this.canvas) {
            throw new Error('Canvas element not found');
        }
        
        this.ctx = this.canvas.getContext('2d')!;
        if (!this.ctx) {
            throw new Error('Could not get 2D context');
        }
        
        this.config = {
            canvasWidth: 400,
            canvasHeight: 600,
            playerSpeed: 5,
            bulletSpeed: 8,
            enemySpeed: 2,
            enemySpawnRate: 60,
            minEnemySpawnRate: 20
        };

        this.player = new Player(180, 520);
        
        // システムの初期化
        this.textDisplay = new TextDisplay(this.ctx);
        this.storyText = new StoryText(this.ctx);
        this.storyMode = new StoryMode();
        this.inputHandler = new InputHandler(this.canvas);
        this.renderer = new Renderer(this.ctx, this.config);
        
        this.setupStorySkipHandler();
        this.startStory();
        this.gameLoop();
        
        // GSAPアニメーション初期化
        this.initGSAPAnimations();
    }

    private setupStorySkipHandler(): void {
        this.inputHandler.setupStorySkipHandler(() => {
            if (this.storyPaused) {
                this.skipStoryText();
            }
        });
    }

    private initGSAPAnimations(): void {
        if (typeof gsap === 'undefined') return;
        
        // ゲームコンテナの初期アニメーション
        const gameContainer = document.querySelector('.game-container');
        if (gameContainer) {
            gsap.fromTo(gameContainer, 
                { scale: 0.8, opacity: 0, rotation: -5 },
                { scale: 1, opacity: 1, rotation: 0, duration: 1, ease: "back.out(1.7)" }
            );
        }
        
        // UI要素のアニメーション
        const uiOverlay = document.querySelector('.ui-overlay');
        if (uiOverlay) {
            gsap.fromTo(uiOverlay, 
                { x: -100, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8, delay: 0.3, ease: "power2.out" }
            );
        }
        
        const instructions = document.querySelector('.instructions');
        if (instructions) {
            gsap.fromTo(instructions, 
                { x: 100, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8, delay: 0.5, ease: "power2.out" }
            );
        }
    }
    
    private startStory(): void {
        this.storyPaused = true;
        this.currentStoryMessage = this.storyMode.nextMessage();
        if (this.currentStoryMessage) {
            this.storyText.startTyping(this.currentStoryMessage);
        }
    }
    
    private skipStoryText(): void {
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
            // タイピングをスキップしてテキストを全表示
            this.storyText.skipTyping();
        }
    }
    
    private checkStageProgress(): void {
        const currentStage = this.storyMode.getCurrentStage();
        const stageMessages = this.storyMode.getCurrentMessages();
        
        // ステージ進行条件をチェック
        if (this.enemiesDefeated >= this.stageTarget) {
            this.stageProgress++;
            this.enemiesDefeated = 0;
            
            if (this.stageProgress >= stageMessages.length - 1) {
                // ステージクリア
                let stageName = "";
                switch (currentStage) {
                    case 1:
                        stageName = "ダークアニマルズ先兵撃退";
                        break;
                    case 2:
                        stageName = "スカイレイダーズ撃退";
                        break;
                    case 3:
                        stageName = "フォレストトラッパーズ突破";
                        break;
                    case 4:
                        stageName = "キングピッグ撃破";
                        break;
                    case 5:
                        stageName = "真実の解明";
                        break;
                }
                this.textDisplay.addMessage(`${stageName}完了！`, 200, 150, 3000, 24, '#E74C3C');
                
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
                    this.textDisplay.addMessage("伝説の英雄ミケ、誕生！", 200, 200, 5000, 28, '#F39C12');
                    setTimeout(() => {
                        this.textDisplay.addMessage("しかし、冒険は続く...", 200, 250, 4000, 20, '#9B59B6');
                    }, 2000);
                }
            }
        }
    }

    private handleInput(): void {
        // キーボード入力
        if (this.inputHandler.isKeyPressed('ArrowLeft')) {
            this.player.moveLeft();
        }
        if (this.inputHandler.isKeyPressed('ArrowRight')) {
            this.player.moveRight();
        }
        if (this.inputHandler.isKeyPressed('Space')) {
            this.shoot();
        }

        // タッチ入力（モバイル）
        if (this.inputHandler.isMobileDevice() && this.inputHandler.getTouchPosition()) {
            this.handleTouchMovement();
        }

        // モバイル攻撃ボタン
        if (this.inputHandler.isMobileDevice() && this.inputHandler.isShootPressed()) {
            this.shoot();
        }

        // 自動攻撃
        if (this.inputHandler.isMobileDevice() && this.inputHandler.isAutoShootEnabled()) {
            this.shoot();
        }
    }

    private handleTouchMovement(): void {
        const touchPosition = this.inputHandler.getTouchPosition();
        if (!touchPosition) return;

        const playerBounds = this.player.getBounds();
        const playerCenterX = playerBounds.x + playerBounds.width / 2;
        const touchX = touchPosition.x;

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

    private shoot(): void {
        const now = performance.now();
        if (now - this.lastShot > this.shotCooldown * 16) {
            const bullet = new Bullet(
                this.player.getBounds().x + this.player.getBounds().width / 2 - 2,
                this.player.getBounds().y
            );
            this.bullets.push(bullet);
            this.lastShot = now;
        }
    }

    private spawnEnemy(): void {
        if (this.storyPaused) return;
        
        this.enemySpawnTimer++;
        if (this.enemySpawnTimer >= this.config.enemySpawnRate) {
            const currentStage = this.storyMode.getCurrentStage();
            let types: EnemyType[];
            
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
            
            // 難易度調整（最小値で制限）
            this.config.enemySpawnRate = Math.max(
                this.config.minEnemySpawnRate, 
                this.config.enemySpawnRate - 0.1
            );
        }
    }

    private updateGameObjects(): void {
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

    private checkCollisions(): void {
        // 弾と敵の衝突判定
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                if (this.bullets[i].collidesWith(this.enemies[j])) {
                    const enemyBounds = this.enemies[j].getBounds();
                    
                    // パーティクルエフェクト（数を制限）
                    const particleCount = Math.min(10, this.particles.length + 10);
                    for (let k = 0; k < particleCount; k++) {
                        this.particles.push(new Particle(
                            enemyBounds.x + enemyBounds.width / 2,
                            enemyBounds.y + enemyBounds.height / 2,
                            enemyBounds.color || '#FF6B6B'
                        ));
                    }
                    
                    this.bullets.splice(i, 1);
                    this.enemies.splice(j, 1);
                    this.score += 100;
                    this.enemiesDefeated++;
                    
                    // 敵を倒した時のメッセージ
                    this.textDisplay.addMessage("+100点！", 
                        enemyBounds.x, 
                        enemyBounds.y, 
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
                const enemyBounds = this.enemies[i].getBounds();
                this.enemies.splice(i, 1);
                
                // パーティクルエフェクト（数を制限）
                const particleCount = Math.min(15, this.particles.length + 15);
                for (let k = 0; k < particleCount; k++) {
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

    private draw(): void {
        // 背景のクリア
        this.renderer.clear();

        // 背景の描画
        this.renderer.drawBackground();

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
            const stageName = this.getStageName();
            this.renderer.drawStageInfo(
                this.storyMode.getCurrentStage(),
                stageName,
                this.enemiesDefeated,
                this.stageTarget
            );
        }
    }

    private getStageName(): string {
        switch (this.storyMode.getCurrentStage()) {
            case 1:
                return "ダークアニマルズ先兵";
            case 2:
                return "スカイレイダーズ";
            case 3:
                return "フォレストトラッパーズ";
            case 4:
                return "キングピッグ";
            case 5:
                return "真実の解明";
            default:
                return "未知のステージ";
        }
    }

    private updateUI(): void {
        const scoreElement = document.getElementById('score');
        const livesElement = document.getElementById('lives');
        
        if (scoreElement) {
            scoreElement.textContent = this.score.toString();
        }
        if (livesElement) {
            livesElement.textContent = this.player.getLives().toString();
        }
    }

    private showGameOver(): void {
        const gameOverElement = document.getElementById('gameOver');
        const finalScoreElement = document.getElementById('finalScore');
        
        if (gameOverElement && finalScoreElement) {
            finalScoreElement.textContent = this.score.toString();
            gameOverElement.style.display = 'block';
            
            // GSAPゲームオーバーアニメーション
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(gameOverElement, 
                    { scale: 0, opacity: 0, rotation: 180 },
                    { scale: 1, opacity: 1, rotation: 0, duration: 1, ease: "back.out(1.7)" }
                );
                
                // スコアのカウントアップアニメーション
                gsap.fromTo({ value: 0 }, 
                    { value: 0 },
                    { 
                        value: this.score, 
                        duration: 2, 
                        ease: "power2.out",
                        onUpdate: function() {
                            finalScoreElement.textContent = Math.floor(this.targets()[0].value).toString();
                        }
                    }
                );
            }
        }
    }

    private gameLoop(): void {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;

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
            this.renderer.drawGameOver(this.score);
            this.showGameOver();
        }
        
        this.animationId = requestAnimationFrame(() => this.gameLoop());
    }

    public restart(): void {
        // 前のアニメーションループを停止
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

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
        
        // ストーリー再開
        this.startStory();
        
        const gameOverElement = document.getElementById('gameOver');
        if (gameOverElement) {
            gameOverElement.style.display = 'none';
        }

        // ゲームループ再開
        this.gameLoop();
    }

    public destroy(): void {
        // アニメーションループを停止
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// グローバル関数（HTMLから呼び出し用）
let game: AnimalShootingGame;

export function restartGame(): void {
    if (game) {
        game.restart();
    }
}

// ゲーム開始
window.addEventListener('load', () => {
    game = new AnimalShootingGame();
});
