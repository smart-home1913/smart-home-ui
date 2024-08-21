import React, { useEffect, useMemo, useState } from "react";
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
import { ActionResponse } from "../../client";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const daysOfMonth = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
const hours = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, "0")
);
const minutes = Array.from({ length: 60 }, (_, i) =>
  i.toString().padStart(2, "0")
);
const frequencies = ["daily", "weekly", "monthly"];

interface ScheduleModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (time: TimeSelection) => void;
  actions: ActionResponse[];
}

const defaultTimeSelection: TimeSelection = {
  minute: null,
  hour: null,
  dayOfWeek: null,
  dayOfMonth: null,
  frequency: null,
  selectedActionResponse: null,
  smartControllerId: "",
};

export interface TimeSelection {
  minute: string | null;
  hour: string | null;
  dayOfWeek: number | null;
  dayOfMonth: string | null;
  frequency: string | null;
  selectedActionResponse: string | null;
  smartControllerId: string;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onOpenChange,
  onSave,
  actions,
}) => {
  const [selectedTime, setSelectedTime] =
    useState<TimeSelection>(defaultTimeSelection);
  const resetForm = () => {
    setSelectedTime(defaultTimeSelection);
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleSave = () => {
    onSave(selectedTime);
    onOpenChange(false);
  };

  const handleSelectionChange =
    (field: keyof TimeSelection) =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value === "" ? null : e.target.value;
      if (field === "dayOfWeek") {
        const numericValue = value === null ? null : daysOfWeek.indexOf(value);
        setSelectedTime((prev) => ({ ...prev, [field]: numericValue }));
      } else {
        setSelectedTime((prev) => ({ ...prev, [field]: value }));
      }
    };

  const minuteItems = useMemo(
    () => minutes.map((minute) => ({ value: minute, label: minute })),
    []
  );

  const hourItems = useMemo(
    () => hours.map((hour) => ({ value: hour, label: hour })),
    []
  );

  const dayOfWeekItems = useMemo(
    () => daysOfWeek.map((day) => ({ value: day, label: day })),
    []
  );

  const dayOfMonthItems = useMemo(
    () => daysOfMonth.map((day) => ({ value: day, label: day })),
    []
  );

  const frequencyItems = useMemo(
    () =>
      frequencies.map((freq) => ({
        value: freq,
        label: freq.charAt(0).toUpperCase() + freq.slice(1),
      })),
    []
  );

  const actionResponseItems = useMemo(
    () =>
      actions.map((action) => ({
        value: action.id,
        label: action.name,
      })),
    [actions]
  );

  return (
    <Modal
      classNames={{
        base: "min-h-[350px]",
      }}
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          resetForm();
        }
        onOpenChange(open);
      }}
      placement="center"
    >
      <ModalContent style={{ backgroundColor: "#333333" }}>
        {(onClose) => (
          <>
            <ModalHeader
              style={{ color: "#fff" }}
              className="flex flex-col gap-1"
            >
              Schedule action
            </ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Action"
                  selectedKeys={
                    selectedTime.selectedActionResponse
                      ? [selectedTime.selectedActionResponse]
                      : []
                  }
                  onChange={handleSelectionChange("selectedActionResponse")}
                  items={actionResponseItems}
                >
                  {(item) => (
                    <SelectItem key={item.value}>{item.label}</SelectItem>
                  )}
                </Select>
                <Select
                  label="Frequency"
                  selectedKeys={
                    selectedTime.frequency ? [selectedTime.frequency] : []
                  }
                  onChange={handleSelectionChange("frequency")}
                  items={frequencyItems}
                >
                  {(item) => (
                    <SelectItem key={item.value}>{item.label}</SelectItem>
                  )}
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Hour"
                  selectedKeys={selectedTime.hour ? [selectedTime.hour] : []}
                  onChange={handleSelectionChange("hour")}
                  items={hourItems}
                >
                  {(item) => (
                    <SelectItem key={item.value}>{item.label}</SelectItem>
                  )}
                </Select>
                <Select
                  label="Minute"
                  selectedKeys={
                    selectedTime.minute ? [selectedTime.minute] : []
                  }
                  onChange={handleSelectionChange("minute")}
                  items={minuteItems}
                >
                  {(item) => (
                    <SelectItem key={item.value}>{item.label}</SelectItem>
                  )}
                </Select>
                <Select
                  label="Day of Week"
                  selectedKeys={
                    selectedTime.dayOfWeek !== null
                      ? [daysOfWeek[selectedTime.dayOfWeek]]
                      : []
                  }
                  onChange={handleSelectionChange("dayOfWeek")}
                  items={dayOfWeekItems}
                  isDisabled={selectedTime.frequency !== "weekly"}
                >
                  {(item) => (
                    <SelectItem key={item.value}>{item.label}</SelectItem>
                  )}
                </Select>
                <Select
                  label="Day of Month"
                  selectedKeys={
                    selectedTime.dayOfMonth ? [selectedTime.dayOfMonth] : []
                  }
                  onChange={handleSelectionChange("dayOfMonth")}
                  items={dayOfMonthItems}
                  isDisabled={selectedTime.frequency !== "monthly"}
                >
                  {(item) => (
                    <SelectItem key={item.value}>{item.label}</SelectItem>
                  )}
                </Select>
              </div>
            </ModalBody>
            <ModalFooter className="flex justify-between">
              <Button color="danger" variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleSave}>
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ScheduleModal;
