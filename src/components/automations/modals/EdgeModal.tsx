import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Select,
  SelectItem,
  Input,
  ModalFooter,
  Button,
  Progress,
  Checkbox,
} from "@nextui-org/react";
import * as React from "react";
import { ConditionType, Operator, ValueType } from "../models";
import { ConditionEdgeData } from "../Edge/Edge";
import { toTitleCase } from "../../../utils/utils";
import { Connection, Edge } from "reactflow";
import {
  AutomationEdgeRequest,
  AutomationNodeResponse,
  DefaultService,
} from "../../../client";
import { NotificationContext } from "../../../hooks/context";
import { useQuery, useQueryClient } from "react-query";

const DEFAULT_EDGE = {
  conditionType: ConditionType.BY_VALUE,
  valueType: ValueType.NUMBER,
  operator: Operator.EQUAL,
  valueBoolean: null,
  valueNumber: null,
  isLoop: false,
};

export interface IEdgeModalProps {
  isEdgeModalOpen: boolean;
  onEdgeModalOpenChange: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setEdges: any;
  edges: Edge[];
  connection: Connection;
}

export default function EdgeModal(props: IEdgeModalProps) {
  const [newEdgeData, setNewEdgeData] =
    React.useState<ConditionEdgeData>(DEFAULT_EDGE);
  const { automationToEdit } = React.useContext(NotificationContext);
  const queryClient = useQueryClient();

  const fetchAutomationNodes = async (): Promise<AutomationNodeResponse[]> => {
    return DefaultService.readAutomationsNodesAutomationsAutomationIdNodesGet({
      automationId: automationToEdit!.id,
    });
  };

  const { data: nodes, isLoading: isLoadingNodes } = useQuery(
    "nodes",
    fetchAutomationNodes,
    {
      enabled: !!automationToEdit,
    }
  );

  const handleAddEdge = React.useCallback(async () => {
    await queryClient.invalidateQueries("nodes");
    const source = nodes!.find(
      (node) =>
        `${node.smart_controller_id};${node.action_id}` ===
        props.connection.source
    );
    const target = nodes!.find(
      (node) =>
        `${node.smart_controller_id};${node.action_id}` ===
        props.connection.target
    );
    const newEdge = {
      id: `${props.connection.source}->${props.connection.target}`,
      source: props.connection.source,
      target: props.connection.target,
      label: "",
      type: "custom",
      data: { status: "active", type: "power", ...newEdgeData },
    };

    const newEdgeRequest: AutomationEdgeRequest = {
      source: source!,
      target: target!,
      condition: {
        condition_type: newEdgeData.conditionType,
        operator: newEdgeData.operator,
        value_type: newEdgeData.valueType,
        value_boolean: newEdgeData.valueBoolean,
        value_number: newEdgeData.valueNumber,
        is_loop: newEdgeData.isLoop,
      },
    };

    props.setEdges((eds: Edge[]) => [...eds, newEdge]);
    props.onEdgeModalOpenChange();
    await DefaultService.createEdgeAutomationsAutomationIdEdgesPost({
      automationId: automationToEdit!.id,
      requestBody: newEdgeRequest,
    });
    setNewEdgeData(DEFAULT_EDGE);
  }, [automationToEdit, newEdgeData, nodes, props, queryClient]);

  return (
    <Modal
      isOpen={props.isEdgeModalOpen}
      onOpenChange={props.onEdgeModalOpenChange}
    >
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1">
            Add Condition
          </ModalHeader>
          {isLoadingNodes && (
            <Progress
              aria-label="Loading..."
              isIndeterminate
              size="sm"
              color="primary"
              className="max-w-md"
            />
          )}
          <ModalBody>
            <Select
              label="Condition Type"
              defaultSelectedKeys={[ConditionType.BY_VALUE]}
              className="max-w"
              onChange={(e) =>
                setNewEdgeData({
                  ...newEdgeData,
                  conditionType: e.target.value as ConditionType,
                })
              }
            >
              <SelectItem key={ConditionType.BY_VALUE}>Value</SelectItem>
              <SelectItem key={ConditionType.BY_TRIGGER}>Trigger</SelectItem>
            </Select>
            {newEdgeData.conditionType == ConditionType.BY_VALUE && (
              <Select
                label="Value Type"
                defaultSelectedKeys={[ValueType.NUMBER]}
                className="max-w"
                onChange={(e) =>
                  setNewEdgeData({
                    ...newEdgeData,
                    valueType: e.target.value as ValueType,
                  })
                }
              >
                <SelectItem key={ValueType.BOOLEAN}>Boolean</SelectItem>
                <SelectItem key={ValueType.NUMBER}>Number</SelectItem>
              </Select>
            )}
            {newEdgeData.conditionType == ConditionType.BY_VALUE &&
              newEdgeData.valueType === ValueType.NUMBER && (
                <Select
                  label="Operator"
                  defaultSelectedKeys={[Operator.EQUAL]}
                  className="max-w"
                  onChange={(e) =>
                    setNewEdgeData({
                      ...newEdgeData,
                      operator: e.target.value as Operator,
                    })
                  }
                >
                  {Object.entries(Operator).map((entry) => {
                    return (
                      <SelectItem key={entry[1]}>
                        {`${toTitleCase(entry[0].split("_").join(" "))} (${
                          entry[1]
                        })`}
                      </SelectItem>
                    );
                  })}
                </Select>
              )}
            {newEdgeData.conditionType == ConditionType.BY_VALUE &&
              newEdgeData.valueType === ValueType.BOOLEAN && (
                <Select
                  label="Boolean Value"
                  defaultSelectedKeys={["true"]}
                  className="max-w"
                  onChange={(e) =>
                    setNewEdgeData({
                      ...newEdgeData,
                      valueBoolean: JSON.parse(e.target.value),
                    })
                  }
                >
                  <SelectItem key={"true"}>True</SelectItem>
                  <SelectItem key={"false"}>False</SelectItem>
                </Select>
              )}
            {newEdgeData.conditionType == ConditionType.BY_VALUE &&
              newEdgeData.valueType === ValueType.NUMBER && (
                <Input
                  label="Value"
                  draggable="false"
                  placeholder="Enter value"
                  type="number"
                  onChange={(e) => {
                    setNewEdgeData({
                      ...newEdgeData,
                      valueNumber: parseInt(e.target.value, 10),
                    });
                  }}
                />
              )}
            {newEdgeData.conditionType == ConditionType.BY_VALUE && (
              <Checkbox
                isSelected={newEdgeData.isLoop}
                onValueChange={(e) => {
                  setNewEdgeData({
                    ...newEdgeData,
                    isLoop: e,
                  });
                }}
              >
                Loop
              </Checkbox>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={props.onEdgeModalOpenChange}
            >
              Cancel
            </Button>
            <Button
              disabled={isLoadingNodes}
              color="primary"
              onPress={handleAddEdge}
            >
              Add Edge
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
}
