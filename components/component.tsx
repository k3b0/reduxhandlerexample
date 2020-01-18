import React from 'react';
import { AppStateActionTypes } from '../store/actionTypes';
import { ThunkDispatch } from 'redux-thunk';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { StateOneRedux } from '../store/ReduxHandler';

interface DispatchProps {
    getStateOne: () => void;
}

const component: React.FC<DispatchProps> = ({getStateOne}) => {
    
    React.useEffect(() => { 
        getStateOne()
      }, [getStateOne])

    return <div>hi</div>
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AppStateActionTypes>): DispatchProps => {
    return {
        getStateOne: bindActionCreators(StateOneRedux.get, dispatch)
    }
  }

  export default connect(null, mapDispatchToProps)(component)