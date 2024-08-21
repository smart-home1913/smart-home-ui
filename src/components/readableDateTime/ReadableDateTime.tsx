import React from "react";

interface ReadableDateTimeProps {
  isoString: string;
  locale?: string;
  dateStyle?: "full" | "long" | "medium" | "short";
  timeStyle?: "full" | "long" | "medium" | "short";
}

const ReadableDateTime: React.FC<ReadableDateTimeProps> = ({
  isoString,
  locale = "he-IL",
  dateStyle = "short",
  timeStyle = "short",
}) => {
  const date = new Date(isoString);

  const formattedDate = new Intl.DateTimeFormat(locale, {
    dateStyle: dateStyle,
    timeStyle: timeStyle,
    // timeZone: "UTC",
  }).format(date);

  return <span>{formattedDate}</span>;
};

export default ReadableDateTime;
