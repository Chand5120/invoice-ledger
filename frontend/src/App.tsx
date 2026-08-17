import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import InvoiceLedger from "./components/InvoiceLedger";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <InvoiceLedger />
    </QueryClientProvider>
  );
}

export default App;
