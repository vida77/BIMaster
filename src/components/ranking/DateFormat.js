import moment from 'moment';

const _DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';
const _TODAY = moment().format(_DEFAULT_DATE_FORMAT);
const _YESTERDAY = moment().subtract('1', 'days').format(_DEFAULT_DATE_FORMAT);

function getDate(baseDate = _YESTERDAY, dateType = 'days', count = 7) {
  let endDay = baseDate;
  switch (dateType) {
    case 'days':
      endDay = baseDate;
      break;
    case 'weeks': //周一
      endDay = moment(baseDate, _DEFAULT_DATE_FORMAT).startOf('isoweek').add(6, 'days').format(_DEFAULT_DATE_FORMAT);
      break;
    case 'months': //月初
      endDay = moment(baseDate, _DEFAULT_DATE_FORMAT).startOf('month').format(_DEFAULT_DATE_FORMAT);
      break;
    default:
      endDay = baseDate;
  }

  let days = [];
  if(baseDate === _YESTERDAY) {
    days.push(baseDate);
  } else {
    days.push(endDay);
  }

  for (let i = 1; i <= count; i++) {
    let thisDay = moment(endDay, _DEFAULT_DATE_FORMAT).subtract(i, dateType).format(_DEFAULT_DATE_FORMAT);
    days.push(thisDay);
  }
  return days;
}

export const getDateRange = (baseDate, dateType, count) => getDate(baseDate, dateType, count);
export const TODAY = _TODAY;
export const YESTERDAY = _YESTERDAY;
export const DEFAULT_DATE_FORMAT = _DEFAULT_DATE_FORMAT;