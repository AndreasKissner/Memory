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


/**
 * Grid configuration for each board size.
 * Contains width, column count and optional right margin.
 */
function getPairsFromBoardSize(boardSize: string): number {
  if (boardSize === '16 Cards') return 8;
  if (boardSize === '24 Cards') return 12;
  if (boardSize === '36 Cards') return 18;
  return 8;
}

/**
 * Sets the CSS grid layout based on the selected board size.
 * @param boardSize - Board size from saved settings
 */
function updateGridLayout(boardSize: string): void {
  const cardsGrid = document.querySelector<HTMLElement>('.cards-grid');
  if (!cardsGrid) return;
  if (boardSize === '16 Cards') {
    cardsGrid.style.width = '555px';
    cardsGrid.style.gridTemplateColumns = 'repeat(4, 120px)';
  } else if (boardSize === '24 Cards') {
    cardsGrid.style.width = '750px';
    cardsGrid.style.gridTemplateColumns = 'repeat(6, 110px)';
  } else if (boardSize === '36 Cards') {
    cardsGrid.style.width = '1060px';
    cardsGrid.style.gridTemplateColumns = 'repeat(9, 110px)';
    cardsGrid.style.marginRight = '60px';
  }
}

/**
 * Generates and renders shuffled card pairs into the grid.
 * @param folder - Theme folder name used to load card images
 */
function generateCards(folder: string): void {
  const cardsGrid = document.querySelector<HTMLElement>('.cards-grid');
  if (!cardsGrid) return;
  const pairs: number = getPairsFromBoardSize(savedSettings.boardSize);
  const cards: string[] = [];
  for (let i = 1; i <= pairs; i++) {
    cards.push(createCardTemplate(i, folder, base));
    cards.push(createCardTemplate(i, folder, base));
  }
  cards.sort(() => Math.random() - 0.5);
  cardsGrid.innerHTML = cards.join('');
}

/**
 * Handles a card click: flips the card and checks for a match
 * if a second card has been selected.
 * @param card - The clicked card element
 */
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

/**
 * Checks whether the two selected cards are a matching pair.
 */
function checkForMatch(): void {
  const isMatch: boolean = gameState.firstCard?.dataset.cardId === gameState.secondCard?.dataset.cardId;
  isMatch ? disableCards() : unflipCards();
}

/**
 * Marks matched cards as disabled and removes their click listeners.
 * Then updates the score and checks if the game is over.
 */
function disableCards(): void {
  gameState.firstCard?.classList.add('is-matched');
  gameState.secondCard?.classList.add('is-matched');
  gameState.firstCard?.removeEventListener('click', onCardClick);
  gameState.secondCard?.removeEventListener('click', onCardClick);
  updateScore();
  resetBoard();
  checkGameOver();
}

/**
 * Flips both cards back over after a short delay and switches the active player.
 */
function unflipCards(): void {
  gameState.isLocked = true;
  setTimeout(() => {
    gameState.firstCard?.classList.remove('is-flipped');
    gameState.secondCard?.classList.remove('is-flipped');
    switchPlayer();
    resetBoard();
  }, 1000);
}

/**
 * Resets the board state after each turn.
 */
function resetBoard(): void {
  gameState.firstCard = null;
  gameState.secondCard = null;
  gameState.isLocked = false;
}

/**
 * Increments the current player's score and updates the DOM.
 */
function updateScore(): void {
  if (gameState.currentPlayer === 'Blue') {
    gameState.scoreBlue++;
    if (scoreBlueEl) scoreBlueEl.textContent = String(gameState.scoreBlue);
  } else {
    gameState.scoreOrange++;
    if (scoreOrangeEl) scoreOrangeEl.textContent = String(gameState.scoreOrange);
  }
}

/**
 * Switches the active player and updates the player icon.
 */
function switchPlayer(): void {
  gameState.currentPlayer = gameState.currentPlayer === 'Blue' ? 'Orange' : 'Blue';
  updateCurrentPlayerIcon();
}

/**
 * Updates the current player icon in the DOM based on the active player.
 */
function updateCurrentPlayerIcon(): void {
  if (!currentPlayerIcon) return;
  currentPlayerIcon.src = gameState.currentPlayer === 'Blue'
    ? `${base}assets/img/themes/${themeFolder}/current-player-blue.svg`
    : `${base}assets/img/themes/${themeFolder}/current-player-orange.svg`;
}

/**
 * Checks if all cards have been matched and triggers the game over screen.
 */
function checkGameOver(): void {
  const allCards = document.querySelectorAll<HTMLDivElement>('.memory-card');
  const allMatched: boolean = allCards.length === document.querySelectorAll<HTMLDivElement>('.memory-card.is-matched').length;
  if (allMatched) showGameOver();
}

/**
 * Displays the game over dialog with the final scores.
 */
function showGameOver(): void {
  if (!gameOverDialog || !gameOverScoreBlue || !gameOverScoreOrange) return;
  gameOverScoreBlue.textContent = String(gameState.scoreBlue);
  gameOverScoreOrange.textContent = String(gameState.scoreOrange);
  setTimeout(() => {
    gameOverDialog.showModal();
    showWinner();
  }, 2000);
}

/**
 * Determines the winner based on the final scores.
 * @returns Object indicating whether the game is a tie or which player won
 */
function getWinnerState(): { isTie: boolean; blueWins: boolean } {
  return {
    isTie: gameState.scoreBlue === gameState.scoreOrange,
    blueWins: gameState.scoreBlue > gameState.scoreOrange
  };
}

/**
 * Updates the winner dialog UI with the correct name, color and icon.
 * @param isTie - Whether the game ended in a tie
 * @param blueWins - Whether the blue player won
 */
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

/**
 * Displays the winner dialog with confetti and the correct button label.
 */
function showWinner(): void {
  if (!winnerDialog || !winnerName || !winnerIcon || !backToStartBtn) return;
  const { isTie, blueWins } = getWinnerState();
  updateWinnerUI(isTie, blueWins);
  const confetti = document.querySelector<HTMLImageElement>('.winner-dialog__confetti');
  const confettiFile: string = themeFolder === 'gaming-theme' ? 'confetti-game.png' : 'confetti.svg';
  if (confetti) confetti.src = `${base}assets/img/themes/${themeFolder}/${confettiFile}`;
  backToStartBtn.textContent = themeFolder === 'gaming-theme' ? 'Home' : 'Back to start';
  setTimeout(() => winnerDialog.showModal(), 2000);
}

/**
 * Click handler wrapper to pass the card element as context to handleCardClick.
 */
function onCardClick(this: HTMLDivElement): void {
  handleCardClick(this);
}

generateCards(themeFolder);
updateGridLayout(savedSettings.boardSize);

const cards = document.querySelectorAll<HTMLDivElement>('.memory-card');
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