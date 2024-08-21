import "./App.css";
import SmartControllerCard from "./components/card/Card";
import { DefaultService } from "./client/services.gen";
import { useContext } from "react";
import { Key } from "@react-types/shared";

import { Spinner, Tabs, Tab } from "@nextui-org/react";
import { IoTerminal } from "react-icons/io5";
import { BsLightningChargeFill } from "react-icons/bs";
import useSwipe from "./hooks/UseSwipe";
import { NotificationContext } from "./hooks/context";
import { useQuery, useQueryClient } from "react-query";
import Automations from "./components/automations/Automations";
function App() {
  const { isModalOpen, tab, setTab } = useContext(NotificationContext);
  const queryClient = useQueryClient();
  const swipeHandlers = useSwipe({
    onSwipedLeft: () => setTab("automations"),
    onSwipedRight: () => setTab("smartControllers"),
  });

  const refresh = (key: string) => {
    queryClient.invalidateQueries(key);
  };
  const { data: smartControllers, isLoading: isLoadingSmartControllers } =
    useQuery(
      "smartControllers",
      DefaultService.getSmartControllersSmartControllersGet
    );

  const { data: tasks } = useQuery("tasks", DefaultService.getTasksTasksGet);
  return (
    <>
      <div className="flex w-full h-full flex-col grow">
        <Tabs
          selectedKey={tab}
          onSelectionChange={(key: Key) => setTab(key as string)}
          aria-label="Options"
          color="primary"
          variant="bordered"
          fullWidth
        >
          <Tab
            key="smartControllers"
            title={
              <div className="flex items-center space-x-2">
                <IoTerminal />
                <span>Smart Controllers</span>
              </div>
            }
          >
            <div
              onTouchStart={isModalOpen ? () => {} : swipeHandlers.onTouchStart}
              onTouchMove={isModalOpen ? () => {} : swipeHandlers.onTouchMove}
              onTouchEnd={isModalOpen ? () => {} : swipeHandlers.onTouchEnd}
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "space-around",
                flexWrap: "wrap",
              }}
            >
              {isLoadingSmartControllers ? (
                <Spinner className="fixed inset-0 flex items-center justify-center" />
              ) : (
                <div className="flex flex-wrap justify-center">
                  {mapControllers()}
                </div>
              )}
            </div>
          </Tab>
          <Tab
            key="automations"
            className="p-0"
            title={
              <div className="flex items-center space-x-2">
                <BsLightningChargeFill />
                <span>Automations</span>
              </div>
            }
          >
            <div
              className=""
              onTouchStart={isModalOpen ? () => {} : swipeHandlers.onTouchStart}
              onTouchMove={isModalOpen ? () => {} : swipeHandlers.onTouchMove}
              onTouchEnd={isModalOpen ? () => {} : swipeHandlers.onTouchEnd}
              style={{
                width: "100%",
              }}
            >
              <Automations />
            </div>
          </Tab>
        </Tabs>
      </div>
    </>
  );

  function mapControllers() {
    return smartControllers?.map((controller) => {
      const smartControllerTasks = tasks
        ? tasks.filter((task) => task.smart_controller.id == controller.id)
        : [];
      return (
        <SmartControllerCard
          refresh={refresh}
          key={controller.id}
          id={controller.id}
          name={controller.name}
          address={controller.address}
          actions={controller.actions ? controller.actions : []}
          tasks={smartControllerTasks}
        />
      );
    });
  }
}

export default App;
