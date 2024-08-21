import { useContext } from "react";
import AutomationsTable from "./automationsTable/AutomationTable";
import AutomationEditor from "./automationEditor/AutomationEditor";
import { NotificationContext } from "../../hooks/context";
const Automations = () => {
  const { editorMode, automationToEdit } = useContext(NotificationContext);

  return (
    <div className="flex flex-col">
      {automationToEdit || editorMode ? (
        <AutomationEditor />
      ) : (
        <AutomationsTable />
      )}
    </div>
  );
};

export default Automations;
