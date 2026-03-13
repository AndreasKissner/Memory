export function createCardTemplate(cardId: number, folder: string): string {
  return `
    <div class="memory-card" data-card-id="${cardId}">
      <div class="memory-card__inner">
        <div class="memory-card__front">
          <img src="/assets/img/cards/${folder}/Front-${cardId}.svg" alt="" class="memory-card__img">
        </div>
        <div class="memory-card__back">
          <img src="/assets/img/cards/${folder}/bg.svg" alt="" class="memory-card__img">
        </div>
      </div>
    </div>
  `;
}