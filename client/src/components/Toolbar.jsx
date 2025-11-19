import { useSnapshot } from "valtio";
import { tableState } from "../../store/tableStore.js";
import { useNavigate, useParams } from "react-router-dom";
import syncService from "../../services/syncService.js";

function Toolbar() {
  const tableSnapshot = useSnapshot(tableState);
  const navigate = useNavigate();
  const { sheetId } = useParams();

  console.log("Toolbar Rendered");
  return (
    <div className="w-full h-[10vh] bg-zinc-800 flex justify-between items-center px-4">
      <div className="text-white font-bold text-2xl">Tabular</div>
      <div className="flex items-center space-x-4">
        <span className="text-white bg-zinc-900 px-3 py-2 rounded min-w-[100px]">
          Cell : <b>{tableSnapshot.currentCell}</b>
        </span>
        <span className="text-white bg-zinc-900 px-3 py-2 rounded min-w-[200px]">
          Formula :{" "}
          <b>
            {tableSnapshot
              ?.getCellByCoordinate(tableSnapshot.currentCell)
              ?.formula?.slice(1) || ""}
          </b>
        </span>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-transform transform hover:scale-105"
        >
          Dashboard
        </button>
        <button
          onClick={() => syncService.upsertCells(sheetId)}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-transform transform hover:scale-105"
        >
          Save Sheet
        </button>
      </div>
    </div>
  );
}

export default Toolbar;