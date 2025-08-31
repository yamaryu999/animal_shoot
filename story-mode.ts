// ストーリーモード管理クラス
export class StoryMode {
    private currentStage: number = 1;
    private storyMessages: string[][] = [
        [
            "昔々、平和な村に住む勇敢なネコ、ミケ...",
            "しかし、ある日、村に暗い影が忍び寄りました。",
            "謎の組織「ダークアニマルズ」が村を支配しようとしています。",
            "ミケは村の長老から特別な力を授かりました。",
            "「ミケ、あなただけが村を救えるのです...」",
            "まずは、組織の先兵である犬の群れを撃退してください！"
        ],
        [
            "犬の群れを撃退しました！",
            "しかし、これは始まりに過ぎませんでした...",
            "空からは「スカイレイダーズ」と呼ばれる鳥の部隊が襲来！",
            "彼らは村の上空を制圧し、住民を恐怖に陥れています。",
            "ミケは新たな武器を手に入れ、空の敵に立ち向かいます。",
            "「空の支配者たちよ、この村から出ていけ！」"
        ],
        [
            "空の戦いも勝利に終わりました！",
            "しかし、真の脅威は森の奥深くに潜んでいました...",
            "「フォレストトラッパーズ」と呼ばれるウサギの暗殺者たち...",
            "彼らは罠を仕掛け、ミケを待ち伏せしています。",
            "村の長老が警告します：「ミケ、彼らは最も危険です...」",
            "慎重に進み、森の罠を突破してください！"
        ],
        [
            "森の罠も見事に突破しました！",
            "そしてついに、真の黒幕が姿を現します...",
            "「キングピッグ」、ダークアニマルズの首領です！",
            "彼はかつて村の英雄でしたが、闇の力に堕ちてしまいました。",
            "「ミケ、お前の力を見せてみろ！」",
            "これが最後の戦いです。村の運命がかかっています！"
        ],
        [
            "キングピッグを倒しました！",
            "しかし、彼の最後の言葉がミケの心に響きます...",
            "「ミケ...実は、お前の父親が...」",
            "村の長老が真実を語ります：",
            "「ミケ、あなたの父親はダークアニマルズの創設者でした...」",
            "「しかし、彼は最後に正義の道を選び、あなたを守ったのです。」",
            "「今、あなたがその意志を継いでいるのです。」",
            "村は平和を取り戻し、ミケは新たな伝説の英雄となりました。",
            "しかし、世界にはまだ多くの闇が潜んでいます...",
            "「ミケ、あなたの冒険はこれから始まるのです...」"
        ]
    ];
    private currentMessageIndex: number = 0;
    private storyShown: boolean = false;

    getCurrentStage(): number {
        return this.currentStage;
    }

    getCurrentMessages(): string[] {
        return this.storyMessages[this.currentStage - 1] || [];
    }

    nextMessage(): string | null {
        const messages = this.getCurrentMessages();
        if (this.currentMessageIndex < messages.length) {
            return messages[this.currentMessageIndex++];
        }
        return null;
    }

    nextStage(): boolean {
        if (this.currentStage < this.storyMessages.length) {
            this.currentStage++;
            this.currentMessageIndex = 0;
            this.storyShown = false;
            return true;
        }
        return false;
    }

    isStoryComplete(): boolean {
        return this.currentStage > this.storyMessages.length;
    }

    resetStory() {
        this.currentStage = 1;
        this.currentMessageIndex = 0;
        this.storyShown = false;
    }
}
