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
  Progress,
  SelectItem,
  Select,
} from "@nextui-org/react";
import "../../index.css";
import {
  ActionResponse,
  ActionUpdateRequest,
  DefaultService,
  GetActionsActionsGetData,
  GetActionsActionsGetResponse,
} from "../../client";
import { FaSave } from "react-icons/fa";
import { Selection } from "@react-types/shared/src/selection.ts";
import { useQuery, useQueryClient } from "react-query";

export interface IEditActionModalProps {
  onOpenChange: () => void;
  isOpen: boolean;
  action: ActionResponse | null;
}

const emptyAction: ActionResponse = {
  id: "",
  description: "",
  opposite_action_id: "",
  name: "None",
  path: "",
};

export default function EditActionModal(props: IEditActionModalProps) {
  const [path, setPath] = React.useState(props.action?.path);
  const [name, setName] = React.useState(props.action?.name);
  const [description, setDescription] = React.useState(
    props.action?.description
  );
  const queryClient = useQueryClient();

  const [loading, setLoading] = React.useState<boolean>(true);
  const [selectedId, setSelectedId] = React.useState<string>("");
  const { data: actions, isLoading } = useQuery<
    GetActionsActionsGetResponse,
    Error,
    GetActionsActionsGetResponse,
    "actions"
  >("actions", () => {
    const params: GetActionsActionsGetData = {};
    return DefaultService.getActionsActionsGet(params);
  });

  const resetForm = React.useCallback(() => {
    if (props.action?.opposite_action_id) {
      setSelectedId(props.action!.opposite_action_id);
    }
    setPath(props.action?.path);
    setName(props.action?.name);
    setDescription(props.action?.description);
  }, [props.action]);

  React.useEffect(() => {
    resetForm();
  }, [props.action, actions, props.isOpen, resetForm]);

  const handleSelectionChange = (keys: Set<string>) => {
    const selectedKey = Array.from(keys)[0];
    setSelectedId(selectedKey);
  };

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
              <p className="text-tiny text-white/60 uppercase font-bold">
                Edit Action
              </p>
              <h4 className="text-white font-medium text-2xl">
                {props.action?.name}
              </h4>
            </ModalHeader>
            {loading ||
              (isLoading && (
                <Progress
                  aria-label="Loading..."
                  isIndeterminate
                  size="sm"
                  color="primary"
                  className="max-w-md"
                />
              ))}
            <ModalBody
              className="flex justify-center mb-6 mt-6"
              style={{ backgroundColor: "#333333" }}
            >
              <div className="flex items-center w-full mb-4">
                <label className="text-white mr-4 min-w-[120px]">Name:</label>
                <Input
                  value={name}
                  isInvalid={name === ""}
                  onValueChange={setName}
                  label="Name"
                  size="sm"
                />
              </div>
              <div className="flex items-center w-full mb-4">
                <label className="text-white mr-4 min-w-[120px]">Path:</label>
                <Input
                  value={path}
                  isInvalid={path === ""}
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
                  value={description}
                  isInvalid={description === ""}
                  onValueChange={setDescription}
                  label="Description"
                  size="sm"
                />
              </div>
              <div className="flex items-center w-full">
                <label className="text-white mr-4 min-w-[121px]">
                  Reverse Action:
                </label>
                {isLoading ? (
                  <></>
                ) : (
                  <Select
                    label={"Select Revers Action"}
                    selectedKeys={
                      selectedId &&
                      actions!.some((option) => option.id === selectedId)
                        ? [selectedId]
                        : []
                    }
                    onSelectionChange={(keys: Selection) =>
                      handleSelectionChange(keys as Set<string>)
                    }
                    className="max-w-xs"
                  >
                    {[emptyAction, ...actions!].map((action) => (
                      <SelectItem key={action.id} value={action.id}>
                        {action.name}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              </div>
            </ModalBody>
            <Divider style={{ backgroundColor: "#000" }} />
            <ModalFooter
              className="flex justify-between"
              style={{ backgroundColor: "#333333" }}
            >
              <Button color="primary" onPress={onClose}>
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
    if ([name, path, description].some((input) => input === "")) {
      return;
    }
    const actionUpdateRequest: ActionUpdateRequest = {
      id: props.action!.id,
      name: name,
      path: path,
      opposite_action_id: selectedId,
      description: description,
    };

    setLoading(true);
    await DefaultService.patchActionActionsPatch({
      requestBody: actionUpdateRequest,
    });
    setLoading(false);
    queryClient.invalidateQueries("actions");
    props.onOpenChange();
  }
}
