export type GeolocationErrorCode = 'unsupported' | 'permission-denied' | 'position-unavailable' | 'timeout'

/** Thrown by `GeolocationProvider` implementations. `code` lets callers branch on the reason without string-matching messages. */
export class GeolocationError extends Error {
  readonly code: GeolocationErrorCode
  readonly cause?: unknown

  constructor(code: GeolocationErrorCode, message: string, cause?: unknown) {
    super(message)
    this.name = 'GeolocationError'
    this.code = code
    this.cause = cause
  }
}
