import {createStore, combineReducers, applyMiddleware} from 'redux';
import * as index from './index/reducer';
import thunk from 'redux-thunk';

let store = createStore(
    combineReducers({...index}),
    applyMiddleware(thunk)
);

export default store;