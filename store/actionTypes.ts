export const LOGIN_USER_STARTED  = 'LOGIN_USER_STARTED';
export const LOGIN_USER_FAILED  = 'LOGIN_USER_FAILED';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';

interface LoginStart {
    type: typeof LOGIN_USER_STARTED
    payload?: any;
}

interface LoginFail {
    type: typeof LOGIN_USER_FAILED
    payload?: any;
}

interface LoginSuccess {
    type: typeof LOGIN_USER_SUCCESS
    payload?: any;
}

export const RESTORE_SESSION = 'RESTORE_SESSION';

interface RestoreSessionAction {
    type: typeof RESTORE_SESSION,
    payload?: object
}

export type LoginTypes = LoginStart | LoginFail | LoginSuccess | RestoreSessionAction;

    export interface StartedType {
        type: string;
    }

    export interface FailedType {
        type: string;
    }

    export interface SuccessType {
        type: string;
        payload: any;
    }

    export type ActionTypes = StartedType | FailedType | SuccessType;

    export type AppStateActionTypes = ActionTypes | LoginTypes;