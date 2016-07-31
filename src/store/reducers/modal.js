import {OPEN, DISMISS} from '../actions/modal';

export default function(state = {}, {type, payload}) {
   switch (type) {
      case OPEN: return {
         visible: true, ...payload
      };
      case DISMISS: return {
         visible: false,
         component: null,
         style: state.style
      };
      default: return state;
   }
}
