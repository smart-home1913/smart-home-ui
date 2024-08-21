import { ActionResponse } from "../../client";
import {
  Table as UITable,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";

export interface IActionsTableProps {
  actions: ActionResponse[];
  maxHeight: number;
}

export default function ActionsTable(props: IActionsTableProps) {
  return (
    <div>
      <UITable isHeaderSticky={true} className={`dark max-h-[500}]`}>
        <TableHeader>
          <TableColumn>PATH</TableColumn>
          <TableColumn>DESCRIPTION</TableColumn>
        </TableHeader>
        <TableBody>
          {props.actions.map((action) => {
            return (
              <TableRow key={action.id} style={{ color: "white" }}>
                <TableCell>{action.path}</TableCell>
                <TableCell>{action.name}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </UITable>
    </div>
  );
}
