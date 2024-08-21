import React, { useContext } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/react";
import { FaHome } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { NotificationContext } from "../../hooks/context";
import { useNavigate } from "react-router-dom";
export interface IMenuProps {
  onAddSmartControllerOpen: () => void;
  onAddActionOpen: () => void;
}

export default function Menu(props: IMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";
  const { setEditorMode, setTab, setAutomationToEdit } =
    useContext(NotificationContext);
  const navigate = useNavigate();

  return (
    <Navbar
      className="justify-start"
      maxWidth="full"
      isMenuOpen={isMenuOpen}
      classNames={{
        menu: "z-50",
      }}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="max-w-[100px]">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand style={{ display: "flex", alignItems: "center" }}>
          <FaHome style={{ marginRight: "5px", marginBottom: "2px" }} />
          <Link href="/" className="font-bold text-inherit">
            ARIEL
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="justify-end hidden sm:flex gap-4">
        <NavbarItem>
          <Link style={{ color: "#fff" }} href="/actions">
            Actions
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            style={{ color: "#fff", cursor: "pointer" }}
            onClick={() => {
              setEditorMode(false);
              setAutomationToEdit(null);
              navigate("/home");
              setTab("automations");
              setIsMenuOpen(false);
            }}
          >
            Automations
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Dropdown
            showArrow
            classNames={{
              base: "before:bg-default-900",
              content: "py-1 px-1 border border-default-800 bg-default-900",
            }}
          >
            <DropdownTrigger>
              <Button
                style={{ backgroundColor: "#0070f0" }}
                className="hover:bg-default-800"
              >
                <IoMdAdd className={"text-white"} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              variant="flat"
              aria-label="Dropdown menu with description"
              className="bg-default-900 text-default-300"
            >
              <DropdownSection title="Add" className="text-default-400">
                <DropdownItem
                  key="new_sm"
                  description="Add New Smart Controller"
                  onClick={props.onAddSmartControllerOpen}
                  startContent={
                    <IoMdAdd className={`${iconClasses} text-default-500`} />
                  }
                  className="data-[hover=true]:bg-default-300"
                >
                  Add Smart Controller
                </DropdownItem>
                <DropdownItem
                  key="new_ac"
                  onClick={props.onAddActionOpen}
                  description="Add New Action"
                  startContent={
                    <IoMdAdd className={`${iconClasses} text-default-500`} />
                  }
                  className="data-[hover=true]:bg-default-300"
                >
                  Add Action
                </DropdownItem>
                <DropdownItem
                  key="new_au"
                  description="Add New Automation"
                  onClick={() => {
                    setAutomationToEdit(null);
                    setTab("automations");
                    setEditorMode(true);
                    navigate("/home");
                  }}
                  startContent={
                    <IoMdAdd className={`${iconClasses} text-default-500`} />
                  }
                  className="data-[hover=true]:bg-default-300"
                >
                  Add Automation
                </DropdownItem>
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu style={{ backgroundColor: "#000" }}>
        <NavbarMenuItem key="actions">
          <Link style={{ color: "#fff" }} href="/actions">
            Actions
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem key="automations">
          <Link
            style={{ color: "#fff", cursor: "pointer" }}
            onClick={() => {
              setIsMenuOpen(false);
              setEditorMode(false);
              setAutomationToEdit(null);
              navigate("/home");
              setTab("automations");
            }}
          >
            Automations
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
