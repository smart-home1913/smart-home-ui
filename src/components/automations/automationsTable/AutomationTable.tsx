import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useQuery, useQueryClient } from "react-query";
import { MdModeEditOutline } from "react-icons/md";
import { useCallback, useContext, useState } from "react";
import { DefaultService, AutomationResponse } from "../../../client";
import { NotificationContext } from "../../../hooks/context";
import ReadableDateTime from "../../readableDateTime/ReadableDateTime";

// interface AutomationsTableProps {}
type NumericBooleanMap = {
  [key: number]: boolean;
};
const AutomationsTable = () => {
  const queryClient = useQueryClient();
  const { setAutomationToEdit } = useContext(NotificationContext);
  const { data: automations, isLoading: isLoading } = useQuery(
    "automations",
    DefaultService.getAutomationsAutomationsGet
  );
  const [isPopoverOpen, setIsPopoverOpen] = useState<NumericBooleanMap>({});

  const changeActivity = useCallback(
    async (automation: AutomationResponse) => {
      await DefaultService.updateAutomationAutomationsAutomationIdPut({
        automationId: automation.id,
        requestBody: {
          name: automation.name,
          is_active: !automation.is_active,
          viewport: automation.viewport!,
        },
      });
      queryClient.invalidateQueries("automations");
    },
    [queryClient]
  );

  return (
    <div className="flex flex-col">
      {!isLoading && (
        <Table aria-label="Example static collection table">
          <TableHeader>
            <TableColumn>NAME</TableColumn>
            <TableColumn>CREATED AT</TableColumn>
            <TableColumn>ACTIVITY</TableColumn>
            <TableColumn>
              <></>
            </TableColumn>
          </TableHeader>
          <TableBody>
            {automations!.map((automation, index) => {
              return (
                <TableRow key={automation.id} style={{ color: "white" }}>
                  <TableCell>
                    <Popover
                      placement="top"
                      isOpen={isPopoverOpen[index]}
                      onOpenChange={() => setIsPopoverOpen({ [index]: true })}
                    >
                      <PopoverTrigger>
                        <span
                          className="truncate max-w-[100px] block cursor-pointer"
                          onClick={() => setIsPopoverOpen({ [index]: true })}
                        >
                          {automation.name}
                        </span>
                      </PopoverTrigger>
                      <PopoverContent>
                        <p className="text-tiny">{automation.name}</p>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell>
                    <ReadableDateTime isoString={automation.inserted_at} />
                  </TableCell>
                  <TableCell>
                    <Switch
                      isSelected={automation.is_active}
                      onClick={() => changeActivity(automation)}
                    ></Switch>
                  </TableCell>
                  <TableCell className="flex justify-evenly">
                    <MdModeEditOutline
                      size={20}
                      style={{ cursor: "pointer", marginRight: "22px" }}
                      onClick={() => {
                        setAutomationToEdit(automation);
                      }}
                    />
                    <div
                      onClick={async () => {
                        await DefaultService.deleteAutomationAutomationsAutomationIdDelete(
                          { automationId: automation.id }
                        );
                        queryClient.invalidateQueries("automations");
                      }}
                    >
                      <DeleteIcon />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AutomationsTable;

const DeleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="w-5 h-5 cursor-pointer"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);
