import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAuthStore } from "./stores/authStore";
import { useMetaStore } from "./stores/metaStore";
import axios from "axios";
import "./index.css";
import { Analytics } from "@vercel/analytics/react";

axios.defaults.withCredentials = true;
await useAuthStore.getState().initialize();
await useMetaStore.getState().fetchMetaData();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity
    }
  }
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools />
    </QueryClientProvider>
    <Analytics />
  </StrictMode>
);
