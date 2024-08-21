import "./App.css";
import Menu from "./components/navbar/Menu";
import { useDisclosure } from "@nextui-org/react";
import AddSmartControllerModal from "./components/modals/AddSmartControllerModal";
import AddActionModal from "./components/modals/AddActionModal";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Root() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/home");
    }
  }, [navigate, location]);

  const {
    isOpen: isAddSmartControllerOpen,
    onOpen: onAddSmartControllerOpen,
    onOpenChange: onVAddSmartControllerChange,
  } = useDisclosure();
  const {
    isOpen: isAddActionOpen,
    onOpen: onAddActionOpen,
    onOpenChange: onAddActionChange,
  } = useDisclosure();

  return (
    <>
      <AddSmartControllerModal
        isOpen={isAddSmartControllerOpen}
        onOpenChange={onVAddSmartControllerChange}
      />
      <AddActionModal
        isOpen={isAddActionOpen}
        onOpenChange={onAddActionChange}
      />
      <Menu
        onAddSmartControllerOpen={onAddSmartControllerOpen}
        onAddActionOpen={onAddActionOpen}
      />
      <Outlet />
    </>
  );
}

export default Root;
