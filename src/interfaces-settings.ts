export interface Theme {
  id: string;
  name: string;
  img: string;
}

export interface SettingsData {
  themes: Theme[];
}

export interface SelectionState {
  theme: boolean;
  player: boolean;
  size: boolean;
  themeId: string;
  playerColor: string;
  boardSize: string;
}
export interface SavedSettings {
  themeId: string;
  playerColor: string;
  boardSize: string;
}