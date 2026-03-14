
export function loadThemeImages(themeFolder: string): void {
  console.log('loadThemeImages aufgerufen mit:', themeFolder);
  const iconBlue = document.getElementById('player-score-icon-blue') as HTMLImageElement | null;
  const iconOrange = document.getElementById('player-score-icon-orange') as HTMLImageElement | null;

  const currentPlayerIcon = document.getElementById('current-player-icon') as HTMLImageElement | null;


  if (iconBlue) {
    iconBlue.src = `/assets/img/themes/${themeFolder}/player-icon-blue.svg`;
  }
  if (iconOrange) iconOrange.src = `/assets/img/themes/${themeFolder}/player-icon-orange.svg`;

 if (currentPlayerIcon) currentPlayerIcon.src = `/assets/img/themes/${themeFolder}/current-player-blue.svg`;


}