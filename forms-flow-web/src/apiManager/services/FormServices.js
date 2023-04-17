import { RequestService } from "@formsflow/service";
import API from "../endpoints";
import { setCustomSubmission } from "../../actions/checkListActions";
import { replaceUrl } from "../../helper/helper";
import UserService from "../../services/UserService";
import axios from "axios";

export const formCreate = (formData) => {
  return RequestService.httpPOSTRequest(API.FORM_DESIGN, formData);
};

export const formUpdate = (form_id,formData) => {
  return RequestService.httpPUTRequest(`${API.FORM_DESIGN}/${form_id}`, formData);
};

export const getFormHistory = (form_id) => {
  return RequestService.httpGETRequest(`${API.FORM_HISTORY}/${form_id}`);
};

export const formioPostSubmission = (data,formId,skipSanitize)=>{
  const header = UserService.getFormioToken() ? { "x-jwt-token": UserService.getFormioToken() } : {};
  let url = `${API.GET_FORM_BY_ID}/${formId}/submission`;
  if(skipSanitize){
    url += `?skip-sanitize=${skipSanitize}`;
  }
  return RequestService.httpPOSTRequest(url,data,"", false,header);
};

export const formioUpdateSubmission = (data,formId,submissionId,skipSanitize)=>{
  const header = UserService.getFormioToken() ? { "x-jwt-token": UserService.getFormioToken() } : {};
  let url = `${API.GET_FORM_BY_ID}/${formId}/submission/${submissionId}`;
  if(skipSanitize){
    url += `?skip-sanitize=${skipSanitize}`;
  }
  return axios.put(url,data,{headers:header});
};

export const formioGetSubmission = (formId,submissionId)=>{
  const header = UserService.getFormioToken() ? { "x-jwt-token": UserService.getFormioToken() } : {};
  let url = `${API.GET_FORM_BY_ID}/${formId}/submission/${submissionId}`;
  return RequestService.httpGETRequest(url,"","",false,header);
};


export const postCustomSubmission = (data, formId, isPublic, ...rest) => {
  const done = rest.length ? rest[0] : () => {};
  const url = isPublic ? API.PUBLIC_CUSTOM_SUBMISSION : API.CUSTOM_SUBMISSION;
  const submissionUrl = replaceUrl(url, "<form_id>", formId);
  RequestService.httpPOSTRequest(`${submissionUrl}`, data)
    .then((res) => {
      if (res.data) {
        done(null, res.data);
      } else {
        done("Error Posting data", null);
      }
    })
    .catch((err) => {
      done(err, null);
    });
};

export const updateCustomSubmission = (data, formId, ...rest) => {
  const done = rest.length ? rest[0] : () => {};
  const submissionUrl = replaceUrl(API.CUSTOM_SUBMISSION, "<form_id>", formId);
  RequestService.httpPUTRequest(`${submissionUrl}/${data._id}`, data)
    .then((res) => {
      if (res.data) {
        done(null, res.data);
      } else {
        done("Error updating data", null);
      }
    })
    .catch((err) => {
      done(err, null);
    });
};

export const getCustomSubmission = (submissionId, formId, ...rest) => {
  const done = rest.length ? rest[0] : () => {};
  const submissionUrl = replaceUrl(API.CUSTOM_SUBMISSION, "<form_id>", formId);

  return (dispatch) => {
    RequestService.httpGETRequest(`${submissionUrl}/${submissionId}`, {})
      .then((res) => {
        if (res.data) {
          done(null, res.data);
          dispatch(setCustomSubmission(res.data));
        } else {
          dispatch(setCustomSubmission({}));
        }
      })
      .catch((err) => {
        done(err, null);
      });
  };
};
