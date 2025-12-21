import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { SnackbarProvider } from "notistack";

// React Router
import { BrowserRouter } from "react-router-dom";

// React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SnackbarProvider
          maxSnack={3}
          autoHideDuration={3000}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          preventDuplicate
          style={{
            width: "300px", // ancho fijo
            minHeight: "48px", // altura mínima uniforme
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between", // 👈 esto es clave
            padding: "0 12px", // deja espacio para el texto y la X
            textAlign: "left",
            wordBreak: "break-word",
            boxSizing: "border-box",
          }}
        >
          <App />
        </SnackbarProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
