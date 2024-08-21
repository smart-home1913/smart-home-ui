import {
  useDisclosure,
  Navbar,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { useCallback, useContext, useEffect, useState } from "react";
import ReactFlow, {
  Node,
  Edge,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
  useOnSelectionChange,
  BackgroundVariant,
  EdgeTypes,
  NodeDragHandler,
  NodeTypes,
  ReactFlowInstance,
  useReactFlow,
} from "reactflow";

import "reactflow/dist/style.css";
import { useQuery, useQueryClient } from "react-query";
import {
  AutomationEdgeResponse,
  AutomationNodeResponse,
  AutomationResponse,
  DefaultService,
  SmartControllerResponse,
} from "../../../client";
import { NotificationContext } from "../../../hooks/context";
import CustomEdge from "../Edge/Edge";
import EdgeModal from "../modals/EdgeModal";
import DeviceNode from "../Node/Node";
import DebouncedInput from "../../debounceInput/DebounceInput";
// import { Node, Edge } from "@xyflow/react";
import { IOSSquarePlusIcon, IOSExitIcon } from "../icons/icons";
import NodeModal from "../modals/NodeModal";

const nodeTypes: NodeTypes = {
  device: DeviceNode,
};

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

export interface ControllerNodeData {
  id: string;
  label: string;
  type: string;
  actionId: string;
}

const toFlowNode = (
  smartControllers: SmartControllerResponse[],
  node: AutomationNodeResponse
): Node | null => {
  const smartController = smartControllers!.find((controller) => {
    return controller.id === node.smart_controller_id;
  });

  if (!smartController) {
    return null;
  }

  const action = smartController.actions!.find((action) => {
    return action.id === node.action_id;
  });

  if (!action) {
    return null;
  }
  const nodeData: Record<string, unknown> = {
    id: node.unique_key,
    actionId: node.action_id,
    label: smartController.name,
    type: action.name,
  };
  return {
    id: `${node.smart_controller_id};${node.action_id}`,
    type: "device",
    position: node.location,
    data: nodeData,
  };
};

function toFlowEdge(edge: AutomationEdgeResponse): Edge {
  return {
    id: `${edge.source.smart_controller_id};${edge.source.action_id}->${edge.target.smart_controller_id};${edge.target.action_id}`,
    source: `${edge.source.smart_controller_id};${edge.source.action_id}`,
    target: `${edge.target.smart_controller_id};${edge.target.action_id}`,
    label: "",
    type: "custom",
    data: { status: "active", type: "power", ...edge.condition },
  };
}

const init = (
  automationToEdit: AutomationResponse,
  smartControllers: SmartControllerResponse[]
) => {
  if (!automationToEdit) {
    throw new Error("useGraphContext must be used within a GraphProvider");
  }
  return {
    nodes:
      automationToEdit!.nodes
        .map((node) => toFlowNode(smartControllers, node))
        .filter((node) => node !== null) || [],
    edges: automationToEdit!.edges.map((edge) => toFlowEdge(edge)) || [],
    viewport: { x: 0, y: 0, zoom: 1 },
  };
};

const AutomationEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const queryClient = useQueryClient();

  const [connection, setConnection] = useState<Connection | null>(null);
  const { setViewport } = useReactFlow();
  const [selectedElements, setSelectedElements] = useState<(Node | Edge)[]>([]);
  const [, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [initiated, setInitiated] = useState(false);
  const {
    setModalState,
    setEditorMode,
    automationToEdit,
    setAutomationToEdit,
  } = useContext(NotificationContext);

  useOnSelectionChange({
    onChange: ({ nodes, edges }) => setSelectedElements([...nodes, ...edges]),
  });

  const onDeleteNode = useCallback(
    async (id: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== id));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== id && edge.target !== id)
      );
      await DefaultService.deleteNodeAutomationsAutomationIdNodesUniqueKeyDelete(
        {
          automationId: automationToEdit!.id,
          uniqueKey: `${automationToEdit?.id};${id}`,
        }
      );
    },
    [setNodes, setEdges, automationToEdit]
  );

  const onDeleteEdge = useCallback(
    (id: string) => {
      setEdges((eds) => eds.filter((edge) => edge.id !== id));
    },
    [setEdges]
  );

  useEffect(() => {
    setNodes([]);
    setEdges([]);
    setInitiated(false);
    setViewport({ x: 0, y: 0, zoom: 1 });
  }, [automationToEdit, setEdges, setNodes, setViewport]);

  const { data: smartControllers, isLoading: isLoadingSmartControllers } =
    useQuery(
      "smartControllers",
      DefaultService.getSmartControllersSmartControllersGet,
      {
        onSuccess: (data) => {
          if (automationToEdit && !initiated) {
            const { nodes, edges, viewport } = init(automationToEdit!, data);
            if (nodes !== null) {
              const nodesWithoutNull = nodes.filter(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (node): node is Node<any, string | undefined> => node !== null
              );

              setNodes(nodesWithoutNull);
            }
            setEdges(edges);
            setViewport(viewport);
            setInitiated(true);
          }
        },
      }
    );

  const {
    isOpen: isNodeModalOpen,
    onOpen: onNodeModalOpen,
    onOpenChange: onNodeModalOpenChange,
  } = useDisclosure();
  const {
    isOpen: isEdgeModalOpen,
    onOpen: onEdgeModalOpen,
    onOpenChange: onEdgeModalOpenChange,
  } = useDisclosure();

  useEffect(() => {
    setModalState(true);
    return () => {
      setModalState(false);
    };
  }, [setModalState]);

  const [dimensions, setDimensions] = useState({
    width: "99%",
    height: "85vh",
  });

  const onConnect = useCallback(
    (params: Connection) => {
      setConnection(params);
      onEdgeModalOpen();
    },
    [onEdgeModalOpen]
  );

  useEffect(() => {
    const updateDimensions = () => {
      const navbarHeight = 156;
      setDimensions({
        width: window.innerWidth.toString(),
        height: (window.innerHeight - navbarHeight).toString(),
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nodeAdder = (node: any) => {
    setNodes((nds) => [...nds, node]);
    queryClient.invalidateQueries("nodes");
  };

  const onNodeDragStop: NodeDragHandler = useCallback(
    (_event, node) => {
      DefaultService.updateNodeAutomationsAutomationIdNodesPut({
        automationId: automationToEdit!.id,
        requestBody: {
          action_id: node.data.actionId,
          location: node.position,
          smart_controller_id: node.id.split(";")[0],
        },
      });
    },
    [automationToEdit]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Delete" || event.key === "Backspace") {
        selectedElements.forEach((elem) => {
          if ("source" in elem) {
            onDeleteEdge(elem.id);
          } else {
            onDeleteNode(elem.id);
          }
        });
      }
    },
    [selectedElements, onDeleteNode, onDeleteEdge]
  );

  return (
    <div className="flex flex-col" tabIndex={0} onKeyDown={handleKeyDown}>
      <Navbar
        maxWidth="full"
        isBordered
        className="flex justify-between bg-gray-900"
      >
        <label>Name:</label>

        <DebouncedInput
          color={automationToEdit ? "default" : "danger"}
          className="max-w-[350px]"
          debounceTime={automationToEdit ? 300 : 2000}
          value={automationToEdit?.name || ""}
          onChange={async (value: string) => await handleNameInput(value)}
        />

        <NavbarContent justify="end">
          <NavbarItem className="flex justify-between">
            <IOSSquarePlusIcon
              disabled={automationToEdit === null}
              size={35}
              onClick={onNodeModalOpen}
            />
            <IOSExitIcon size={35} onClick={() => setEditorMode(false)} />
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <div style={{ width: dimensions.width, height: dimensions.height }}>
        <ReactFlow
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          nodes={nodes}
          onNodeDoubleClick={(_event: React.MouseEvent, node: Node) => {
            onDeleteNode(node.id);
          }}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeDragStop={onNodeDragStop}
          onConnect={onConnect}
          onInit={setRfInstance}
          fitView
        >
          <Background variant={BackgroundVariant.Lines} lineWidth={0.1} />
        </ReactFlow>
      </div>
      <NodeModal
        isLoadingSmartControllers={isLoadingSmartControllers}
        isNodeModalOpen={isNodeModalOpen}
        onNodeModalOpenChange={onNodeModalOpenChange}
        nodeAdder={nodeAdder}
        smartControllers={smartControllers!}
      />

      <EdgeModal
        isEdgeModalOpen={isEdgeModalOpen}
        onEdgeModalOpenChange={onEdgeModalOpenChange}
        setEdges={setEdges}
        edges={edges}
        connection={connection!}
      />
    </div>
  );

  async function handleNameInput(value: string) {
    if (automationToEdit) {
      await DefaultService.updateAutomationAutomationsAutomationIdPut({
        automationId: automationToEdit!.id,
        requestBody: {
          name: value,
          is_active: automationToEdit!.is_active,
          viewport: automationToEdit!.viewport!,
        },
      });
    } else {
      const automation = await DefaultService.createAutomationAutomationsPost({
        requestBody: {
          name: value,
        },
      });
      setAutomationToEdit(automation);
    }
  }
};

export default AutomationEditor;
