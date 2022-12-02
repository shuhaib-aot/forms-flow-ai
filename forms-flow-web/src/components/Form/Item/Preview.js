import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { selectRoot, Form, selectError, Errors } from "react-formio";
import { push } from "connected-react-router";
import { Button } from "react-bootstrap";
import Loading from "../../../containers/Loading";
import { Translation } from "react-i18next";
import { formio_resourceBundles } from "../../../resourceBundles/formio_resourceBundles";
import { MULTITENANCY_ENABLED } from "../../../constants/constants";
import Modal from "react-bootstrap/Modal";
import { setRestoreFormId } from "../../../actions/formActions";

const Preview = class extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      activeStep: 1,
      workflow: null,
      status: null,
      historyModal: false,
      selectedRestoreId:1,
    };
   
    this.history = [
      {
        id:1,
        path:"form-v1",
        created: new Date().toDateString(),
        createdBy:"John.honai"
      },
      {
        id:"637677f99bc6b9aadd7a52df",
        path:"form-v2",
        created: new Date().toDateString(),
        createdBy:"John.honai"
      },
      {
        id:3,
        path:"form-v3",
        created: new Date().toDateString(),
        createdBy:"John.honai"
      },
      {
        id:4,
        path:"form-v4",
        created: new Date().toDateString(),
        createdBy:"John.honai"
      },
      {
        id:5,
        path:"form-v5",
        created: new Date().toDateString(),
        createdBy:"John.honai"
      }
    ];
  }

  handleModalChange() {
    this.setState({ ...this.state, historyModal: !this.state.historyModal });
  }

  handleSelectChange(value) {
    this.setState({ ...this.state, selectedRestoreId: value });
  }

  handleRestore(redirecUrl){
    this.props.onRestore(this.state.selectedRestoreId);
    this.props.gotoEdit(redirecUrl);

  }

  gotoEdit(redirecUrl){
    this.props.gotoEdit(redirecUrl);
  }

  render() {
    const {
      hideComponents,
      onSubmit,
      options,
      errors,
      form: { form, isActive: isFormActive },
      handleNext,
      tenants,
    } = this.props;
    const tenantKey = tenants?.tenantId;
    const redirecUrl = MULTITENANCY_ENABLED
    ? `/tenant/${tenantKey}/`
    : "/";
    if (isFormActive) {
      return <Loading />;
    }
    return (
      <div className="container">
        <div className="main-header">
          <h3 className="task-head">
            {" "}
            <i className="fa fa-wpforms" aria-hidden="true" /> &nbsp;{" "}
            {form.title}
          </h3>

          <Button
            className="btn btn-primary  form-btn pull-right btn-right"
            onClick={() => {
              this.handleModalChange();
            }}
          >
            <i className="fa fa-rotate-left " aria-hidden="true" />
            &nbsp;&nbsp;<Translation>{(t) => t("Form History")}</Translation>
          </Button>
          <Button
            className="btn btn-primary  form-btn pull-right ml-2"
            onClick={() => {
            this.gotoEdit(`${redirecUrl}formflow/${form._id}/edit`);
            }}
          >
            <i className="fa fa-pencil" aria-hidden="true" />
            &nbsp;&nbsp;<Translation>{(t) => t("Edit Form")}</Translation>
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            className="ml-3 btn btn-primary  form-btn"
          >
            {
              (this.state.activeStep === 1,
              (<Translation>{(t) => t("Next")}</Translation>))
            }
          </Button>
        </div>

        <Modal
          show={this.state.historyModal}
          size="lg"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header>
            <Modal.Title id="example-custom-modal-styling-title">
              Form History
            </Modal.Title>
            <div>
              <button onClick={()=>{
                this.handleRestore(`${redirecUrl}formflow/${form._id}/edit`);
              }} className="btn btn-primary btn-small">Restore</button>
              <button
                onClick={() => {
                  this.handleModalChange();
                }}
                className="btn btn-outline-danger btn-small ml-2"
              >
                cancel
              </button>
            </div>
          </Modal.Header>
          <Modal.Body>
            <table className="table table-borderless">
              <thead>
                <tr>
                  <th scope="col">Path  Name</th>
                  <th scope="col">created</th>
                  <th scope="col">createdBy</th>
                  <th scope="col">Select</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.history.map((i)=>(
                    <tr key={i.id}>
                  <th>{i.path}</th>
                  <td>{i.created}</td>
                  <td>{i.createdBy}</td>
                  <td>
                     
                  <div className="round" onClick={()=>{this.handleSelectChange(i.id);}} >
                       <input type="checkbox" readOnly checked={i.id === this.state.selectedRestoreId}  />
                     <span ></span>
                  </div>
                 
                  </td>
                </tr>
                  ))
                }
                
                 
              </tbody>
            </table>
          </Modal.Body>
        </Modal>

        <Errors errors={errors} />
        <Form
          form={form}
          hideComponents={hideComponents}
          onSubmit={onSubmit}
          options={{ ...options, i18n: formio_resourceBundles }}
        />
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    form: selectRoot("form", state),
    options: {
      readOnly: true,
      language: state.user.lang,
    },
    errors: [selectError("form", state)],
    tenants: selectRoot("tenants", state),
  };
};

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (dispatch, ownProps)  => {
  return {
    onRestore:(formId)=>{
      dispatch(setRestoreFormId(formId));
    },
    gotoEdit:(redirecUrl)=>{
      dispatch(push(redirecUrl));
    }
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(Preview);
