import React, { useEffect, useState } from "react";
import { Dropdown, FormControl, InputGroup } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import Pagination from "react-js-pagination";
import LoadingOverlay from "react-loading-overlay";
import {
  fetchAllBpmProcesses,
  fetchAllBpmProcessesCount,
} from "../../../apiManager/services/processServices";
import { useTranslation } from "react-i18next";
import { MULTITENANCY_ENABLED } from "../../../constants/constants";
import { setBpmnSearchText, setIsPublicDiagram } from "../../../actions/processActions";
import { push } from "connected-react-router";
function BpmnTable() {
  const dispatch = useDispatch();
  const process = useSelector((state) => state.process.processList);
  const searchText = useSelector((state) => state.process.bpmnSearchText);
  const tenantKey = useSelector((state) => state.tenants?.tenantId);
  const [activePage, setActivePage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [totalProcess, setTotalProcess] = useState(0);
  const [countLoading, setCountLoading] = useState(true);
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  const redirectUrl = MULTITENANCY_ENABLED ? `/tenant/${tenantKey}/` : "/";
  //this function used for showing loading

  const handlePageChange = (page) => setActivePage(page);

  useEffect(() => {
    const firstResult = (activePage - 1) * limit;
    setIsLoading(true);
    dispatch(
      fetchAllBpmProcesses(
        {
          tenant_key: tenantKey,
          firstResult: firstResult,
          maxResults: limit,
          searchKey: searchText,
        },
        () => {
          setIsLoading(false);
        }
      )
    );
    setCountLoading(true);
    fetchAllBpmProcessesCount(tenantKey, searchText)
      .then((result) => {
        setTotalProcess(result.data?.count || 0);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setCountLoading(false);
      });
  }, [tenantKey, limit, activePage, searchText, dispatch]);

  useEffect(() => {
    setSearch(searchText);
  }, [searchText]);

  const onLimitChange = (newLimit) => setLimit(newLimit);

  const handleSearchButtonClick = () => {
    dispatch(setBpmnSearchText(search));
    setActivePage(1);
  };

  const onClearSearch = () => {
    setSearch("");
    dispatch(setBpmnSearchText(""));
    setActivePage(1);
  };
 
  const gotoEdit = (data) => {
    if(MULTITENANCY_ENABLED){
      dispatch(setIsPublicDiagram(data.tenantId ? true : false));
    }
   dispatch(push(`${redirectUrl}processes/bpmn/${data.key}/edit`));
  };

  const pageOptions = [
    { text: "5", value: 5 },
    { text: "10", value: 10 },
    { text: "25", value: 25 },
    { text: "50", value: 50 },
    { text: "100", value: 100 },
    { text: "All", value: totalProcess },
  ];

  return (
    <div className="mt-3">
      <LoadingOverlay
        spinner
        text={t("Loading...")}
        active={isLoading || countLoading}
      >
        <div style={{ minHeight: "400px" }}>
 
          <table className="table custom-table table-responsive-sm mt-2">
            <thead>
              <tr>
                <th scope="col">{t("Workflow Name")}</th>
                <th scope="col">{t("Key")}</th>
                <th scope="col">{t("Type")}</th>
                <th colSpan="2">
                <InputGroup className="input-group">
              <FormControl
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                onKeyDown={(e) =>
                  e.keyCode == 13 ? handleSearchButtonClick() : ""
                }
                placeholder={t("Search by workflow name")}
                style={{ backgroundColor: "#ffff" }}
                title={t("Search by workflow name")}
              />
              {search && (
                <InputGroup.Append onClick={onClearSearch}>
                  <InputGroup.Text>
                    <i className="fa fa-times"></i>
                  </InputGroup.Text>
                </InputGroup.Append>
              )}
              <InputGroup.Append
                onClick={handleSearchButtonClick}
                disabled={!search?.trim()}
                style={{ cursor: "pointer" }}
              >
                <InputGroup.Text style={{ backgroundColor: "#ffff" }}>
                  <i className="fa fa-search"></i>
                </InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
                </th>
              </tr>
            </thead>
            {!totalProcess ? (
              <tbody>
                <tr className="no-results-row">
                  <td
                    colSpan="4"
                    style={{ height: "300px" }}
                    className="text-center"
                  >
                     { isLoading ? null : t("No Process Found")}
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {process.map((processItem) => (
                  <tr key={processItem.id}>
                    <td>{processItem.name}</td>
                    <td>{processItem.key}</td>
                    <td>{t("BPMN")}</td>
                    <td className="d-flex justify-content-end w-100">
                      <button className="btn btn-link" onClick={()=>{gotoEdit(processItem);}}> 
                       <i className="fas fa-edit mr-2"/>
                        {t("Edit Workflow")}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>

       {
        process.length ?  <div className="d-flex justify-content-between align-items-center  flex-column flex-md-row">
        <div className="d-flex align-items-center">
          <span className="mr-2"> {t("Rows per page")}</span>
          <Dropdown size="sm">
            <Dropdown.Toggle variant="light" id="dropdown-basic">
              {limit}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {pageOptions.map((option, index) => (
                <Dropdown.Item
                  key={index}
                  type="button"
                  onClick={() => {
                    onLimitChange(option.value);
                  }}
                >
                  {option.text}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <span className="ml-2">
            {t("Showing")} {(limit * activePage) - (limit - 1)} {t("to")}&nbsp;
            {Math.min(limit * activePage, totalProcess)} {t("of")}&nbsp;
            {totalProcess} {t("results")}
          </span>
        </div>
        <div className="d-flex align-items-center">
          {!totalProcess ? null : (
            <Pagination
              activePage={activePage}
              itemsCountPerPage={limit}
              totalItemsCount={totalProcess}
              pageRangeDisplayed={5}
              itemClass="page-item"
              linkClass="page-link"
              onChange={handlePageChange}
            />
          )}
        </div>
      </div> : null
       }
      </LoadingOverlay>
    </div>
  );
}

export default BpmnTable;
