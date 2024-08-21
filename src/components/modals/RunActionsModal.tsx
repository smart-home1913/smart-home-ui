import * as React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
} from "@nextui-org/react";
import StatusIconComponent from "../status/status";
import "../../index.css";
import { ActionResponse, DefaultService } from "../../client";
import { FaPlay } from "react-icons/fa";
import CircularSlider from "@fseehawer/react-circular-slider";
export interface IRunActionsModalProps {
  isViewOpen: boolean;
  onViewOpenChange: () => void;
  name: string;
  controllerId: string;
  address: string;
  actions: ActionResponse[];
}

export default function RunActionsModal(props: IRunActionsModalProps) {
  const [isSchedule, setIsSchedule] = React.useState(false);
  const [error, setError] = React.useState("");
  const [isSchedulable, setIsSchedulable] = React.useState(false);
  const [action, setAction] = React.useState<string | null>("");
  const [scheduleInMinutes, setScheduleInMinutes] = React.useState<
    number | null
  >(null);

  React.useEffect(() => {
    if (isSchedule) {
      setScheduleInMinutes(20);
    } else {
      setScheduleInMinutes(null);
    }
  }, [isSchedule]);

  React.useEffect(() => {
    setIsSchedulable(
      props.actions.find((a: ActionResponse) => a.id == action)
        ?.opposite_action_id != ""
    );
  }, [props.actions, action]);

  const actionItems = React.useMemo(
    () =>
      props.actions.map((action) => ({
        value: action.id,
        label: action.name,
      })),
    [props.actions]
  );

  const handleSelectionChange =
    () => (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value === "" ? null : e.target.value;
      setError("");
      setAction(value);
    };

  const resetForm = () => {
    setError("");
    setAction(null);
    setIsSchedulable(true);
    setIsSchedule(false);
    setScheduleInMinutes(null);
  };

  React.useEffect(() => {
    if (props.isViewOpen) {
      resetForm();
    }
  }, [props.isViewOpen]);

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
        base: "min-h-[500px] max-h-[535px]",
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
            <ModalBody style={{ backgroundColor: "#333333" }}>
              <div className="flex flex-col">
                <div className="flex justify-between min-h-[80px]">
                  <Select
                    errorMessage={error}
                    size="sm"
                    label="Action"
                    className="mr-4"
                    isInvalid={error !== ""}
                    selectedKeys={action ? [action] : []}
                    onChange={handleSelectionChange()}
                    items={actionItems}
                  >
                    {(item) => (
                      <SelectItem key={item.value}>{item.label}</SelectItem>
                    )}
                  </Select>
                  <Button
                    color="primary"
                    className="min-w-[120px]"
                    isDisabled={!isSchedulable}
                    onClick={() => setIsSchedule(!isSchedule)}
                  >
                    {isSchedule ? "Scheduled Run" : "Regular"}
                  </Button>
                </div>
                <div className="self-center mt-12 mb-6">
                  {isSchedule ? (
                    <CircularSlider
                      label="Minutes"
                      min={1}
                      max={240}
                      width={200}
                      dataIndex={19}
                      useMouseAdditionalToTouch
                      onChange={setScheduleInMinutes}
                      labelColor="#fff"
                      labelBottom={true}
                      knobColor="#005a58"
                      knobSize={52}
                      progressColorFrom="#215f00"
                      progressColorTo="#215f00"
                      progressSize={15}
                      trackColor="#eeeeee"
                      trackSize={15}
                    >
                      <FaPlay
                        color="#6cc070"
                        x="20"
                        y="17"
                        width="28px"
                        height="28px"
                      />
                    </CircularSlider>
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
            </ModalBody>
            <ModalFooter
              className="flex justify-between"
              style={{ backgroundColor: "#333333" }}
            >
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
              <Button style={{ backgroundColor: "#6cc070" }} onPress={run}>
                <FaPlay size={18} color="#fff" />
                <p style={{ color: "#fff" }}>RUN</p>
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );

  function run() {
    if (action === null) {
      setError("Please select action");
      return;
    }
    DefaultService.runActionActionsRunControllerIdActionIdGet({
      actionId: action!,
      controllerId: props.controllerId,
      minutesToRunOpposite:
        scheduleInMinutes !== null ? +scheduleInMinutes : null,
    });
    props.onViewOpenChange();
  }
}
