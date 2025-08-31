// GSAP型定義
export declare const gsap: {
    fromTo: (target: any, fromVars: any, toVars: any) => any;
    to: (target: any, vars: any) => any;
};

// ゲームの基本設定
export interface GameConfig {
    canvasWidth: number;
    canvasHeight: number;
    playerSpeed: number;
    bulletSpeed: number;
    enemySpeed: number;
    enemySpawnRate: number;
    minEnemySpawnRate: number;
}

// ゲームオブジェクトの境界情報
export interface Bounds {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
}

// タッチ位置情報
export interface TouchPosition {
    x: number;
    y: number;
}

// 敵の種類
export type EnemyType = 'dog' | 'bird' | 'rabbit' | 'pig';

// パワーアップの種類
export type PowerUpType = 'wrench' | 'oil_can' | 'hammer' | 'glasses';

// 弾の種類
export type BulletType = 'normal' | 'piercing' | 'flame' | 'wide';

// ステージ情報
export interface StageInfo {
    name: string;
    enemyTypes: EnemyType[];
    targetEnemies: number;
}
