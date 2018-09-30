/*
* 接口返回的对象转换为数组，且字段值向上取整，多用于表格数据
* @param obj
* @param arrStr      不需要向上取整的字段数组
* @return arr
* */
export function objectToArr (obj, arrStr, flag) {
    let arr = [];
    let keyArr = Object.keys(obj);
    for(let k in keyArr) {
        let oo = obj[keyArr[k]];
        arr.push(Object.assign({},{start_time: keyArr[k], key: k}, oo));
    }
    if(!flag){
        arr.map( item => {
            Object.keys(item).map( item1 => {
                if(arrStr.indexOf(item1) > -1){
                    return item[item1];
                }
                else {
                    // return (item[item1] = Math.ceil(item[item1]));
                    return (item[item1] = Math.ceil(item[item1]));
                    if(item[item1].toString().includes(".")){
                        return (item[item1] = parseFloat(item[item1]).toFixed(2));
                    }else {
                        return item[item1];
                    }
                }
            })
        });
    }
    return arr.reverse();
}
// 保留2位小数点，倒叙
export function objectToArr2 (obj, arrStr, flag) {
    // console.log(obj)//[{},{},{}]
    let arr = [];
    let keyArr = Object.keys(obj);
    // console.log(keyArr)//["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
    for(let k in keyArr) {
        let oo = obj[keyArr[k]];
        // console.log(oo)//{},{},{}
        arr.unshift(Object.assign({},{date_ts: keyArr[k], key: k}, oo));
    }
    if(!flag){
        arr.map( item => {
            Object.keys(item).map( item1 => {
                if(arrStr.indexOf(item1) > -1){
                    return item[item1];
                }
                else {
                    // return (item[item1] = Math.ceil(item[item1]));
                    if(item[item1].toString().includes(".")){
                        if(item[item1]== 0){
                            return (item[item1] = parseFloat(item[item1]).toFixed(0));
                        }
                        return item[item1]
                    }
                }
            })
        });
    }
    return arr.reverse();
}
//数字添加千分符
export function milliFormat(arr) {
    arr.map( item => {
        for(let item1 in item){
            if(item1 == 'key' || item1 == 'start_time' || item1 == 'coupon_id'|| item1 == 'coupon_name'|| item1 == 'date_ts'|| item1 == 'activity_name'|| item1 == 'activity_id' ){
                item[item1] = item[item1]
            }else {
                item[item1] = item[item1] && item[item1].toString()
                    .replace(/^\d+/g, (m) => m.replace(/(?=(?!^)(\d{3})+$)/g, ','))
            }
        }
    });
    return arr;
}
/*
* 计算两个日期相差多少天，例如：2018-06-01和2018-06-20
* @param startDateString
* @param endDateString
* @return Int
* */
export function dateDiff (startDateString, endDateString){
    var separator = "-"; //日期分隔符
    var startDates = startDateString.split(separator);
    var endDates = endDateString.split(separator);
    var startDate = new Date(startDates[0], startDates[1]-1, startDates[2]);
    var endDate = new Date(endDates[0], endDates[1]-1, endDates[2]);
    //return parseInt(Math.abs(endDate - startDate ) / 1000 / 60 / 60 /24);//把相差的毫秒数转换为天数
    return parseInt(Math.abs(endDate - startDate ) / 1000 / 60 / 60 /24)+1;  // 相差天数包含今天
};

export function dataCeil(data, arr){
    data.map( item => {
        Object.keys(item).map( item1 => {
            if(arr.indexOf(item1) > -1){
                return item[item1];
            }else {
                return (item[item1] = Math.ceil(item[item1]));
            }
        })
    });
    return data;
}
