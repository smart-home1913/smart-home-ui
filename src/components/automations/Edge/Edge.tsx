import { EdgeProps, getBezierPath } from "reactflow";
import { ConditionType, Operator, ValueType } from "../models";

export interface ConditionEdgeData {
  conditionType: ConditionType;
  valueType: ValueType;
  operator: Operator;
  valueNumber: number | null;
  valueBoolean: boolean | null;
  isLoop: boolean;
}

export interface CustomEdgeData {
  type: "data" | "control" | "power";
  status: "active" | "inactive";
  condition: ConditionEdgeData;
}

const CustomEdge: React.FC<EdgeProps<CustomEdgeData>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style = {},
  markerEnd,
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const getEdgeColor = () => {
    switch (data?.type) {
      case "data":
        return "#3498db"; // blue
      case "control":
        return "#e74c3c"; // red
      case "power":
        return "#f1c40f"; // yellow
      default:
        return "#95a5a6"; // gray
    }
  };

  const getDashArray = () => {
    return data?.status === "active" ? "0" : "5,5";
  };
  return (
    <>
      <path
        id={id}
        style={{
          ...style,
          strokeWidth: 2,
          stroke: getEdgeColor(),
          strokeDasharray: getDashArray(),
        }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
    </>
  );
};

export default CustomEdge;
