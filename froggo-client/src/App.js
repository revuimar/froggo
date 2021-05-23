import './App.css';
import BranchListView from './components/BranchListView';
import Login from "./components/Login";
import {useRoutes} from 'hookrouter';
import {ProvideAuth} from './useAuth.js'

const routes = {
  "/": () => <Login />,
  "/branches": () => <BranchListView />,
};

function App() {
  const routeResult = useRoutes(routes);
  return (
    
      <div className="antialiased font-sans min-h-screen">
        <div className="flex flex-col justify-center">
          <header className="flex flex-row justify-center pt-12 pb-4 text-2xl">
            Froggo Headquarters Admin Panel
          </header>
          <div className="flex flex-col justify-center items-center content-center">
          <ProvideAuth>{routeResult}</ProvideAuth>
          </div>
        </div>
      </div>
    
  );
}

export default App;
