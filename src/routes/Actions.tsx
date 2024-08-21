import * as React from "react";
import {
  Table as UITable,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
  Progress,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import {
  ActionResponse,
  DefaultService,
  GetActionsActionsGetData,
  GetActionsActionsGetResponse,
} from "../client";
import { MdModeEditOutline } from "react-icons/md";
import EditActionModal from "../components/modals/EditActionModal";
import { useQuery, useQueryClient } from "react-query";

export interface IActionsProps {}

export default function Actions() {
  const [actionToEdit, setActionToEdit] = React.useState<ActionResponse | null>(
    null
  );
  const [actionToDelete, setActionToDelete] =
    React.useState<ActionResponse | null>(null);
  const queryClient = useQueryClient();

  const {
    isOpen: isEditActionOpen,
    onOpen: onEditActionOpen,
    onOpenChange: onEditActionChange,
  } = useDisclosure();

  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onOpenChange: onDeleteModalChange,
  } = useDisclosure();

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
    if (actionToEdit) {
      onEditActionOpen();
    }
  }, [actionToEdit, onEditActionOpen]);

  const handleDelete = async () => {
    if (actionToDelete) {
      await DefaultService.deleteActionActionsActionIdDelete({
        actionId: actionToDelete.id,
      });
      queryClient.invalidateQueries("actions");
      setActionToDelete(null);
      onDeleteModalChange();
    }
  };

  return (
    <div>
      <EditActionModal
        key={actionToEdit?.id}
        isOpen={isEditActionOpen}
        onOpenChange={onEditActionChange}
        action={actionToEdit}
      />
      <Modal isOpen={isDeleteModalOpen} onOpenChange={onDeleteModalChange}>
        <ModalContent style={{ backgroundColor: "#333333", color: "#fff" }}>
          <ModalHeader>Removing Action</ModalHeader>
          <ModalBody>
            Are you sure you want to delete the action "{actionToDelete?.name}"?
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={onDeleteModalChange}
            >
              Cancel
            </Button>
            <Button color="primary" onPress={handleDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <div className="relative">
        {isLoading && (
          <div className="absolute top-0 left-0 right-0 z-10">
            <Progress isIndeterminate color="primary" className="h-1" />
          </div>
        )}
      </div>
      {isLoading ? (
        <></>
      ) : (
        <UITable
          style={{
            width: "100%",
            tableLayout: "fixed",
          }}
          isHeaderSticky={true}
          className={`dark max-h-[500}]`}
          aria-label="Example static collection table"
        >
          <TableHeader>
            <TableColumn>PATH</TableColumn>
            <TableColumn>NAME</TableColumn>
            <TableColumn>DESCRIPTION</TableColumn>
            <TableColumn>
              <></>
            </TableColumn>
          </TableHeader>
          <TableBody>
            {actions!.map((action) => {
              return (
                <TableRow key={action.id} style={{ color: "white" }}>
                  <TableCell>
                    <Popover placement="bottom">
                      <PopoverTrigger>
                        <p style={{ cursor: "pointer" }} className="truncate">
                          {action.path}
                        </p>
                      </PopoverTrigger>
                      <PopoverContent>
                        <p className="text-wrap px-1 py-2">{action.path}</p>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell>
                    <Popover placement="bottom">
                      <PopoverTrigger>
                        <p style={{ cursor: "pointer" }} className="truncate">
                          {action.name}
                        </p>
                      </PopoverTrigger>
                      <PopoverContent>
                        <p className="text-wrap px-1 py-2">{action.name}</p>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell>
                    <Popover placement="bottom">
                      <PopoverTrigger>
                        <p style={{ cursor: "pointer" }} className="truncate">
                          {action.description}
                        </p>
                      </PopoverTrigger>
                      <PopoverContent>
                        <p className="text-wrap px-1 py-2">
                          {action.description}
                        </p>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell className="flex justify-evenly">
                    <MdModeEditOutline
                      size={20}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        onEditActionOpen();
                        setActionToEdit(action);
                      }}
                    />
                    <div
                      onClick={() => {
                        setActionToDelete(action);
                        onDeleteModalOpen();
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
      )}
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
