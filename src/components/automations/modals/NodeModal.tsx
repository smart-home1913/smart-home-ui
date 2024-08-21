import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Select,
  SelectItem,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import * as React from "react";
import {
  ActionResponse,
  DefaultService,
  SmartControllerResponse,
} from "../../../client";
import { ControllerNodeData } from "../automationEditor/AutomationEditor";
import { useEffect } from "react";
import { NotificationContext } from "../../../hooks/context";
import { Selection } from "@react-types/shared/src/selection.ts";
import { Node } from "reactflow";

export interface INodeModalProps {
  isLoadingSmartControllers: boolean;
  isNodeModalOpen: boolean;
  onNodeModalOpenChange: () => void;
  nodeAdder: (node: Node) => void;
  smartControllers: SmartControllerResponse[];
}

export default function NodeModal({
  smartControllers,
  nodeAdder,
  isLoadingSmartControllers,
  isNodeModalOpen,
  onNodeModalOpenChange,
}: INodeModalProps) {
  const [selectedId, setSelectedId] = React.useState<string>("");
  const [selectedActionId, setSelectedActionId] = React.useState<string>("");
  const [controllerActions, setControllerActions] = React.useState<
    ActionResponse[]
  >([]);
  const { automationToEdit } = React.useContext(NotificationContext);

  useEffect(() => {
    const smartController = smartControllers?.find(
      (controller) => controller.id === selectedId
    );
    if (smartController) {
      setControllerActions(smartController.actions);
    }
  }, [selectedId, smartControllers]);

  const handleSelectionChange = (keys: Set<string>) => {
    const selectedKey = Array.from(keys)[0];
    setSelectedId(selectedKey);
  };
  const handleActionSelectionChange = (keys: Set<string>) => {
    const selectedKey = Array.from(keys)[0];
    setSelectedActionId(selectedKey);
  };

  const handleAddNode = async () => {
    const smartController = smartControllers!.find((controller) => {
      return controller.id === selectedId;
    });

    if (!smartController) {
      return;
    }

    const action = smartController.actions!.find((action) => {
      return action.id === selectedActionId;
    });

    if (!action) {
      return;
    }
    const nodeData: ControllerNodeData = {
      id: `${selectedId};${selectedActionId}`,
      actionId: selectedActionId,
      label: smartController.name,
      type: action.name,
    };
    const location = { x: Math.random() * 500, y: Math.random() * 500 };
    const newNode = {
      id: `${selectedId};${selectedActionId}`,
      type: "device",
      position: location,
      data: nodeData,
    };

    await DefaultService.createNodeAutomationsAutomationIdNodesPost({
      automationId: automationToEdit!.id,
      requestBody: {
        smart_controller_id: selectedId,
        action_id: selectedActionId,
        location: location,
      },
    });

    nodeAdder(newNode);
    setSelectedId("");
    setSelectedActionId("");
    setControllerActions([]);
    onNodeModalOpenChange();
  };

  return (
    <Modal
      style={{ backgroundColor: "#333333" }}
      isOpen={isNodeModalOpen}
      onOpenChange={onNodeModalOpenChange}
    >
      {isLoadingSmartControllers ? (
        <></>
      ) : (
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-white">
                Pick Controller
              </ModalHeader>
              <ModalBody>
                {isLoadingSmartControllers ? (
                  <></>
                ) : (
                  <div className="flex flex-col items-center w-full">
                    <Select
                      label={"Select Smart Controller"}
                      selectedKeys={
                        selectedId &&
                        smartControllers!.some(
                          (option) => option.id === selectedId
                        )
                          ? [selectedId]
                          : []
                      }
                      onSelectionChange={(keys: Selection) =>
                        handleSelectionChange(keys as Set<string>)
                      }
                      className="max-w-xs mb-8"
                    >
                      {smartControllers!.map((controller) => (
                        <SelectItem key={controller.id} value={controller.id}>
                          {controller.name}
                        </SelectItem>
                      ))}
                    </Select>
                    <Select
                      isDisabled={controllerActions.length === 0}
                      label={"Select Action"}
                      selectedKeys={
                        selectedActionId &&
                        controllerActions!.some(
                          (option) => option.id === selectedActionId
                        )
                          ? [selectedActionId]
                          : []
                      }
                      onSelectionChange={(keys: Selection) =>
                        handleActionSelectionChange(keys as Set<string>)
                      }
                      className="max-w-xs"
                    >
                      {controllerActions!.map((action) => (
                        <SelectItem key={action.id} value={action.id}>
                          {action.name}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleAddNode}>
                  Add Controller
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      )}
    </Modal>
  );
}
