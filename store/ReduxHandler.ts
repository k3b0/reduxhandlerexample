import { RemoteMongoCollection, StitchUser } from "mongodb-stitch-browser-sdk";
import { Dispatch } from 'redux';
import { AppState } from "./reducers";
import { StartedType, FailedType, SuccessType, ActionTypes } from "./actionTypes";
import { getCurrentUser } from "../stitch/authentication";
import { mongoClient } from "../stitch/app";

class StoreHandler {
    private stateName: string;
    postStartedType: string;
    postFailedType: string;
    postSuccessType: string;
    getStartedType: string;
    getFailedType: string;
    getSuccessType: string;
    updateStartedType: string;
    updateFailedType: string;
    updateSuccessType: string;
    deleteStartedType: string;
    deleteFailedType: string;
    deleteSuccessType: string;
    database: RemoteMongoCollection<any>;

    constructor(stateName: string) {
        this.stateName = stateName;
        const capital = stateName.toUpperCase();
        this.postStartedType = `CREATE_${capital}_STARTED`;
        this.postFailedType = `CREATE_${capital}_FAILED`;
        this.postSuccessType = `CREATE_${capital}_SUCCESS`;
        this.getStartedType = `GET_${capital}_STARTED`;
        this.getFailedType = `GET_${capital}_FAILED`;
        this.getSuccessType = `GET_${capital}_SUCCESS`;
        this.updateStartedType = `UPDATE_${capital}_STARTED`;
        this.updateFailedType = `UPDATE_${capital}_FAILED`;
        this.updateSuccessType = `UPDATE_${capital}_SUCCESS`;
        this.deleteStartedType = `DELETE_${capital}_STARTED`;
        this.deleteFailedType = `DELETE_${capital}_FAILED`;
        this.deleteSuccessType = `DELETE_${capital}_SUCCESS`;
        this.database = mongoClient.db('meal-prep-db').collection(stateName);
    }

    // GET Action Creators

    private getStarted = (): StartedType => {
        return {
            type: this.getStartedType
        }
    }

    private getFailed = (): FailedType => {
        return {
            type: this.getFailedType
        }
    }

    private getSuccess = (payload: any): SuccessType => {
        return {
            type: this.getSuccessType,
            payload: payload
        }
    }

    get = () => {

        return async (dispatch: Dispatch<ActionTypes>) => {
            try {
                dispatch(this.getStarted())
                const result: Array<any> = await this.database.find().toArray();
                dispatch(this.getSuccess(result))
                return
            } catch (error) {
                dispatch(this.getFailed())
            }
        }
    }

    // ADD Action Creators 

    private postStarted = (): StartedType => {
        return {
            type: this.postStartedType
        }
    } 

    private postFailed = (): FailedType => {
        return {
            type: this.postFailedType
        }
    } 

    private postSuccess = (payload: any): SuccessType => {
        return {
            type: this.postSuccessType,
            payload: payload
        }
    }

    post = (settings: any) => {
        return async (dispatch: Dispatch<ActionTypes>) => {
            try {
                dispatch(this.postStarted())
                const user: StitchUser = getCurrentUser() as StitchUser;
                const result = await this.database.insertOne({
                    ...settings,
                    owner_id: user.id
                });
                const newArray: Array<any> = await this.database.find({_id: result.insertedId}).toArray()
                dispatch(this.postSuccess(newArray[0]))
                return
            } catch {
                dispatch(this.postFailed())
            }
        }
    }

    // UPDATE Action Creators
    private updateStarted = (): StartedType => {
        return {
            type: this.updateStartedType
        }
    } 
    private updateFailed = (): FailedType => {
        debugger
        return {
            type: this.updateFailedType
        }
    } 
    private updateSuccess = (payload: any): SuccessType => {
        return {
            type: this.updateSuccessType,
            payload: payload
        }
    }

    update = (item: any) => {
        return async (dispatch: Dispatch<ActionTypes>) => {
            try {
                dispatch(this.updateStarted());
                const result: any = await this.database.findOneAndUpdate({_id: item._id}, item)
                const updatedItem: any = await this.database.find({_id: result._id}).toArray();
                dispatch(this.updateSuccess(updatedItem))
                debugger
                return
            } catch (error) {
                console.log(error);
                dispatch(this.updateFailed())
                debugger
            }
        }
    }

    // DELETE Action Creators

    private deleteStarted = (): StartedType => {
        return {
            type: this.deleteStartedType
        }
    } 

    private deleteFailed = (): FailedType => {
        return {
            type: this.deleteFailedType
        }
    } 

    private deleteSuccess = (id: string): SuccessType => {
        return {
            type: this.deleteSuccessType,
            payload: {
                _id: id
            }
        }
    }

    delete = (item: any) => {
        return async (dispatch: Dispatch<ActionTypes>) => {
            try {
                dispatch(this.deleteStarted())
                const query = {_id: item._id}
                await this.database.deleteOne(query);
                dispatch(this.deleteSuccess(query._id.toString()))
                return
            } catch(error) {
                console.log(error);
                dispatch(this.deleteFailed());
            }
        }
    }

    // General Reducers

    private started_reducer (state: AppState): AppState {
        return {
            ...state,
            loading: true
        }
    }

    private failed_reducer(state: AppState): AppState {
        return {
            ...state,
            loading: false
        }
    }

    // Success Reducers

    private postGet_success_reducer(state: AppState, action: SuccessType): AppState {
        return {
            ...state,
            [this.stateName]: state[this.stateName].concat(action.payload),
            loading: false
        }
    }

    private update_success_reducer(state: AppState, action: SuccessType): AppState {
        debugger
        return {
            ...state,
            [this.stateName]: state[this.stateName]
                .filter((item: any) => item._id.toString() !== action.payload[0]._id.toString())
                .concat(action.payload)

        }
    }

    private delete_success_reducer(state: AppState, action: SuccessType): AppState {
        return {
            ...state,
            [this.stateName]: state[this.stateName].filter((item: any) => item._id.toString() !== action.payload._id)
        }
    }

    reducer = (state: AppState, action: ActionTypes): AppState => {
        switch(action.type) {
            case this.getStartedType:
                return this.started_reducer(state);
            case this.getFailedType:
                return this.failed_reducer(state);
            case this.getSuccessType:
                return this.postGet_success_reducer(state, action as SuccessType);
            case this.postStartedType:
                return this.started_reducer(state);
            case this.postFailedType:
                return this.failed_reducer(state);
            case this.postSuccessType:
                return this.postGet_success_reducer(state, action as SuccessType);
            case this.updateStartedType:
                return this.started_reducer(state);
            case this.updateFailedType:
                return this.failed_reducer(state);
            case this.updateSuccessType:
                return this.update_success_reducer(state, action as SuccessType);
            case this.deleteStartedType:
                return this.started_reducer(state);
            case this.deleteFailedType:
                return this.failed_reducer(state);
            case this.deleteSuccessType:
                return this.delete_success_reducer(state, action as SuccessType);
            default:
                return state
        }
    }
    
}

export const StateOneRedux: StoreHandler = new StoreHandler('stateOne');
export const StateTwoRedux: StoreHandler = new StoreHandler('stateTwo');