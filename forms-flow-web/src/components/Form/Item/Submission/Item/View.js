import React from "react";
import { connect, useSelector } from "react-redux";
import {
  selectRoot,
  resetSubmissions,
  saveSubmission,
  Form,
  selectError,
  Errors,
} from "react-formio";
import { push } from "connected-react-router";
// import { Button } from "react-bootstrap";

import Loading from "../../../../../containers/Loading";
// import PdfDownloadService from "../../../../../services/PdfDownloadService";
import { setFormSubmissionLoading } from "../../../../../actions/formActions";
import LoadingOverlay from "react-loading-overlay";
import { useTranslation } from "react-i18next";
import { formio_resourceBundles } from "../../../../../resourceBundles/formio_resourceBundles";
<<<<<<< HEAD
import { CUSTOM_SUBMISSION_URL } from "../../../../../constants/constants";
import { updateCustomSubmission } from "../../../../../apiManager/services/FormServices";
=======
import { DownloadPDFButton } from '../../../ExportAsPdf/downloadPdfButton';

>>>>>>> b91143399f3a8bbc60e82ae2afda845dc3a30fc1
const View = React.memo((props) => {
  const { t } = useTranslation();
  const {
    hideComponents,
    onSubmit,
    options,
    errors,
    form: { form, isActive: isFormActive },
    submission: { submission, isActive: isSubActive, url },
    showPrintButton,
  } = props;
  const isFormSubmissionLoading = useSelector(
    (state) => state.formDelete.isFormSubmissionLoading
  );

  const customSubmission = useSelector((state) => state.formDelete.customSubmission);

  let updatedSubmission;
  if(CUSTOM_SUBMISSION_URL){
    updatedSubmission = customSubmission;
  }else {
    updatedSubmission = submission;
  }

  if (isFormActive || (isSubActive && !isFormSubmissionLoading)) {
    return <Loading />;
  }


  return (
    <div className="container row task-container">
      <div className="main-header">
        <h3 className="task-head"> {form.title}</h3>
        {showPrintButton ? (
          <div className="btn-right d-flex flex-row">
            {/* <Button
              className="btn btn-primary btn-sm form-btn pull-right btn-right"
              onClick={() => PdfDownloadService.getPdf(form, submission)}
            >
              <i className="fa fa-print" aria-hidden="true" />
              {t("Print As PDF")}
            </Button> */}
            <DownloadPDFButton 
            form_id={form._id} 
            submission_id={submission._id} 
            title={form.title}/>
          </div>
        ) : null}
      </div>

      <Errors errors={errors} />
      <LoadingOverlay
        active={isFormSubmissionLoading}
        spinner
        text={t("Loading...")}
        className="col-12"
      >
        <div className="sub-container">
          <Form
            form={form}
            submission={updatedSubmission}
            url={url}
            hideComponents={hideComponents}
            onSubmit={onSubmit}
            options={{ ...options, i18n: formio_resourceBundles }}
          />
        </div>
      </LoadingOverlay>
    </div>
  );
});

View.defaultProps = {
  showPrintButton: true,
};

const mapStateToProps = (state) => {
  return {
    form: selectRoot("form", state),
    submission: selectRoot("submission", state),
    options: {
      readOnly: true,
      language: state.user.lang,
    },
    errors: [selectError("submission", state), selectError("form", state)],
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSubmit: (submission) => {
      dispatch(setFormSubmissionLoading(true));
      const callBack = (err, submission) => {
        if (!err) {
          dispatch(resetSubmissions("submission"));
          dispatch(setFormSubmissionLoading(false));
          dispatch(
            push(
              `/form/${ownProps.match.params.formId}/submission/${submission._id}`
            )
          );
        } else {
          dispatch(setFormSubmissionLoading(false));
        }
      };
      if(CUSTOM_SUBMISSION_URL){
        updateCustomSubmission(submission,ownProps.match.params.formId,callBack);
      }else{
        dispatch(
          saveSubmission(
            "submission",
            submission,
            ownProps.match.params.formId,
            callBack
          )
        );
      }
    
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(View);
