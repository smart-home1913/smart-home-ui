import React from "react";
import styled, { keyframes } from "styled-components";

const pulseAnimation = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.7;
  }
`;

interface StatusIconProps {
  status: "running" | "stopped";
}

const StatusIcon = styled.div<StatusIconProps>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.status === "running" ? "#3FB950" : "#FF7B72"};
  animation: ${(props) =>
      props.status === "running" ? pulseAnimation : "none"}
    1s infinite;
`;

const StatusText = styled.span`
  margin-left: 8px;
  margin-right: 10px;
  font-weight: 500;
  font-size: 14px;
  font-family: "Rubik", sans-serif;
  font-optical-sizing: auto;
  font-weight: 500;
  font-style: normal;
`;

const StatusIndicator: React.FC<StatusIconProps> = ({ status }) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <StatusIcon status={status} />
      <StatusText>{status === "running" ? "ALIVE" : "IDLE"}</StatusText>
    </div>
  );
};

export default StatusIndicator;
