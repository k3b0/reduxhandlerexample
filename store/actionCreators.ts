import * as actionNames from './actionTypes';
import { LoginTypes } from './actionTypes';

// Login 

export const loginStarted = (): LoginTypes => {
    return {
        type: actionNames.LOGIN_USER_STARTED
    }
}

export const loginFailed = (): LoginTypes => {
    return {
        type: actionNames.LOGIN_USER_FAILED
    }
}

export const loginSuccess = (): LoginTypes => {
    return {
        type: actionNames.LOGIN_USER_SUCCESS
    }
}

// Restore Session

export function restoreSession(): LoginTypes {
    return {
        type: actionNames.RESTORE_SESSION
    }
}