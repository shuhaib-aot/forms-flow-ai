import React from 'react';
import { Modal } from 'react-bootstrap';

const SaveAsNewVersionConfirmationModal = ({modalOpen,handleModalChange,onConfirm}) => {
  return (
    <Modal
    show={modalOpen}
    size="md"
    aria-labelledby="example-custom-modal-styling-title"
  >
    <Modal.Header>
      <div>
        <Modal.Title id="example-custom-modal-styling-title">
          Save as a new version
        </Modal.Title>
      </div>

      <div>
        <button
          type="button"
          className="close"
          onClick={() => {
            handleModalChange();
          }}
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </Modal.Header>

    <Modal.Body>
      <div className="d-flex align-items-start p-3">
        <i className="fa fa-info-circle text-primary mr-2"></i>
        <span > 
        This will create a new version of the form without changing 
        the path name but with new form id.
        </span>
      </div>

    </Modal.Body>
    <Modal.Footer>
      <div className='d-flex justify-content-end'>
          <button className='btn btn-danger mr-2' onClick={()=>{handleModalChange();}}>Cancel</button>
          <button className='btn btn-primary' onClick={()=>{onConfirm();}}>Continue</button>
      </div>
    </Modal.Footer>
  </Modal>
    
  );
};

export default SaveAsNewVersionConfirmationModal;