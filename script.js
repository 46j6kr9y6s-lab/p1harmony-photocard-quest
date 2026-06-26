// Game Configuration
const LEVELS = 1000;
const MAX_BOXES_PER_LEVEL = 5;
const CARDS_TO_COLLECT = 3;

const TIERS = {
    'Baby P1ece': { min: 1, max: 200 },
    'New P1ece': { min: 201, max: 400 },
    'P1ece': { min: 401, max: 600 },
    'Legendary P1ece': { min: 601, max: 800 },
    'OG P1ece': { min: 801, max: 1000 }
};

const RARITIES = {
    'Common': { chance: 50, color: 'common', emoji: '⚪' },
    'Rare': { chance: 30, color: 'rare', emoji: '🔵' },
    'Epic': { chance: 15, color: 'epic', emoji: '🟣' },
    'Mythic': { chance: 3, color: 'mythic', emoji: '🔴' },
    'Legendary': { chance: 1.5, color: 'legendary', emoji: '🟡' },
    'Ultra Legendary': { chance: 0.5, color: 'ultra-legendary', emoji: '💎' }
};

// Game State
let gameState = {
    currentLevel: 1,
    collectedCards: [],
    cardsInCurrentLevel: [],
    boxesOpened: 0
};

// Initialize Game
function initGame() {
    loadGameState();
    renderLevel();
}

function getTierName(level) {
    for (const [tierName, range] of Object.entries(TIERS)) {
        if (level >= range.min && level <= range.max) {
            return tierName;
        }
    }
    return 'OG P1ece';
}

function getRandomRarity() {
    const rand = Math.random() * 100;
    let cumulative = 0;

    for (const [rarity, data] of Object.entries(RARITIES)) {
        cumulative += data.chance;
        if (rand <= cumulative) {
            return rarity;
        }
    }
    return 'Common';
}

function generatePhotocard() {
    const rarity = getRandomRarity();
    const cardId = Math.random().toString(36).substr(2, 9);
    return {
        id: cardId,
        rarity: rarity,
        emoji: RARITIES[rarity].emoji,
        timestamp: Date.now()
    };
}

function renderLevel() {
    updateProgressBar();
    updateTierBadge();
    renderBoxes();
    updateCollectionDisplay();
}

function updateProgressBar() {
    const progress = ((gameState.currentLevel - 1) / LEVELS) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('currentLevel').textContent = gameState.currentLevel;
    document.getElementById('levelNum').textContent = gameState.currentLevel;
}

function updateTierBadge() {
    const tier = getTierName(gameState.currentLevel);
    document.getElementById('tierBadge').textContent = tier;
}

function renderBoxes() {
    const container = document.getElementById('boxesContainer');
    container.innerHTML = '';
    gameState.cardsInCurrentLevel = [];
    gameState.boxesOpened = 0;

    const numBoxes = Math.min(MAX_BOXES_PER_LEVEL, LEVELS - gameState.currentLevel + 1);

    for (let i = 0; i < numBoxes; i++) {
        const box = document.createElement('div');
        box.className = 'box';
        box.textContent = '📦';
        box.addEventListener('click', () => openBox(box, i));
        container.appendChild(box);
    }

    updateNextLevelButton();
}

function openBox(boxElement, boxIndex) {
    if (boxElement.classList.contains('opened')) return;

    boxElement.classList.add('opened');
    gameState.boxesOpened++;

    const card = generatePhotocard();
    gameState.cardsInCurrentLevel.push(card);
    gameState.collectedCards.push(card);

    showCardModal(card);
    updateCollectionDisplay();
    updateNextLevelButton();
}

function showCardModal(card) {
    const modal = document.getElementById('cardModal');
    const cardDisplay = document.getElementById('cardDisplay');
    const cardRarity = document.getElementById('cardRarity');

    cardDisplay.className = 'card ' + RARITIES[card.rarity].color;
    cardDisplay.textContent = card.emoji;
    cardRarity.className = 'card-rarity ' + RARITIES[card.rarity].color;
    cardRarity.textContent = card.rarity + '!';

    modal.classList.add('show');
}

function updateCollectionDisplay() {
    const cardsList = document.getElementById('cardsList');
    const collectedCount = gameState.cardsInCurrentLevel.length;
    const targetCards = CARDS_TO_COLLECT;

    document.getElementById('collectedCount').textContent = collectedCount;
    document.getElementById('targetCards2').textContent = targetCards;

    if (gameState.collectedCards.length === 0) {
        cardsList.innerHTML = '<p class="empty-message">No photocards yet. Open boxes to collect!</p>';
        return;
    }

    const recentCards = gameState.collectedCards.slice(-20);
    cardsList.innerHTML = recentCards.reverse().map(card => `
        <div class="card-item ${RARITIES[card.rarity].color}">
            <span>${card.emoji}</span>
            <span>${card.rarity}</span>
            <span class="rarity-badge ${RARITIES[card.rarity].color}">${card.rarity}</span>
        </div>
    `).join('');
}

function updateNextLevelButton() {
    const btn = document.getElementById('nextLevelBtn');
    const cardsCollected = gameState.cardsInCurrentLevel.length;

    if (cardsCollected >= CARDS_TO_COLLECT) {
        btn.disabled = false;
    } else {
        btn.disabled = true;
    }
}

function nextLevel() {
    if (gameState.currentLevel < LEVELS) {
        gameState.currentLevel++;
        gameState.cardsInCurrentLevel = [];
        saveGameState();
        renderLevel();
        closeModal();
    } else {
        alert('🎉 Congratulations! You\'ve reached level 1000 and become an OG P1ece! 🎊');
    }
}

function closeModal() {
    document.getElementById('cardModal').classList.remove('show');
}

function saveGameState() {
    localStorage.setItem('p1Harmony_gameState', JSON.stringify(gameState));
}

function loadGameState() {
    const saved = localStorage.getItem('p1Harmony_gameState');
    if (saved) {
        gameState = JSON.parse(saved);
    }
}

// Event Listeners
document.getElementById('nextLevelBtn').addEventListener('click', nextLevel);
document.getElementById('closeModal').addEventListener('click', closeModal);

window.addEventListener('click', (event) => {
    const modal = document.getElementById('cardModal');
    if (event.target === modal) {
        closeModal();
    }
});

// Start Game
initGame();