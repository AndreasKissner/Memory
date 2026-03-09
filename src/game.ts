document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.style.visibility = 'visible';
});

import "./styles/pages/_game.scss";
import type { GameState } from "./interface-game";

const gameState: GameState = {
  firstCard: null,
  secondCard: null,
  isLocked: false
};

const cards = document.querySelectorAll<HTMLDivElement>(".memory-card");

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
  console.log('first:', gameState.firstCard?.dataset.cardId);
  console.log('second:', gameState.secondCard?.dataset.cardId);
  const isMatch = gameState.firstCard?.dataset.cardId === gameState.secondCard?.dataset.cardId;
  console.log('isMatch:', isMatch);
  isMatch ? disableCards() : unflipCards();
}
function disableCards(): void {
  gameState.firstCard?.removeEventListener('click', onCardClick);
  gameState.secondCard?.removeEventListener('click', onCardClick);
  resetBoard();
}

function unflipCards(): void {
  gameState.isLocked = true;
  console.log('unflip called');
  setTimeout(() => {
    console.log('timeout fired');
    gameState.firstCard?.classList.remove('is-flipped');
    gameState.secondCard?.classList.remove('is-flipped');
    resetBoard();
  }, 1000);
}

function resetBoard(): void {
  gameState.firstCard = null;
  gameState.secondCard = null;
  gameState.isLocked = false;
}

function onCardClick(this: HTMLDivElement): void {
  handleCardClick(this);
}

cards.forEach(card => {
  card.addEventListener('click', onCardClick);
});