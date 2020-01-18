import { StateOneType, StateTwoType } from "../declarations";
import * as actionNames from './actionTypes';
import { StateOneRedux, StateTwoRedux } from './ReduxHandler';

export interface AppState {
    [key: string]: any;
    stateOne: Array<StateOneType>;
    stateTwo: Array<StateTwoType>;
    loading: boolean;
    loggedIn: boolean;
}

const initialState: AppState = {
    stateOne: [],
    stateTwo: [],
    loading: false,
    loggedIn: false
};

// Login and Restore Session

const loginStart = (state: AppState): AppState => {
    return {
        ...state,
        loading: true
    }
}

const loginFailed = (state: AppState): AppState => {
    return {
        ...state,
        loading: false
    }
}

const loginSuccess = (state: AppState): AppState => {
    return {
        ...state,
        loading: false,
        loggedIn: true
    }
}

const restoreSession = (state: AppState): AppState => {
    return {
        ...state,
        loading: false,
        loggedIn: true,
    }
}

export const appStateReducer = (state = initialState, action: any): AppState => {
    state = StateOneRedux.reducer(state, action);
    state = StateTwoRedux.reducer(state, action);
    
    switch (action.type) {
        case actionNames.LOGIN_USER_STARTED:
            return loginStart(state);
        case actionNames.LOGIN_USER_FAILED:
            return loginFailed(state);
        case actionNames.LOGIN_USER_SUCCESS:
            return loginSuccess(state);
        case actionNames.RESTORE_SESSION:
            return restoreSession(state);
        default: 
            return state;
    }
    
}