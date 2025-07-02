import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";

interface RouterProviderProps {
  children?: React.ReactNode;
}

const RouterProvider: React.FC<RouterProviderProps> = ({ children }) => {
  return (
    <BrowserRouter>
      {children}
      <AppRoutes />
    </BrowserRouter>
  );
};

export default RouterProvider;
