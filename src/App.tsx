import "./styles/theme.css";
import "./styles/global.css";
import { Home } from "./Pages/Home";
import { TaskContextProvider } from "./contexts/TaskContext/TaskContextProvider";

export function App() {
    return (
         <TaskContextProvider> 
            <Home />
        </TaskContextProvider>
    );
}