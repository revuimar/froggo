import './App.css';
import ProductView from './components/ProductView';
import Login from "./components/Login";
import {useRoutes} from 'hookrouter';

const routes = {
  "/": () => <Login />,
  "/products": () => <ProductView />,
};

function App() {
  const routeResult = useRoutes(routes);
  return (
    <div className="bg-gray-700 antialiased font-sans min-h-screen">
      <div className="flex flex-col justify-center">
        <header className="flex flex-row justify-center text-white pt-12 pb-4 text-2xl">
          Froggo Main Branch Admin Panel
        </header>
        <div className="flex flex-col justify-center items-center content-center">
          {routeResult}
        </div>
      </div>
    </div>
  );
}

export default App;
