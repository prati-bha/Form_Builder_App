import produce from 'immer';
import {
  LOAD_APP,
} from './constants';

// The initial state of the App
export const initialState = {
  appLoading: false,
};

/* eslint-disable default-case, no-param-reassign */
const appReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOAD_APP:
        draft.appLoading = action.appLoading;
    }
  });

export default appReducer;
