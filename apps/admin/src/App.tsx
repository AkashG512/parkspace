import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import PricingControl from "./pages/PricingControl";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PricingControl />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
