import { UPDATE_FIELD, SUBMIT_DATA } from './constants';

export function updateField(key, payload) {
  return {
    type: UPDATE_FIELD,
    key,
    payload,
  };
}

export function submitData() {
  return {
    type: SUBMIT_DATA,
  };
}
