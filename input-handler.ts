import { TouchPosition } from './types';

// 入力ハンドラークラス
export class InputHandler {
    private keys: { [key: string]: boolean } = {};
    private isMobile: boolean = false;
    private touchPosition: TouchPosition | null = null;
    private lastTouchTime: number = 0;
    private touchThreshold: number = 200;
    private autoShoot: boolean = false;
    private shootButtonPressed: boolean = false;
    private canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.detectMobile();
        this.setupEventListeners();
        this.setupTouchControls();
    }

    private detectMobile(): void {
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                       ('ontouchstart' in window) ||
                       (window.innerWidth <= 768);
    }

    private setupEventListeners(): void {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }

    private setupTouchControls(): void {
        if (!this.isMobile) return;

        let touchStartTime = 0;
        let touchStartPos = { x: 0, y: 0 };

        // タッチ開始
        this.canvas.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            
            touchStartTime = performance.now();
            touchStartPos = {
                x: (touch.clientX - rect.left) * scaleX,
                y: (touch.clientY - rect.top) * scaleY
            };

            this.touchPosition = touchStartPos;
            this.createTouchFeedback(touch.clientX, touch.clientY);
        }, { passive: false });

        // タッチ移動
        this.canvas.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            
            this.touchPosition = {
                x: (touch.clientX - rect.left) * scaleX,
                y: (touch.clientY - rect.top) * scaleY
            };
        }, { passive: false });

        // タッチ終了
        this.canvas.addEventListener('touchend', (e) => {
            const touchEndTime = performance.now();
            const touchDuration = touchEndTime - touchStartTime;

            // 短いタッチ（タップ）の場合は攻撃
            if (touchDuration < this.touchThreshold) {
                this.shootButtonPressed = true;
                setTimeout(() => {
                    this.shootButtonPressed = false;
                }, 100);
            }

            this.touchPosition = null;
        }, { passive: false });

        // タッチキャンセル
        this.canvas.addEventListener('touchcancel', (e) => {
            this.touchPosition = null;
        }, { passive: false });

        // 攻撃ボタンのイベントリスナー
        const shootBtn = document.getElementById('shootBtn');
        if (shootBtn) {
            const shootBtnHandler = (e: Event) => {
                e.preventDefault();
                this.shootButtonPressed = true;
                shootBtn.classList.add('pressed');
            };

            const shootBtnEndHandler = (e: Event) => {
                e.preventDefault();
                this.shootButtonPressed = false;
                shootBtn.classList.remove('pressed');
            };

            shootBtn.addEventListener('touchstart', shootBtnHandler, { passive: false });
            shootBtn.addEventListener('touchend', shootBtnEndHandler, { passive: false });
            shootBtn.addEventListener('touchcancel', shootBtnEndHandler, { passive: false });
            shootBtn.addEventListener('mousedown', shootBtnHandler);
            shootBtn.addEventListener('mouseup', shootBtnEndHandler);
            shootBtn.addEventListener('mouseleave', shootBtnEndHandler);
        }

        // 自動攻撃ボタンのイベントリスナー
        const autoShootBtn = document.getElementById('autoShootBtn');
        if (autoShootBtn) {
            const autoShootHandler = (e: Event) => {
                e.preventDefault();
                this.autoShoot = !this.autoShoot;
                autoShootBtn.classList.toggle('active');
                autoShootBtn.textContent = this.autoShoot ? '🔴' : '⚪';
            };

            autoShootBtn.addEventListener('touchstart', autoShootHandler, { passive: false });
            autoShootBtn.addEventListener('mousedown', autoShootHandler);
        }
    }

    private createTouchFeedback(clientX: number, clientY: number): void {
        const feedback = document.createElement('div');
        feedback.className = 'touch-feedback';
        feedback.style.left = (clientX - 20) + 'px';
        feedback.style.top = (clientY - 20) + 'px';
        
        document.body.appendChild(feedback);
        
        // GSAPアニメーション
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(feedback, 
                { scale: 0, opacity: 1 },
                { scale: 1, opacity: 0, duration: 0.3, ease: "power2.out" }
            );
        }
        
        // アニメーション終了後に確実に削除
        const removeFeedback = () => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        };
        
        setTimeout(removeFeedback, 300);
        
        // 念のため、少し長めのタイムアウトでも削除
        setTimeout(removeFeedback, 1000);
    }

    // キーボード入力の取得
    isKeyPressed(key: string): boolean {
        return this.keys[key] || false;
    }

    // タッチ位置の取得
    getTouchPosition(): TouchPosition | null {
        return this.touchPosition;
    }

    // 攻撃ボタンの状態
    isShootPressed(): boolean {
        return this.shootButtonPressed;
    }

    // 自動攻撃の状態
    isAutoShootEnabled(): boolean {
        return this.autoShoot;
    }

    // モバイル判定
    isMobileDevice(): boolean {
        return this.isMobile;
    }

    // ストーリースキップ用のタッチイベント
    setupStorySkipHandler(onSkip: () => void): void {
        if (this.isMobile) {
            this.canvas.addEventListener('touchstart', (e) => {
                e.preventDefault();
                onSkip();
            });
        }
    }
}
