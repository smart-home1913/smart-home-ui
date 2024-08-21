import * as React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tabs,
  Tab,
} from "@nextui-org/react";
import { FaClock, FaPlay } from "react-icons/fa6";
import ActionsTable from "../tables/ActionsTable";
import SchedulingsTable from "../tables/SchedulingsTable";
import StatusIconComponent from "../status/status";
import "../../index.css";
import { ActionResponse, TaskResponse } from "../../client";
import useSwipe from "../../hooks/UseSwipe";
export interface IViewModalProps {
  isViewOpen: boolean;
  onViewOpenChange: () => void;
  name: string;
  address: string;
  tasks: TaskResponse[];
  actions: ActionResponse[];
  refresh: (key: string) => void;
}

export default function ViewModal(props: IViewModalProps) {
  const [tab, setTab] = React.useState<string>("smartControllers");

  const swipeHandlers = useSwipe({
    onSwipedLeft: () => setTab("actions"),
    onSwipedRight: () => setTab("schedulings"),
  });

  return (
    <Modal
      {...swipeHandlers}
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
              <div
                style={{ color: "#fff" }}
                className="absolute z-10 right-8 top-8"
              >
                <StatusIconComponent status="running" />
              </div>
              <p className="text-tiny text-white/60 uppercase font-bold">
                {props.address}
              </p>
              <h4 className="text-white font-medium text-2xl">{props.name}</h4>
            </ModalHeader>
            <ModalBody
              style={{ backgroundColor: "#333333", padding: "0px 3px" }}
            >
              <div className="flex w-full flex-col">
                <Tabs
                  selectedKey={tab}
                  aria-label="Options"
                  onSelectionChange={(key: React.Key) => setTab(key as string)}
                  color="primary"
                  variant="bordered"
                  style={{ backgroundColor: "#333333" }}
                  className="sticky top-0 z-10"
                  fullWidth
                >
                  <Tab
                    key="schedulings"
                    title={
                      <div className="flex items-center space-x-2">
                        <FaClock />
                        <span>Schedulings</span>
                      </div>
                    }
                  >
                    <div style={{ padding: "0 7px" }}>
                      <p
                        className="text-small text-default-500"
                        style={{
                          marginBottom: "10px",
                          fontWeight: 700,
                          color: "#a1a1aa",
                        }}
                      >
                        SCHEDULING:
                      </p>
                      <SchedulingsTable
                        maxHeight={500}
                        tasks={props.tasks}
                        refresh={props.refresh}
                      />
                    </div>
                  </Tab>
                  <Tab
                    key="actions"
                    title={
                      <div className="flex items-center space-x-2">
                        <FaPlay />
                        <span>Actions</span>
                      </div>
                    }
                  >
                    <div style={{ padding: "0 7px" }}>
                      <p
                        className="text-small text-default-500"
                        style={{
                          marginBottom: "10px",
                          fontWeight: 700,
                          color: "#a1a1aa",
                        }}
                      >
                        ACTIONS:
                      </p>
                      <ActionsTable actions={props.actions} maxHeight={500} />
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </ModalBody>
            <ModalFooter
              className="bg-gradient-to-t from-black/10 to-transparent"
              style={{ backgroundColor: "#333333" }}
            >
              <Button color="primary" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
