import produce from 'immer';
import { UPDATE_FIELD } from './constants';

export const initialState = {
  questionTitle: '',
  questionType: '',
  options: [],

  questions: [],
  formName: '',
  uniqueFormSlug: '',
};

/* eslint-disable default-case, no-param-reassign */
const formReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case UPDATE_FIELD:
        draft[action.key] = action.payload;
        break;
    }
  });

export default formReducer;
