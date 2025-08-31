// 敵の種類の定義
const EnemyType = {
    DOG: 'dog',
    BIRD: 'bird',
    RABBIT: 'rabbit',
    PIG: 'pig'
};

// バウンディングボックスの型定義
class Bounds {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
}

// グローバルに公開
if (typeof window !== 'undefined') {
    window.EnemyType = EnemyType;
    window.Bounds = Bounds;
}
