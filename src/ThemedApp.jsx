import { useState, createContext, useContext } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

import App from "./App";
import Header from "./components/Header";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

const AppContext = createContext();
export function useApp() {
  return useContext(AppContext);
}

export default function ThemedApp() {
  const [showForm, setShowForm] = useState(false);
  return (
    <ThemeProvider theme={theme}>
      <AppContext.Provider value={{ showForm, setShowForm }}>
        {/* <App /> */}
        <Header />
        <CssBaseline />
      </AppContext.Provider>
    </ThemeProvider>
  );
}
