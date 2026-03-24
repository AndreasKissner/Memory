export function createCardTemplate(cardId: number, folder: string, base: string): string {
  return `
    <div class="memory-card" data-card-id="${cardId}">
      <div class="memory-card__inner">
        <div class="memory-card__front">
          <img src="${base}assets/img/cards/${folder}/Front-${cardId}.svg" alt="" class="memory-card__img">
        </div>
        <div class="memory-card__back">
          <img src="${base}assets/img/cards/${folder}/bg.svg" alt="" class="memory-card__img">
        </div>
      </div>
    </div>
  `;
}