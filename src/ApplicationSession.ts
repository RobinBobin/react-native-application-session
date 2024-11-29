import type { AppStateStatus, NativeEventSubscription } from 'react-native'

import { AppState } from 'react-native'

export class ApplicationSession {
  protected readonly subscriptions: NativeEventSubscription[] = []

  private __canSwitchToActiveFromInit = true
  private __isLoggingEnabled = false
  private isSwitchCompleted = true

  get canSwitchToActiveFromInit(): boolean {
    return this.__canSwitchToActiveFromInit
  }

  set canSwitchToActiveFromInit(canSwitchToActiveFromInit) {
    this.__canSwitchToActiveFromInit = canSwitchToActiveFromInit
  }

  get isLoggingEnabled(): boolean {
    return this.__isLoggingEnabled
  }

  set isLoggingEnabled(isLoggingEnabled) {
    this.__isLoggingEnabled = isLoggingEnabled
  }

  init(): void {
    this.log(`ApplicationSession.init(): ${AppState.currentState}.`)

    this.addSubscriptions()

    if (this.canSwitchToActiveFromInit && AppState.currentState === 'active') {
      void this.onChanged('active')
    }
  }

  uninit(): void {
    this.log('ApplicationSession.uninit().')

    for (const subscription of this.subscriptions) {
      subscription.remove()
    }
  }

  protected addSubscriptions(): void {
    this.subscriptions.push(
      AppState.addEventListener(
        'change',
        nextState => void this.onChanged(nextState)
      )
    )
  }

  protected log(...args: readonly unknown[]): void {
    if (this.isLoggingEnabled) {
      console.log(...args)
    }
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  protected switchToActive(): Promise<void> {
    return Promise.resolve()
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this
  protected switchToBackground(): Promise<void> {
    return Promise.resolve()
  }

  private async onChanged(nextState: AppStateStatus): Promise<void> {
    this.log(`App state: ${nextState}.`)

    if (this.isSwitchCompleted) {
      this.isSwitchCompleted = false

      /* eslint @typescript-eslint/switch-exhaustiveness-check: ['error', { considerDefaultExhaustiveForUnions: true }] */
      switch (nextState) {
        case 'active':
          await this.switchToActive()
          break

        case 'background':
          await this.switchToBackground()
          break

        default:
          // Nothing to do
          break
      }

      this.isSwitchCompleted = true
    }
  }
}
