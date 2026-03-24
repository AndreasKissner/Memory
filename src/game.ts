document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.style.visibility = 'visible';
});

import "./styles/pages/_game.scss";
import type { GameState } from "./interface-game";
import { createCardTemplate } from "./templates/card-template";
import { loadThemeImages } from "./img-theme-loader";

// ─── Settings aus localStorage ──────────────────
const savedSettings = JSON.parse(localStorage.getItem('gameSettings') || '{}');
const themeFolder = savedSettings.folder || 'code-vibe-theme';
const base = import.meta.env.BASE_URL;

document.body.dataset.theme = themeFolder;
loadThemeImages(themeFolder, base);

// ─── State ──────────────────────────────────────
const gameState: GameState = {
  firstCard: null,
  secondCard: null,
  isLocked: false,
  currentPlayer: 'Blue',
  scoreBlue: 0,
  scoreOrange: 0
};

// ─── DOM Elemente ───────────────────────────────

const scoreBlueEl = document.querySelector<HTMLSpanElement>('.player-scores__player--blue .player-scores__points');
const scoreOrangeEl = document.querySelector<HTMLSpanElement>('.player-scores__player--orange .player-scores__points');
const currentPlayerIcon = document.querySelector<HTMLImageElement>('.current-player__icon');
const quitDialog = document.getElementById('quit-dialog') as HTMLDialogElement | null;
const openButton = document.getElementById('open-quit-dialog') as HTMLButtonElement | null;
const gameOverDialog = document.getElementById('game-over-dialog') as HTMLDialogElement | null;
const gameOverScoreBlue = document.querySelector<HTMLSpanElement>('.game-over-dialog__player:first-child .game-over-dialog__points');
const gameOverScoreOrange = document.querySelector<HTMLSpanElement>('.game-over-dialog__player:last-child .game-over-dialog__points');
const winnerDialog = document.getElementById('winner-dialog') as HTMLDialogElement | null;
const winnerName = document.querySelector<HTMLHeadingElement>('.winner-dialog__name');
const winnerIcon = document.querySelector<HTMLImageElement>('.winner-dialog__icon');
const backToStartBtn = document.querySelector<HTMLButtonElement>('.winner-dialog__btn');

// ─── Hilfsfunktionen ────────────────────────────
function getPairsFromBoardSize(boardSize: string): number {
  if (boardSize === '16 Cards') return 8;
  if (boardSize === '24 Cards') return 12;
  if (boardSize === '36 Cards') return 18;
  return 8;
}

function updateGridLayout(boardSize: string): void {
  const cardsGrid = document.querySelector<HTMLElement>('.cards-grid');
  if (!cardsGrid) return;
  if (boardSize === '16 Cards') {
    cardsGrid.style.width = '555px';
    cardsGrid.style.gridTemplateColumns = 'repeat(4, 120px)';
 /*    cardsGrid.style.gap = '15px'; */
  } else if (boardSize === '24 Cards') {
    cardsGrid.style.width = '750px';
    cardsGrid.style.gridTemplateColumns = 'repeat(6, 110px)';
   /*  cardsGrid.style.gap = '15px'; */
  } else if (boardSize === '36 Cards') {
    cardsGrid.style.width = '1060px';
    cardsGrid.style.gridTemplateColumns = 'repeat(9, 110px)';
   /*  cardsGrid.style.gap = '15px'; */
    cardsGrid.style.marginRight = '60px';
  }
}



function generateCards(folder: string): void {
  const cardsGrid = document.querySelector<HTMLElement>('.cards-grid');
  if (!cardsGrid) return;
  const pairs = getPairsFromBoardSize(savedSettings.boardSize);
  let cards: string[] = [];
  for (let i = 1; i <= pairs; i++) {
    cards.push(createCardTemplate(i, folder, base));
     cards.push(createCardTemplate(i, folder, base));
 
  }
  cards.sort(() => Math.random() - 0.5);
  cardsGrid.innerHTML = cards.join('');
}

// ─── Karten Logik ───────────────────────────────
function handleCardClick(card: HTMLDivElement): void {
  if (gameState.isLocked) return;
  if (card === gameState.firstCard) return;
  card.classList.add('is-flipped');
  if (!gameState.firstCard) {
    gameState.firstCard = card;
  } else {
    gameState.secondCard = card;
    checkForMatch();
  }
}

function checkForMatch(): void {
  const isMatch = gameState.firstCard?.dataset.cardId === gameState.secondCard?.dataset.cardId;
  isMatch ? disableCards() : unflipCards();
}

function disableCards(): void {
  gameState.firstCard?.classList.add('is-matched');
  gameState.secondCard?.classList.add('is-matched');
  gameState.firstCard?.removeEventListener('click', onCardClick);
  gameState.secondCard?.removeEventListener('click', onCardClick);
  updateScore();
  resetBoard();
  checkGameOver();
}

