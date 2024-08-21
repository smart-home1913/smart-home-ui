import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import { NotificationProvider } from "./hooks/context.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./Root.tsx";
import Actions from "./routes/Actions.tsx";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactFlowProvider } from "reactflow";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="flex w-full flex-col grow">
        <Root />
      </div>
    ),
    children: [
      {
        path: "home",
        element: <App />,
      },
      {
        path: "actions",
        element: <Actions />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NextUIProvider className="dark text-foreground flex flex-col h-full">
      <NotificationProvider>
        <QueryClientProvider client={queryClient}>
          <ReactFlowProvider>
            <RouterProvider router={router} />
          </ReactFlowProvider>
        </QueryClientProvider>
      </NotificationProvider>
    </NextUIProvider>
  </React.StrictMode>
);
