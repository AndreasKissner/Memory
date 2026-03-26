document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.style.visibility = 'visible';
});

import "./styles/pages/_settings.scss";
import "./styles/components/_button-startsite.scss"
import type { Theme, SettingsData, SelectionState, SavedSettings } from './interfaces-settings';

const selectionState: SelectionState = {
  theme: false,
  player: false,
  size: false,
  themeId: '',
  playerColor: '',
  boardSize: '',
  folder: ''
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
const subNav = document.querySelector<HTMLElement>('.theme-preview__sub-nav');

/**
 * Asynchronously loads settings data from a JSON file and
 * initializes theme, player, and size event listeners.
 * @returns A promise that resolves when initialization is complete.
 */
async function loadSettingsData(): Promise<void> {
  const jsonPath = new URL('../json/data/settings-data.json', import.meta.url).href;
  const response = await fetch(jsonPath);
  const data: SettingsData = await response.json();
  initThemeListeners(data.themes);
  initPlayerListeners();
  initSizeListeners();
}

/**
 * Sets up change event listeners for a collection of theme radio buttons.
 * When a radio button is selected, it extracts the theme ID from the
 * element's dataset and triggers the theme selection handler.
 * @param themes - An array of available theme objects to be processed during selection.
 */
/**
 * Sets up mouseenter, mouseleave, and change event listeners
 * for all theme radio buttons and their parent option elements.
 * @param themes - Array of available theme objects.
 */
function initThemeListeners(themes: Theme[]): void {
  themeRadios.forEach(radio => {
    const option = radio.closest<HTMLElement>('.nav-options__option');
    option?.addEventListener('mouseenter', () => onThemeHover(radio, themes));
    option?.addEventListener('mouseleave', () => onThemeHoverEnd(themes));
    radio.addEventListener('change', () => {
      const themeId = radio.dataset.themeId;
      if (themeId) handleThemeSelection(themeId, themes);
    });
  });
}

/**
 * Updates the preview image on hover if no theme has been selected yet.
 * If a theme is already selected, hover has no effect.
 * @param radio - The hovered radio input element.
 * @param themes - Array of available theme objects.
 */
function onThemeHover(radio: HTMLInputElement, themes: Theme[]): void {
  if (selectionState.theme) return;
  const hoveredTheme = themes.find(t => t.id === radio.dataset.themeId);
  if (hoveredTheme && themeImage) {
    themeImage.src = `../${hoveredTheme.img.replace(/^\//, '')}`;
  }
}

/**
 * Resets the preview image to the default when the cursor leaves a theme option.
 * Only runs if no theme has been selected yet.
 * @param themes - Array of available theme objects.
 */
function onThemeHoverEnd(themes: Theme[]): void {
  if (!themeImage || selectionState.theme) return;
  themeImage.src = `../assets/img/settings/theme-img1.svg`;
}

/**
 * Evaluates the current selection state to determine if all required
 * settings (theme, player, and size) have been chosen.
 * If all criteria are met, it updates the UI components (dividers and start button)
 * and persists the configuration to storage.
 */
function checkAllSelected(): void {
  const allSelected: boolean = selectionState.theme && selectionState.player && selectionState.size;
  updateDividers(allSelected);
  updateStartButton(allSelected);
  if (allSelected) {
    saveCurrentSettings();
  }
}

/**
 * Toggles the 'is-selected' class on theme and player dividers.
 * @param allSelected - True to add the class, false to remove it.
 */
function updateDividers(allSelected: boolean): void {
  const action = allSelected ? 'add' : 'remove';
  themeDividerBig?.classList[action]('is-selected');
  themeDividerSmall?.classList[action]('is-selected');
  playerDividerBig?.classList[action]('is-selected');
  playerDividerSmall?.classList[action]('is-selected');
  subNav?.classList[action]('is-selected');
}

/**
 * Enables or disables the start button based on selection status.
 * @param allSelected - True to enable, false to disable.
 */
function updateStartButton(allSelected: boolean): void {
  if (allSelected) {
    startButton?.removeAttribute('disabled');
    startButton?.addEventListener('click', () => {
      window.location.href = 'game.html';
    });
  } else {
    startButton?.setAttribute('disabled', '');
  }
}

/**
 * Persists the current selection state (theme, color, size) to storage.
 */
function saveCurrentSettings(): void {
  saveSettings({
    themeId: selectionState.themeId,
    playerColor: selectionState.playerColor,
    boardSize: selectionState.boardSize,
    folder: selectionState.folder
  });
}

/**
 * Updates the UI and selection state based on the chosen theme.
 * @param themeId - The unique identifier of the selected theme.
 * @param themes - The list of available theme objects.
 */
function handleThemeSelection(themeId: string, themes: Theme[]): void {
  const selectedTheme = themes.find(theme => theme.id === themeId);
  if (selectedTheme && themeImage && themeNameSpan) {
    themeImage.src = `../${selectedTheme.img.replace(/^\//, '')}`;
    themeNameSpan.textContent = selectedTheme.name;
    selectionState.theme = true;
    selectionState.themeId = themeId;
    selectionState.folder = selectedTheme.folder;
    checkAllSelected();
  }
}

/**
 * Initializes change listeners for player color selection radios.
 */
function initPlayerListeners(): void {
  playerRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      const playerId = radio.dataset.playerId;
      if (playerId && playerNameSpan) {
        playerNameSpan.textContent = playerId;
        selectionState.playerColor = playerId;
      }
      selectionState.player = true;
      checkAllSelected();
    });
  });
}

/**
 * Sets up change event listeners for board size selection radios.
 * Updates the UI display and selection state when a size is chosen.
 */
function initSizeListeners(): void {
  sizeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      const sizeId = radio.dataset.sizeId;
      if (sizeId && sizeNameSpan) {
        sizeNameSpan.textContent = sizeId;
        selectionState.boardSize = sizeId;
      }
      selectionState.size = true;
      checkAllSelected();
    });
  });
}

/**
 * Saves the provided settings object to localStorage as a JSON string.
 * @param settings - The settings object containing theme, player, and board configuration.
 */
function saveSettings(settings: SavedSettings): void {
  localStorage.setItem('gameSettings', JSON.stringify(settings));
}

loadSettingsData();