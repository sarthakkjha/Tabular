import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import Toolbar from "./components/Toolbar.jsx";
import Sheet from "./components/Sheet.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Landing from "./pages/Landing";
import { initializeSheetState } from "../store/tableStore.js";
import React from "react";

function SheetRouteWrapper() {
  const { sheetId } = useParams();
  React.useEffect(() => {
    console.log("sheet data fetched");
    if (sheetId) {
      initializeSheetState(sheetId);
    }
  }, [sheetId]);

  return (
    <>
      <Toolbar />
      <Sheet />
    </>
  );
}

function AppM() {
  console.log("Migrated App Rendered");
  return (
    <Router>
      <Routes>
        <Route path="/sheet/:sheetId" element={<SheetRouteWrapper />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Landing />} />
        <Route
          path="/demo"
          element={
            <>
              <Toolbar />
              <Sheet />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default AppM;
// export default useMigrated ? AppM : AppL;