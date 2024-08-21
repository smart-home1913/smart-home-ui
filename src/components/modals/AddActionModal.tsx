import * as React from "react";
import {
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Progress,
} from "@nextui-org/react";
import "../../index.css";
import { ActionRequest, ActionResponse, DefaultService } from "../../client";
import { FaSave } from "react-icons/fa";
import { Selection } from "@react-types/shared/src/selection.ts";
import { useQueryClient } from "react-query";
export interface IAddActionModalProps {
  onOpenChange: () => void;
  isOpen: boolean;
}

const emptyAction: ActionResponse = {
  id: "",
  description: "",
  opposite_action_id: "",
  name: "None",
  path: "",
};

export default function AddActionModal(props: IAddActionModalProps) {
  const [path, setPath] = React.useState("");
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  const [actions, setActions] = React.useState<ActionResponse[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [selectedId, setSelectedId] = React.useState<string>("");
  const [isDirty, setIsDirty] = React.useState<boolean>(false);
  const queryClient = useQueryClient();

  const handleSelectionChange = (keys: Set<string>) => {
    const selectedKey = Array.from(keys)[0];
    setSelectedId(selectedKey);
  };

  React.useEffect(() => {
    resetForm();
  }, [props.isOpen]);

  const resetForm = () => {
    setDescription("");
    setPath("");
    setName("");
    setSelectedId("");
    setIsDirty(false);
  };

  React.useEffect(() => {
    const fetchActions = async () => {
      try {
        const response = await DefaultService.getActionsActionsGet();
        setActions([emptyAction, ...response]);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchActions();
  }, []);

  return (
    <Modal
      isOpen={props.isOpen}
      onOpenChange={props.onOpenChange}
      scrollBehavior={"inside"}
      placement={"top"}
      backdrop="blur"
      classNames={{
        header: "rounded-t-xl",
        footer: "rounded-b-xl",
        base: "min-h-[400px]",
      }}
    >
      <ModalContent style={{ backgroundColor: "#333333" }}>
        {(onClose) => (
          <>
            <ModalHeader
              style={{ backgroundColor: "#333333" }}
              className="flex-col items-start p-5 bg-gradient-to-b from-black/20 to-transparent"
            >
              <h4 className="text-white font-medium text-2xl">
                Add New Action
              </h4>
            </ModalHeader>
            {loading && (
              <Progress
                aria-label="Loading..."
                isIndeterminate
                size="sm"
                color="primary"
                className="max-w-md"
              />
            )}
            <ModalBody
              className="flex justify-center mb-6 mt-6"
              style={{ backgroundColor: "#333333" }}
            >
              <div className="flex items-center w-full mb-4">
                <label className="text-white mr-4 min-w-[120px]">Name:</label>
                <Input
                  value={name}
                  isInvalid={name === "" && isDirty}
                  onValueChange={setName}
                  label="Name"
                  size="sm"
                  errorMessage="Required field"
                />
              </div>
              <div className="flex items-center w-full mb-4">
                <label className="text-white mr-4 min-w-[120px]">Path:</label>
                <Input
                  isInvalid={path === "" && isDirty}
                  value={path}
                  onValueChange={setPath}
                  label="Path"
                  size="sm"
                />
              </div>
              <div className="flex items-center w-full mb-4">
                <label className="text-white mr-4 min-w-[120px]">
                  Description:
                </label>
                <Input
                  isInvalid={description === "" && isDirty}
                  value={description}
                  onValueChange={setDescription}
                  label="Description"
                  size="sm"
                />
              </div>
              <div className="flex items-center w-full">
                <label className="text-white mr-4 min-w-[121px]">
                  Reverse Action:
                </label>
                <Select
                  label={"Select Revers Action"}
                  selectedKeys={
                    selectedId &&
                    actions.some((option) => option.id === selectedId)
                      ? [selectedId]
                      : []
                  }
                  onSelectionChange={(keys: Selection) =>
                    handleSelectionChange(keys as Set<string>)
                  }
                  className="max-w-xs"
                >
                  {actions.map((action) => (
                    <SelectItem key={action.id} value={action.id}>
                      {action.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </ModalBody>
            <Divider style={{ backgroundColor: "#000" }} />
            <ModalFooter
              className="flex justify-between"
              style={{ backgroundColor: "#333333" }}
            >
              <Button variant="flat" color="danger" onPress={onClose}>
                Close
              </Button>
              <Button style={{ backgroundColor: "#6cc070" }} onClick={save}>
                <FaSave size={18} color="#fff" />
                <p style={{ color: "#fff" }}>SAVE</p>
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );

  async function save() {
    setIsDirty(true);
    const actionRequest: ActionRequest = {
      name: name,
      path: path,
      opposite_action_id: selectedId,
      description: description,
    };
    if ([name, path, description].some((element) => element === "")) {
      return;
    }

    setLoading(true);
    await DefaultService.createActionActionsPost({
      requestBody: actionRequest,
    });
    setLoading(false);
    queryClient.invalidateQueries("actions");
    props.onOpenChange();
  }
}
