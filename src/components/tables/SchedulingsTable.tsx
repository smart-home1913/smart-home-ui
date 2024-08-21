import * as React from "react";
import { DefaultService, TaskResponse } from "../../client";
import {
  Table as UITable,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Progress,
} from "@nextui-org/react";
const daysOfWeek: { [key: number]: string } = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  7: "Sunday",
};
export interface ISchedulingsTableProps {
  tasks: TaskResponse[];
  maxHeight: number;
  refresh: (key: string) => void;
}

export default function SchedulingsTable(props: ISchedulingsTableProps) {
  const [loading, setLoading] = React.useState<boolean>(false);

  return (
    <div>
      {loading && (
        <Progress
          aria-label="Loading..."
          isIndeterminate
          size="sm"
          color="primary"
          className="max-w-xl"
        />
      )}
      <UITable
        isHeaderSticky={true}
        className={`dark max-h-[${props.maxHeight}]`}
        aria-label="Example static collection table"
      >
        <TableHeader>
          <TableColumn>ACTION NAME</TableColumn>
          <TableColumn>INTERVAL</TableColumn>
          <TableColumn>AT</TableColumn>
          <TableColumn>
            <></>
          </TableColumn>
        </TableHeader>
        <TableBody>
          {props.tasks.map((task) => {
            let at = "";
            switch (task.type) {
              case "daily":
                at = `${task.hour}:${task.minute}`;
                break;
              case "weekly":
                at = `${daysOfWeek[task.week_day]} @ ${task.hour}:${
                  task.minute
                }`;
                break;
              case "monthly":
                at = `${task.month_day}th of each month @ ${task.hour}:${task.minute}`;
                break;
              default:
                break;
            }
            return (
              <TableRow key={task.id} style={{ color: "white" }}>
                <TableCell style={{ textTransform: "capitalize" }}>
                  {task.action.name}
                </TableCell>
                <TableCell style={{ textTransform: "capitalize" }}>
                  {task.type}
                </TableCell>
                <TableCell>{at}</TableCell>
                <TableCell>
                  <div
                    onClick={async () => {
                      setLoading(true);
                      await DefaultService.deleteTaskTasksDelete({
                        taskId: task.id,
                      });
                      props.refresh("tasks");
                      setLoading(false);
                    }}
                  >
                    <DeleteIcon />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </UITable>
    </div>
  );
}

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
