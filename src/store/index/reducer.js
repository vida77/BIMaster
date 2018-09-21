import * as index from './actionType';

let defaultState = {};
let defaultStateMenu = '';
let defaultToggle = false;
// 初始化数据
export const initDataFun = (state = defaultState , action = {}) => {
    switch(action.type){
        case index.INITDATA:
            return action.value;
        default:
            return state;
    }
}
export const initDataMenu = (state = defaultStateMenu , action = {}) => {
    switch(action.type){
        case index.INITMENU:
            return action.value;
        default:
            return state;
    }
}
export const initDataToggle = (state = defaultToggle , action = {}) => {
    switch(action.type){
        case index.INITTOGGLE:
            return action.value;
        default:
            return state;
    }
}

