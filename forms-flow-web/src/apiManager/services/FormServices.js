import {  httpPOSTRequest, httpGETRequest, httpPUTRequest} from "../httpRequestHandler";
// httpGETRequest,
import API from "../endpoints";
import UserService from "../../services/UserService";
import { CUSTOM_SUBMISSION_URL } from "../../constants/constants";
import { setCustomSubmission } from "../../actions/checkListActions";

export const formCreate = (formData, ...rest) => {
  const done = rest.length ? rest[0] : () => {};
  httpPOSTRequest(API.FORM_CREATION,formData,UserService.getToken()).then(res=>{
    if(res.data){
     done(null,res.data);
    }
   }).catch((err)=>{
    if(err.response?.data){
      done(err.response.data);
    }else{
      done(err.message);
    } 
   });
};

export const postCustomSubmission = (data,formId,...rest)=>{
  const done = rest.length ? rest[0] : () => {};
  httpPOSTRequest(`${CUSTOM_SUBMISSION_URL}/form/${formId}/submission`,data,UserService.getToken())
  .then((res)=>{
    if(res.data){
      done(null,res.data);
    }
  }).catch((err)=>{
    done(err,null);
  });
};

export const updateCustomSubmission = (data,formId,...rest)=>{
  const done = rest.length ? rest[0] : () => {};
  httpPUTRequest(`${CUSTOM_SUBMISSION_URL}/form/${formId}/submission/${data._id}`,data,
  UserService.getToken())
  .then((res)=>{
    if(res.data){
      done(null,res.data);
    }
  }).catch((err)=>{
    done(err,null);
  });
};


export const getCustomSubmission = (submissionId,formId,...rest)=>{
  const done = rest.length ? rest[0] : () => {};
  return (dispatch)=>{
    httpGETRequest(`${CUSTOM_SUBMISSION_URL}/form/${formId}/submission/${submissionId}`,
    {},UserService.getToken())
    .then((res)=>{
      if(res.data){
        dispatch(setCustomSubmission(res.data));
      }
    }).catch((err)=>{
      done(err,null);
    });
  };
};
