import {  httpPOSTRequest,} from "../httpRequestHandler";
// httpGETRequest,
import API from "../endpoints";
import UserService from "../../services/UserService";
import { CUSTOM_SUBMISSION_URL } from "../../constants/constants";

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

export const customSubmissionPost = (data,...rest)=>{
  const done = rest.length ? rest[0] : () => {};
  httpPOSTRequest(CUSTOM_SUBMISSION_URL,data,UserService.getToken()).then((res)=>{
    if(res.data){
      done(null,res.data);
    }
  }).catch((err)=>{
    done(err,null);
  });
};

// export const customSubmissionGet = (data,...rest)=>{
//   const done = rest.length ? rest[0] : () => {};
//   httpGETRequest(CUSTOM_SUBMISSION_URL,data,UserService.getToken()).then((res)=>{
//     if(res.data){
//       done(null,res.data);
//     }
//   }).catch((err)=>{
//     done(err,null);
//   });
// };
