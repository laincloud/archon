import Moment from 'moment';

export function createReducer(initialState, handlers) {
  return function(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action);
    } else {
      return state;
    }
  }
}

export function createAction(type, ...argNames) {
  return function(...args) {
    let action = { type };
    _.forEach(argNames, (arg, index) => {
      action[arg] = args[index];
    });
    return action;
  }
}

export function getCommitTimeFromTag(tag){
    let ts = 0;
    if (tag) {
      let index = tag.indexOf('-');
      if (index != -1) {
        ts = Number(tag.substring(0, index))
      }
    }
    ts = isNaN(ts) ? 0 : ts;
    return Moment.unix(ts);
}
