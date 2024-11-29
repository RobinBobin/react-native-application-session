import type { AppStateStatus } from 'react-native'

import { AppState } from 'react-native'

export const isSwitchRequested = (state: AppStateStatus): boolean => {
  return AppState.currentState === state
}
