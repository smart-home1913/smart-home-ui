import * as React from "react";
import {
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
} from "@nextui-org/react";
import "../../index.css";
import {
  ActionResponse,
  DefaultService,
  GetActionsActionsGetData,
  GetActionsActionsGetResponse,
  SmartControllerUpdateRequest,
} from "../../client";
import { Selection } from "@react-types/shared/src/selection.ts";

import { FaSave } from "react-icons/fa";
import { isIP } from "is-ip";
import { useQuery, useQueryClient } from "react-query";

export interface IEditSmartControllelModalProps {
  isViewOpen: boolean;
  id: string;
  onViewOpenChange: () => void;
  name: string;
  address: string;
  actions: ActionResponse[];
  refresh: (key: string) => void;
}

export default function EditSmartControllerModal(
  props: IEditSmartControllelModalProps
) {
  const [address, setAddress] = React.useState("");
  const [name, setName] = React.useState("");

  const [selectedKeys, setSelectedKeys] = React.useState<Set<string>>(
    new Set([])
  );
  const [loading, setLoading] = React.useState<boolean>(false);
  const queryClient = useQueryClient();

  const isValidIP = React.useMemo(() => {
    if (address === "") return false;

    return isIP(address) ? true : false;
  }, [address]);

  const { data: actions, isLoading } = useQuery<
    GetActionsActionsGetResponse,
    Error,
    GetActionsActionsGetResponse,
    "actions"
  >("actions", () => {
    const params: GetActionsActionsGetData = {};
    return DefaultService.getActionsActionsGet(params);
  });

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", "),
    [selectedKeys]
  );

  React.useEffect(() => {
    if (actions) {
      setSelectedKeys(
        new Set(
          Array.from(actions!)
            .filter((action) =>
              props.actions.map((action) => action.id).includes(action.id)
            )
            .map((action) => action.name)
        )
      );
    }
    setName(props.name);
    setAddress(props.address);
  }, [actions, props.actions, props.address, props.isViewOpen, props.name]);

  return (
    <Modal
      isOpen={props.isViewOpen}
      onOpenChange={props.onViewOpenChange}
      scrollBehavior={"inside"}
      placement={"center"}
      backdrop="blur"
      classNames={{
        header: "rounded-t-xl",
        footer: "rounded-b-xl",
        base: "min-h-[480px]",
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
                {props.address}
              </p>
              <h4 className="text-white font-medium text-2xl">{props.name}</h4>
            </ModalHeader>
            <ModalBody
              className="flex justify-center"
              style={{ backgroundColor: "#333333" }}
            >
              <div className="flex items-center w-full mb-4">
                <label className="text-white mr-4 min-w-[65px]">Path:</label>
                <Input
                  value={name}
                  isInvalid={name === ""}
                  onValueChange={setName}
                  label="Path"
                  size="sm"
                />
              </div>
              <div className="flex items-center w-full mb-4">
                <label className="text-white mr-4 min-w-[65px]">Path:</label>
                <Input
                  value={address}
                  isInvalid={address === "" || !isValidIP}
                  onValueChange={setAddress}
                  label="Path"
                  size="sm"
                />
              </div>
              <div className="flex items-center w-full">
                <label className="text-white mr-4 min-w-[65px]">Actions:</label>
                {loading || isLoading ? (
                  <></>
                ) : (
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        fullWidth
                        size="lg"
                        variant="bordered"
                        className="capitalize"
                        style={{ backgroundColor: "#fff" }}
                        radius="sm"
                      >
                        {selectedValue}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Multiple selection example"
                      variant="flat"
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
            <ModalFooter
              className="flex justify-between"
              style={{ backgroundColor: "#333333" }}
            >
              <Button color="danger" variant="flat" onPress={onClose}>
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
    if ([name, address].some((input) => input === "")) {
      return;
    }
    const controllerActions = actions
      ? actions!
          .filter((action) => selectedKeys.has(action.name))
          .map((action) => action.id)
      : [];
    const updateRequest: SmartControllerUpdateRequest = {
      id: props.id,
      name: name,
      address: address,
      actions: controllerActions,
    };
    setLoading(true);
    await DefaultService.patchSmartControllerSmartControllersPatch({
      requestBody: updateRequest,
    });
    setLoading(false);
    queryClient.invalidateQueries("smartControllers");
    props.onViewOpenChange();
  }
}