function unflipCards(): void {
  gameState.isLocked = true;
  setTimeout(() => {
    gameState.firstCard?.classList.remove('is-flipped');
    gameState.secondCard?.classList.remove('is-flipped');
    switchPlayer();
    resetBoard();
  }, 1000);
}

function resetBoard(): void {
  gameState.firstCard = null;
  gameState.secondCard = null;
  gameState.isLocked = false;
}

// ─── Score & Player ─────────────────────────────
function updateScore(): void {
  if (gameState.currentPlayer === 'Blue') {
    gameState.scoreBlue++;
    if (scoreBlueEl) scoreBlueEl.textContent = String(gameState.scoreBlue);
  } else {
    gameState.scoreOrange++;
    if (scoreOrangeEl) scoreOrangeEl.textContent = String(gameState.scoreOrange);
  }
}

function switchPlayer(): void {
  gameState.currentPlayer = gameState.currentPlayer === 'Blue' ? 'Orange' : 'Blue';
  updateCurrentPlayerIcon();
}

function updateCurrentPlayerIcon(): void {
  if (!currentPlayerIcon) return;
currentPlayerIcon.src = gameState.currentPlayer === 'Blue'
  ? `${base}assets/img/themes/${themeFolder}/current-player-blue.svg`
  : `${base}assets/img/themes/${themeFolder}/current-player-orange.svg`;
}

// ─── Game Over ──────────────────────────────────
function checkGameOver(): void {
  const allCards = document.querySelectorAll<HTMLDivElement>('.memory-card');
  const allMatched = allCards.length === document.querySelectorAll<HTMLDivElement>('.memory-card.is-flipped').length;
  if (allMatched) showGameOver();
}

function showGameOver(): void {
  if (!gameOverDialog || !gameOverScoreBlue || !gameOverScoreOrange) return;
  gameOverScoreBlue.textContent = String(gameState.scoreBlue);
  gameOverScoreOrange.textContent = String(gameState.scoreOrange);
  setTimeout(() => {
    gameOverDialog.showModal();
    showWinner();
  }, 2000);
}

// ─── Winner ─────────────────────────────────────
function getWinnerState() {
  return {
    isTie: gameState.scoreBlue === gameState.scoreOrange,
    blueWins: gameState.scoreBlue > gameState.scoreOrange
  };
}

function updateWinnerUI(isTie: boolean, blueWins: boolean): void {
  if (!winnerName || !winnerIcon) return;
  winnerName.classList.remove('winner-dialog__name--blue', 'winner-dialog__name--orange');
  if (isTie) {
    winnerName.textContent = "It's a Tie!";
  winnerIcon.src = `${base}assets/img/themes/${themeFolder}/chess-blue.svg`;
  } else {
    winnerName.textContent = blueWins ? 'Blue Player' : 'Orange Player';
    winnerName.classList.add(blueWins ? 'winner-dialog__name--blue' : 'winner-dialog__name--orange');
   winnerIcon.src = `${base}assets/img/themes/${themeFolder}/chess-${blueWins ? 'blue' : 'orange'}.svg`;
  }
}

function showWinner(): void {
  if (!winnerDialog || !winnerName || !winnerIcon || !backToStartBtn) return;
  const { isTie, blueWins } = getWinnerState();
  updateWinnerUI(isTie, blueWins);
  const confetti = document.querySelector<HTMLImageElement>('.winner-dialog__confetti');
  const confettiFile = themeFolder === 'gaming-theme' ? 'confetti-game.png' : 'confetti.svg';
  if (confetti) confetti.src = `${base}assets/img/themes/${themeFolder}/${confettiFile}`;
  backToStartBtn.textContent = themeFolder === 'gaming-theme' ? 'Home' : 'Back to start';
  setTimeout(() => winnerDialog.showModal(), 2000);
}

// ─── Event Listeners ────────────────────────────
function onCardClick(this: HTMLDivElement): void {
  handleCardClick(this);
}

generateCards(themeFolder);
updateGridLayout(savedSettings.boardSize);

const cards = document.querySelectorAll<HTMLDivElement>(".memory-card");
cards.forEach(card => card.addEventListener('click', onCardClick));
openButton?.addEventListener('click', () => quitDialog?.showModal());
quitDialog?.addEventListener('close', () => {
  if (quitDialog.returnValue === 'confirm') {
  window.location.href = `${base}pages_html/settings.html`;
  }
});

backToStartBtn?.addEventListener('click', () => {
 window.location.href = `${base}pages_html/settings.html`;
});

// TEMP: game over dialog sofort anzeigen
 /* gameOverDialog?.showModal();  */ 
/* winnerDialog?.showModal();  */