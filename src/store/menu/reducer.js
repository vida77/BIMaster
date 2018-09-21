import * as index from './actionType';

let defaultState = {}
// 初始化数据
export const initDataFun = (state = defaultState , action = {}) => {
    switch(action.type){
        case index.INITDATA:
            return action.value;
        case index.INIT_MENU:
            return action.menu;
        default:
            return state;
    }
}

