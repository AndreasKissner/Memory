document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.style.visibility = 'visible';
});

import "./styles/pages/_game.scss";
import type { GameState } from "./interface-game";
import { createCardTemplate } from "./templates/card-template";

// ─── Settings aus localStorage ──────────────────
const savedSettings = JSON.parse(localStorage.getItem('gameSettings') || '{}');
const themeFolder = savedSettings.folder || 'code-vibes';

console.log('themeFolder:', themeFolder);
console.log('savedSettings:', savedSettings);

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

// ─── Karten generieren ──────────────────────────
function generateCards(folder: string): void {
  const cardsGrid = document.querySelector<HTMLElement>('.cards-grid');
  if (!cardsGrid) return;
    console.log('cardsGrid gefunden:', cardsGrid);
  console.log('folder:', folder);
  const pairs = 8;
  let html = '';
  for (let i = 1; i <= pairs; i++) {
    html += createCardTemplate(i, folder);
    html += createCardTemplate(i, folder);
  }
  console.log('html:', html);
  cardsGrid.innerHTML = html;
}

generateCards(themeFolder);

const cards = document.querySelectorAll<HTMLDivElement>(".memory-card");

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
    ? '/assets/img/themes/code-vibe-theme/blue-right-flash-code.svg'
    : '/assets/img/themes/code-vibe-theme/orange-right-flash-code.svg';
}

// ─── Game Over ──────────────────────────────────
function checkGameOver(): void {
  const allMatched = cards.length === document.querySelectorAll<HTMLDivElement>('.memory-card.is-flipped').length;
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
function showWinner(): void {
  if (!winnerDialog || !winnerName || !winnerIcon) return;
  const blueWins = gameState.scoreBlue > gameState.scoreOrange;
  winnerName.textContent = blueWins ? 'Blue Player' : 'Orange Player';
  winnerName.classList.remove('winner-dialog__name--blue', 'winner-dialog__name--orange');
  winnerName.classList.add(blueWins ? 'winner-dialog__name--blue' : 'winner-dialog__name--orange');
  winnerIcon.src = blueWins
    ? '/assets/img/themes/code-vibe-theme/chess-blue.svg'
    : '/assets/img/themes/code-vibe-theme/chess-orange.svg';
  setTimeout(() => {
    winnerDialog.showModal();
  }, 2000);
}

// ─── Event Listeners ────────────────────────────
function onCardClick(this: HTMLDivElement): void {
  handleCardClick(this);
}

cards.forEach(card => card.addEventListener('click', onCardClick));
openButton?.addEventListener('click', () => quitDialog?.showModal());
quitDialog?.addEventListener('close', () => {
  if (quitDialog.returnValue === 'confirm') {
    window.location.href = '/pages_html/settings.html';
  }
});
backToStartBtn?.addEventListener('click', () => {
  window.location.href = '/pages_html/settings.html';
});