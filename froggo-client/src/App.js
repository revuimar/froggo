import './App.css';
import ProductView from './components/ProductView';
import Login from "./components/Login";
import {useRoutes} from 'hookrouter';
import {ProvideAuth} from './useAuth.js'

const routes = {
  "/": () => <Login />,
  "/products": () => <ProductView />,
};

function App() {
  const routeResult = useRoutes(routes);
  return (
    <ProvideAuth>
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
    </ProvideAuth>
  );
}

export default App;
