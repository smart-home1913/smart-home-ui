import { createContext, useState } from "react";
import { AutomationResponse } from "../client";

interface NotificationContextValue {
  setModalState: (isOpen: boolean) => void;
  isModalOpen: boolean;
  setEditorMode: (isOpen: boolean) => void;
  editorMode: boolean;
  setTab: (key: string) => void;
  tab: string;
  setAutomationToEdit: (automationToEdit: AutomationResponse | null) => void;
  automationToEdit: AutomationResponse | null;
}

// Create a context with the defined shape
export const NotificationContext = createContext<NotificationContextValue>({
  setModalState: () => {},
  isModalOpen: false,
  setEditorMode: () => {},
  editorMode: false,
  setTab: () => {},
  tab: "smartControllers",
  setAutomationToEdit: () => {},
  automationToEdit: null,
});

export const NotificationProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editorMode, setEditorMode] = useState(false);
  const [tab, setTabInternal] = useState("smartControllers");
  const [automationToEdit, setAutomationToEdit] =
    useState<AutomationResponse | null>(null);

  const setModalState = (isOpen: boolean) => {
    setIsModalOpen(isOpen);
  };
  const setTab = (tab: string) => {
    setEditorMode(false);
    setAutomationToEdit(null);
    setTabInternal(tab);
  };

  return (
    <NotificationContext.Provider
      value={{
        isModalOpen,
        setModalState,
        editorMode,
        setEditorMode,
        tab,
        setTab,
        setAutomationToEdit,
        automationToEdit,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
