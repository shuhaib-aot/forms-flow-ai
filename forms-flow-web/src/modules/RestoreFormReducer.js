import ACTION_CONSTANTS from "../actions/actionConstants";

const initialState = {
  restoredFormData: {},
  restoreFormId: null,
 
};

const RestoreFormReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_CONSTANTS.RESTORE_FORM_ID:
      return { ...state, restoreFormId: action.payload };
    case ACTION_CONSTANTS.RESTORE_FORM_DATA:
      return { ...state, restoredFormData: action.payload };
    default:
      return state;
  }
};
export default RestoreFormReducer;
