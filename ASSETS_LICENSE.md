# 素材使用とライセンス情報

## 📚 参考素材サイト

このプロジェクトでは、以下の無料素材サイトを参考にしてキャラクターデザインを改善しました：

### 🥇 Kenney.nl
- **URL**: https://kenney.nl/
- **ライセンス**: CC0 (Creative Commons Zero)
- **商用利用**: ✅ 可能
- **クレジット**: 不要（任意）
- **参考にした要素**: カラーパレット、デザインスタイル、アニメーション効果

### 🥈 OpenGameArt.org
- **URL**: https://opengameart.org/
- **ライセンス**: CC0, CC-BY, CC-BY-SA（素材により異なる）
- **商用利用**: ✅ 可能（ライセンスによる）
- **クレジット**: ライセンスによる
- **参考にした要素**: キャラクターデザイン、アニメーション手法

### 🥉 Itch.io (無料素材)
- **URL**: https://itch.io/game-assets/free
- **ライセンス**: 作者により異なる
- **商用利用**: ライセンスによる
- **クレジット**: ライセンスによる
- **参考にした要素**: ピクセルアート、ベクターアート

## 🎨 実装した改善点

### カラーパレットの改善
Kenney.nlの素材を参考に、以下のカラーパレットを採用：

```typescript
const kenneyColors = {
    primary: '#4A90E2',      // メインの青
    secondary: '#7ED321',    // アクセントの緑
    accent: '#F5A623',       // オレンジ
    background: '#FFFFFF',   // 白い背景
    outline: '#2C3E50',      // ダークアウトライン
    highlight: '#50E3C2'     // ハイライトの青緑
};
```

### デザインスタイルの改善
- **シンプルで親しみやすいデザイン**
- **統一されたカラーパレット**
- **滑らかなアニメーション効果**
- **適切なコントラスト**

### アニメーション効果の改善
- **呼吸エフェクト**
- **移動時の動き線**
- **ジャンプ時のスパークル効果**
- **攻撃時の感嘆符エフェクト**

## 📁 ファイル構成

```
assets/
├── characters/          # キャラクター素材用フォルダ
├── enemies/            # 敵キャラクター素材用フォルダ
└── ui/                 # UI素材用フォルダ
```

## ⚖️ ライセンス遵守

### 重要な注意事項
1. **このプロジェクトはオリジナルのCanvas描画を使用**
2. **外部素材の直接使用は行っていない**
3. **参考サイトのデザインスタイルを参考にしたオリジナル実装**
4. **すべてのコードはオリジナルで作成**

### クレジット（任意）
参考にした素材サイトへの感謝の意を込めて：

```
参考素材サイト:
- Kenney.nl (https://kenney.nl/) - CC0
- OpenGameArt.org (https://opengameart.org/) - Various CC licenses
- Itch.io (https://itch.io/game-assets/free) - Various licenses
```

## 🔗 参考リンク

### 無料素材サイト
- [Kenney.nl](https://kenney.nl/) - 高品質なゲームアセット
- [OpenGameArt.org](https://opengameart.org/) - 豊富なゲーム素材
- [Itch.io Free Assets](https://itch.io/game-assets/free) - インディーゲーム素材
- [Game-icons.net](https://game-icons.net/) - アイコンとシンプルキャラクター
- [Craftpix.net Freebies](https://craftpix.net/freebies/) - 2Dゲーム素材

### ライセンス情報
- [Creative Commons](https://creativecommons.org/) - ライセンス情報
- [CC0 License](https://creativecommons.org/publicdomain/zero/1.0/) - パブリックドメイン

## 📝 今後の改善予定

1. **スプライトシート方式の実装**
2. **外部素材の直接使用（ライセンス遵守）**
3. **より豊富なアニメーション**
4. **サウンドエフェクトの追加**

---

**注意**: このプロジェクトは教育目的で作成されており、すべての素材使用は適切なライセンスに従って行われています。
