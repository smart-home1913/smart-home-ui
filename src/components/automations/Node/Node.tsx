import { Card, CardBody } from "@nextui-org/card";
import { Chip } from "@nextui-org/react";
import { memo } from "react";
import { NodeProps, Handle, Position } from "reactflow";
import { ControllerNodeData } from "../automationEditor/AutomationEditor";
import { LightbulbIcon, PowerIcon } from "lucide-react";
import { TemperatureIcon } from "../icons/icons";

const handleStyles = {
  width: "12px",
  height: "12px",
  borderRadius: "50%",
  background: "#784be8",
};

const DeviceNode: React.FC<NodeProps<ControllerNodeData>> = memo(
  ({ data, isConnectable }) => {
    const getIcon = () => {
      switch (data.type) {
        case "light":
          return <LightbulbIcon />;
        case "thermostat":
          return <TemperatureIcon />;
        case "switch":
          return <PowerIcon />;
      }
    };

    return (
      <>
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
          style={{ ...handleStyles, top: "-6px" }}
        />
        <Card
          style={{ zIndex: 1 }}
          className="min-w-[180px] max-w-[280px] bg-content1 dark:bg-content2 border-none"
        >
          <CardBody className="p-3">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">{getIcon()}</div>
              <div className="flex-grow overflow-hidden">
                <p className="text-sm font-semibold truncate">{data.label}</p>
                <p className="text-xs text-default-500 capitalize">
                  {data.type}
                </p>
              </div>
              <Chip color={"success"} size="sm" variant="flat">
                {"ON"}
              </Chip>
            </div>
          </CardBody>
        </Card>
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
          style={{ ...handleStyles, bottom: "-6px" }}
        />
      </>
    );
  }
);

export default DeviceNode;
