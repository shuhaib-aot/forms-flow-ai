/* eslint-disable */
import React from "react";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import List from "./List";
import Stepper from "./Stepper";
// import Item from "./Item/index";
import {
  STAFF_DESIGNER,
  STAFF_REVIEWER,
  CLIENT,
  // BASE_ROUTE,
} from "../../constants/constants";
import Loading from "../../containers/Loading";

let user = "";

// const CreateFormRoute = ({ element}) =>  

//   <Route
//     {...rest}
//     render={(props) => {
//       if (user.includes(STAFF_DESIGNER)) {
//         return <Component {...props} />;
//       } else {
//         return <>Unauthorized</>;
//       }
//     }}
//   />
// );
const FormSubmissionRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      user.includes(STAFF_REVIEWER) || user.includes(CLIENT) ? (
        <Component {...props} />
      ) : (
        <>Unauthorized</>
      )
    }
  />
);

export default React.memo(() => {
  user = useSelector((state) => state.user.roles || []);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  if (!isAuthenticated) {
    return <Loading />;
  }
  return (
    
      <Routes>
       
        <Route path="form" element={<List/>} />
        <Route path="formsflow" element={<>asdfsdfasd</>} />
        {/* <CreateFormRoute
          path={`${BASE_ROUTE}formflow/:formId?/:step?`}
          component={Stepper}
        />
        <FormSubmissionRoute
          path={`${BASE_ROUTE}form/:formId/`}
          component={Item}
        /> */}
        
      </Routes>
    
  );
});
