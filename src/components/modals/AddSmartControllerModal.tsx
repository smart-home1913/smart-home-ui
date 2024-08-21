import * as React from "react";
import {
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Input,
  Tooltip,
  Progress,
} from "@nextui-org/react";
import "../../index.css";
import {
  ActionResponse,
  DefaultService,
  GetActionsActionsGetData,
  GetActionsActionsGetResponse,
  SmartControllerRequest,
} from "../../client";
import { FaSave } from "react-icons/fa";
import { Selection } from "@react-types/shared/src/selection.ts";

import { isIP } from "is-ip";
import { useQuery, useQueryClient } from "react-query";

export interface IAddSmartControllerModalProps {
  onOpenChange: () => void;
  isOpen: boolean;
}

export default function EditSmartControllerModal(
  props: IAddSmartControllerModalProps
) {
  const [address, setAddress] = React.useState("");
  const [name, setName] = React.useState("");
  const queryClient = useQueryClient();
  const [selectedKeys, setSelectedKeys] = React.useState<Set<string>>(
    new Set([])
  );
  const [loading, setLoading] = React.useState<boolean>(false);
  const [isDirty, setIsDirty] = React.useState<boolean>(false);

  const { data: actions, isLoading } = useQuery<
    GetActionsActionsGetResponse,
    Error,
    GetActionsActionsGetResponse,
    "actions"
  >("actions", () => {
    const params: GetActionsActionsGetData = {};
    return DefaultService.getActionsActionsGet(params);
  });

  React.useEffect(() => {
    resetForm();
  }, [props.isOpen]);

  const resetForm = () => {
    setAddress("");
    setName("");
    setSelectedKeys(new Set([]));
    setIsDirty(false);
  };

  const isValidIP = React.useMemo(() => {
    if (address === "") return false;

    return isIP(address) ? false : true;
  }, [address]);

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", "),
    [selectedKeys]
  );

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
                Add Smart Controller
              </h4>
            </ModalHeader>
            {(loading || isLoading) && (
              <Progress
                aria-label="Loading..."
                isIndeterminate
                size="sm"
                color="primary"
                className="max-w-xl"
              />
            )}
            <ModalBody
              className="flex justify-center"
              style={{ backgroundColor: "#333333" }}
            >
              <div className="flex items-center w-full mb-4">
                <label className="text-white mr-4 min-w-[65px]">Name:</label>
                <Input
                  value={name}
                  onValueChange={setName}
                  label="Name"
                  isInvalid={name === "" && isDirty}
                  size="sm"
                />
              </div>
              <div className="flex items-center w-full mb-4">
                <label className="text-white mr-4 min-w-[65px]">Address:</label>
                <Input
                  value={address}
                  onValueChange={setAddress}
                  isInvalid={isValidIP || (address === "" && isDirty)}
                  label="Address"
                  size="sm"
                />
              </div>
              <div className="flex items-center w-full">
                <label className="text-white mr-4 min-w-[65px]">Actions:</label>
                {actions && (
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        fullWidth
                        size="lg"
                        className="capitalize"
                        radius="sm"
                        style={{ backgroundColor: "#fff" }}
                      >
                        {selectedValue}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Multiple selection example"
                      closeOnSelect={false}
                      disallowEmptySelection
                      selectionMode="multiple"
                      selectedKeys={selectedKeys}
                      onSelectionChange={(keys: Selection) =>
                        setSelectedKeys(keys as Set<string>)
                      }
                    >
                      {actions!.map((action: ActionResponse) => {
                        return (
                          <DropdownItem
                            textValue={action.name}
                            key={action.name}
                          >
                            <Tooltip
                              placement="right"
                              content={action.description}
                            >
                              {action.name}
                            </Tooltip>
                          </DropdownItem>
                        );
                      })}
                    </DropdownMenu>
                  </Dropdown>
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
    setIsDirty(true);
    if (name === "" || address === "") {
      return;
    }
    const controllerActions = actions!
      .filter((action) => selectedKeys.has(action.name))
      .map((action) => action.id);
    const updateRequest: SmartControllerRequest = {
      name: name,
      address: address,
      actions: controllerActions,
    };
    setLoading(true);
    await DefaultService.createSmartControllerSmartControllersPost({
      requestBody: updateRequest,
    });
    queryClient.invalidateQueries("smartControllers");
    setLoading(false);
    props.onOpenChange();
  }
}
