import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App } from "./App";

const queryClient = new QueryClient();

function start() {
  const root = createRoot(document.getElementById("root")!);
  root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}
