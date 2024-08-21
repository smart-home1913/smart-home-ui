import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  useDisclosure,
  Button,
  Progress,
} from "@nextui-org/react";
import StatusIconComponent from "../status/status";
import "../../index.css";
import {
  ActionResponse,
  DefaultService,
  TaskRequest,
  TaskResponse,
  TaskType,
} from "../../client";
import ViewModal from "../modals/ViewModal";
import RunActionsModal from "../modals/RunActionsModal";
import EditSmartControllerModal from "../modals/EditSmartControllerModal";
import { useState, useEffect, useContext } from "react";
import { NotificationContext } from "../../hooks/context";
import ScheduleModal, { TimeSelection } from "../modals/ScheduleModal";

interface CardProps {
  name: string;
  address: string;
  tasks: TaskResponse[];
  actions: ActionResponse[];
  id: string;
  refresh: (key: string) => void;
}

type SensorResults = {
  name: string;
  id: string;
  result: number;
};

export default function SmartControllerCard(props: CardProps) {
  const [results, setResults] = useState<SensorResults[]>([]);
  const { setModalState } = useContext(NotificationContext);

  useEffect(() => {
    async function readSensors() {
      const res = Promise.all(
        props.actions
          .filter((action) => action.is_sensor)
          .map(async (sensor) => {
            const res =
              await DefaultService.runActionActionsRunControllerIdActionIdGet({
                actionId: sensor.id,
                controllerId: props.id,
                minutesToRunOpposite: null,
              });
            const result: SensorResults = {
              name: sensor.name,
              id: sensor.id,
              result: res,
            };
            return result;
          })
      );
      setResults(await res);
    }
    const timer = setInterval(async () => await readSensors(), 5000);

    return () => clearTimeout(timer);
  }, [props.actions, props.id]);

  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onOpenChange: onViewOpenChange,
  } = useDisclosure();
  const {
    isOpen: isRunModalOpen,
    onOpen: onRunModalOpen,
    onOpenChange: onRunModalOpenChange,
  } = useDisclosure();
  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onOpenChange: onEditModalOpenChange,
  } = useDisclosure();
  const {
    isOpen: isScheduleModalOpen,
    onOpen: onScheduleModalOpen,
    onOpenChange: onScheduleModalOpenChange,
  } = useDisclosure();

  useEffect(() => {
    setModalState(
      isViewOpen || isRunModalOpen || isEditModalOpen || isScheduleModalOpen
    );
  }, [isViewOpen, isRunModalOpen, isEditModalOpen, isScheduleModalOpen]);

  return (
    <>
      <ViewModal
        refresh={props.refresh}
        isViewOpen={isViewOpen}
        onViewOpenChange={onViewOpenChange}
        name={props.name}
        address={props.address}
        tasks={props.tasks}
        actions={props.actions}
      />
      <RunActionsModal
        isViewOpen={isRunModalOpen}
        onViewOpenChange={onRunModalOpenChange}
        name={props.name}
        controllerId={props.id}
        address={props.address}
        actions={props.actions}
      />
      <EditSmartControllerModal
        isViewOpen={isEditModalOpen}
        onViewOpenChange={onEditModalOpenChange}
        name={props.name}
        address={props.address}
        actions={props.actions}
        refresh={props.refresh}
        id={props.id}
      />
      <ScheduleModal
        actions={props.actions}
        isOpen={isScheduleModalOpen}
        onOpenChange={onScheduleModalOpenChange}
        onSave={async (selection: TimeSelection) => {
          const request: TaskRequest = {
            type: selection.frequency as TaskType,
            action_id: selection.selectedActionResponse!,
            smart_controller_id: props.id,
            minute: +selection.minute!,
            hour: +selection.hour!,
            week_day: +selection.dayOfWeek!,
            month_day: +selection.dayOfMonth!,
          };
          DefaultService.createTaskTasksPost({ requestBody: request });
        }}
      />
      <Card
        className="min-w-[300px] max-w-[300px] min-h-[350px] max-h-[350px]"
        style={{ backgroundColor: "#333333", margin: "2rem" }}
      >
        <div style={{}} className="absolute z-10 right-4 top-4">
          <StatusIconComponent status="running" />
        </div>
        <CardHeader className="flex-col items-start p-5 bg-gradient-to-b from-black/20 to-transparent">
          <p className="text-tiny text-white/60 uppercase font-bold">
            {props.address}
          </p>
          <h4 className="text-white font-medium text-2xl">{props.name}</h4>
        </CardHeader>

        <CardBody>
          {results.map((b) => {
            return (
              <div key={b.id}>
                <p>{b.name}</p>
                <NumberSensor value={b.result} />
              </div>
            );
          })}
          <br />
        </CardBody>
        <CardFooter
          className="flex gap-3 min-h-[45px] max-h-[45px] bg-gradient-to-t from-black/10 to-transparent"
          style={{
            justifyContent: "space-around",
          }}
        >
          <Button
            isIconOnly
            variant="light"
            aria-label="Edit"
            onClick={onEditModalOpen}
          >
            <EditIcon />
          </Button>
          <Button
            isIconOnly
            isDisabled={props.actions.length === 0}
            variant="light"
            aria-label="View"
            onClick={onScheduleModalOpen}
          >
            <ScheduleIcon />
          </Button>
          <Button
            isDisabled={props.actions.length === 0}
            isIconOnly
            variant="light"
            aria-label="Run"
            onClick={onRunModalOpen}
          >
            <RunIcon />
          </Button>
          <Button
            isIconOnly
            variant="light"
            aria-label="View"
            onClick={onViewOpen}
          >
            <ViewIcon />
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

// Icon components
const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

const RunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ViewIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const ScheduleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const NumberSensor: React.FC<{ value: number; unit?: string }> = ({
  value,
  unit,
}) => {
  const percentage = Math.min(Math.max(value, 0), 100);
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-2xl font-bold">{value.toFixed(1)}</span>
        {unit && <span className="text-sm text-gray-500">{unit}</span>}
      </div>
      <Progress
        color="primary"
        value={percentage}
        className="h-2"
        aria-label={`${value} ${unit || ""}`}
      />
    </div>
  );
};
