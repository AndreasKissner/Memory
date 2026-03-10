export interface GameState {
  firstCard: HTMLDivElement | null;
  secondCard: HTMLDivElement | null;
  isLocked: boolean;
  currentPlayer: 'Blue' | 'Orange';
  scoreBlue: number;
  scoreOrange: number;
}