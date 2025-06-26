class MemoryGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.score = 0;
        this.gameStarted = false;
        this.previewTime = 3; // 3초 동안 미리보기
        
        // 이모지 아이콘들 (8쌍 = 16장)
        this.icons = [
            '🐶', '🐱', '🐭', '🐹', 
            '🐰', '🦊', '🐻', '🐼'
        ];
        
        this.init();
    }
    
    init() {
        this.createBoard();
        this.startPreview();
    }
    
    createBoard() {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.innerHTML = '';
        
        // 카드 배열 생성 (각 아이콘 2개씩)
        const cardValues = [...this.icons, ...this.icons];
        
        // 카드 섞기
        this.shuffleArray(cardValues);
        
        // 카드 생성
        cardValues.forEach((icon, index) => {
            const card = document.createElement('div');
            card.className = 'card flipped preview-mode';
            card.dataset.icon = icon;
            card.dataset.index = index;
            card.textContent = icon;
            card.addEventListener('click', () => this.flipCard(card));
            gameBoard.appendChild(card);
            this.cards.push(card);
        });
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    startPreview() {
        const timerElement = document.getElementById('timer');
        let timeLeft = this.previewTime;
        
        const countdown = setInterval(() => {
            timerElement.textContent = timeLeft;
            timeLeft--;
            
            if (timeLeft < 0) {
                clearInterval(countdown);
                this.hideAllCards();
                this.gameStarted = true;
                timerElement.textContent = '게임 시작!';
                setTimeout(() => {
                    timerElement.textContent = '진행중';
                }, 1000);
            }
        }, 1000);
    }
    
    hideAllCards() {
        this.cards.forEach(card => {
            card.classList.remove('flipped', 'preview-mode');
            card.classList.add('back');
            card.textContent = '';
        });
    }
    
    flipCard(card) {
        if (!this.gameStarted || 
            card.classList.contains('flipped') || 
            card.classList.contains('matched') ||
            this.flippedCards.length >= 2) {
            return;
        }
        
        // 카드 뒤집기
        card.classList.remove('back');
        card.classList.add('flipped', 'flip-animation');
        card.textContent = card.dataset.icon;
        this.flippedCards.push(card);
        
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateMoves();
            setTimeout(() => this.checkMatch(), 500);
        }
    }
    
    checkMatch() {
        const [card1, card2] = this.flippedCards;
        
        if (card1.dataset.icon === card2.dataset.icon) {
            // 매치 성공
            card1.classList.add('matched');
            card2.classList.add('matched');
            this.matchedPairs++;
            this.score += 10;
            this.updateScore();
            
            if (this.matchedPairs === 8) {
                this.gameWin();
            }
        } else {
            // 매치 실패
            setTimeout(() => {
                card1.classList.remove('flipped', 'flip-animation');
                card2.classList.remove('flipped', 'flip-animation');
                card1.classList.add('back');
                card2.classList.add('back');
                card1.textContent = '';
                card2.textContent = '';
            }, 1000);
        }
        
        this.flippedCards = [];
    }
    
    gameWin() {
        const statusElement = document.getElementById('gameStatus');
        statusElement.textContent = `🎉 축하합니다! ${this.moves}번 만에 완성했습니다!`;
        statusElement.className = 'game-status win';
        
        // 보너스 점수 (적은 시도일수록 높은 점수)
        const bonus = Math.max(0, 50 - this.moves);
        this.score += bonus;
        this.updateScore();
    }
    
    updateScore() {
        document.getElementById('score').textContent = this.score;
    }
    
    updateMoves() {
        document.getElementById('moves').textContent = this.moves;
    }
    
    restart() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.score = 0;
        this.gameStarted = false;
        
        this.updateScore();
        this.updateMoves();
        
        const statusElement = document.getElementById('gameStatus');
        statusElement.textContent = '';
        statusElement.className = 'game-status';
        
        this.init();
    }
}

// 게임 인스턴스 생성
let game;

// 페이지 로드 시 게임 시작
document.addEventListener('DOMContentLoaded', () => {
    game = new MemoryGame();
});

// 다시 시작 함수
function restartGame() {
    game.restart();
}
