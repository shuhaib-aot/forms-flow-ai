import React from "react";
import { useDispatch } from "react-redux";
import { setDraftDelete } from "../../actions/draftActions";
import { useTranslation } from "react-i18next";

const DraftOperations = ({ row }) => {  
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const deleteDraft = () => {
    dispatch(
      setDraftDelete({
        modalOpen: true,
        draftId: row.id,
        draftName: row.DraftName,
      })
    );
  };

  return (
    <>
      <div>
        <span style={{ marginLeft: "2rem" }}>
          <span>
            <button
              className="btn btn-link text-danger mt-2"
              onClick={() => deleteDraft()}
            >
              {t("Delete Draft")}
            </button>
            &nbsp;
          </span>
        </span>
      </div>
    </>
  );
};

export default DraftOperations;
