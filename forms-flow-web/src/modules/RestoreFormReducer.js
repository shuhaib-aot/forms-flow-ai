import ACTION_CONSTANTS from "../actions/actionConstants";

const initialState = {
  restoredForm: {},
  restoreFormId: null,
 
};

const RestoreFormReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_CONSTANTS.RESTORE_FORM_ID:
      return { ...state, restoreFormId: action.payload };
    default:
      return state;
  }
};
export default RestoreFormReducer;
