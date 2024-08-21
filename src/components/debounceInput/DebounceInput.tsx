import React, { useState, useCallback, useRef, useEffect } from "react";
import { Input, InputProps, Spinner } from "@nextui-org/react";
import { Check } from "lucide-react";

interface DebouncedInputProps extends Omit<InputProps, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  debounceTime?: number;
}

const DebouncedInput: React.FC<DebouncedInputProps> = ({
  value: initialValue,
  onChange,
  debounceTime = 300,
  ...props
}) => {
  const [value, setValue] = useState<string>(initialValue);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const timeoutRef = useRef<number | null>(null);
  const saveTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const debouncedOnChange = useCallback(
    (newValue: string) => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }

      setIsSaving(true);

      timeoutRef.current = window.setTimeout(() => {
        onChange(newValue);
        timeoutRef.current = null;

        // Set a timeout to hide the save animation after 1 second
        if (saveTimeoutRef.current !== null) {
          window.clearTimeout(saveTimeoutRef.current);
        }
        saveTimeoutRef.current = window.setTimeout(() => {
          setIsSaving(false);
          saveTimeoutRef.current = null;
        }, 1000);
      }, debounceTime);
    },
    [onChange, debounceTime]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedOnChange(newValue);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
      if (saveTimeoutRef.current !== null) {
        window.clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex grow items-center space-x-2">
      <Input
        {...props}
        value={value}
        onChange={handleChange}
        className="max-w-[350px] flex-grow"
      />
      {isSaving && (
        <div className="flex-shrink-0">
          {timeoutRef.current !== null ? (
            <Spinner size="sm" color="success" />
          ) : (
            <Check className="text-success" size={20} />
          )}
        </div>
      )}
    </div>
  );
};

export default DebouncedInput;
