// Ganz oben, vor allen anderen imports
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.style.visibility = 'visible';
});

import "./styles/pages/_settings.scss";
import "./styles/components/_button-startsite.scss"
import type {Theme, SettingsData, SelectionState } from './interfaces-settings';

const selectionState: SelectionState = {
  theme: false,
  player: false,
  size: false
};

const themeImage = document.querySelector<HTMLImageElement>('.theme-preview__image');
const themeNameSpan = document.querySelector<HTMLSpanElement>('.theme-preview__sub-item span:first-child');
const themeRadios = document.querySelectorAll<HTMLInputElement>('[name="theme-selection"]');
const playerRadios = document.querySelectorAll<HTMLInputElement>('[name="player-selection"]');
const sizeRadios = document.querySelectorAll<HTMLInputElement>('[name="size-selection"]');
const startButton = document.querySelector<HTMLButtonElement>('.settings-btn');

const themeDividerBig = document.querySelector<HTMLImageElement>('.theme-divider-big');
const themeDividerSmall = document.querySelector<HTMLImageElement>('.theme-divider-small');
const playerDividerBig = document.querySelector<HTMLImageElement>('.player-divider-big');
const playerDividerSmall = document.querySelector<HTMLImageElement>('.player-divider-small');

const playerNameSpan = document.querySelector<HTMLSpanElement>('.sub-item__player-name');
const sizeNameSpan = document.querySelector<HTMLSpanElement>('.sub-item__size-name'); 



async function loadSettingsData() {
  const response = await fetch('/json/data/settings-data.json');
  const data: SettingsData = await response.json();
  /* console.log(data); */
  initThemeListeners(data.themes);
    initPlayerListeners();
  initSizeListeners()
}

function initThemeListeners(themes: Theme[]):void{
  themeRadios.forEach(radio =>{
    radio.addEventListener('change', () => {
      const themeId = radio.dataset.themeId;
      if(themeId){
        handleThemeSelection(themeId, themes)
      }
    });
  })
}

loadSettingsData();

function checkAllSelected(): void {
  if (selectionState.theme && selectionState.player && selectionState.size) {
     console.log('alle ausgewählt!');
         console.log('alle ausgewählt!');
    console.log('themeDividerBig:', themeDividerBig);
    console.log('themeDividerSmall:', themeDividerSmall);
    startButton?.removeAttribute('disabled');
    themeDividerBig?.classList.add('is-selected');
    themeDividerSmall?.classList.add('is-selected');
    playerDividerBig?.classList.add('is-selected');
    playerDividerSmall?.classList.add('is-selected');
  } else {
    startButton?.setAttribute('disabled', '');
    themeDividerBig?.classList.remove('is-selected');
    themeDividerSmall?.classList.remove('is-selected');
    playerDividerBig?.classList.remove('is-selected');
    playerDividerSmall?.classList.remove('is-selected');
  }
}

function handleThemeSelection(themeId: string, themes: Theme[]): void {
  const selectedTheme = themes.find(theme => theme.id === themeId);

  if (selectedTheme && themeImage && themeNameSpan) {
    themeImage.src = selectedTheme.img;
    themeNameSpan.textContent = selectedTheme.name;
    selectionState.theme = true;
    checkAllSelected();
  }
}

function initPlayerListeners(): void {
  playerRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      const playerId = radio.dataset.playerId;
      if (playerId && playerNameSpan) {
        playerNameSpan.textContent = playerId;
      }
      selectionState.player = true;
      checkAllSelected();
    });
  });
}

function initSizeListeners(): void {
  sizeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      const sizeId = radio.dataset.sizeId;
      if (sizeId && sizeNameSpan) {
        sizeNameSpan.textContent = sizeId;
      }
      selectionState.size = true;
      checkAllSelected();
    });
  });
}