import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from "./pages/home/Home"
import "./styles/global.scss";

import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";

import PersonalInterno from "./pages/personalinterno/PersonalInterno";
import PersonalExterno from "./pages/personalexterno/PersonalExterno";
import Camiones from "./pages/camiones/Camiones";
import PersonasReportadas from "./pages/personasreportadas/PersonasReportadas";
import Usuarios from "./pages/usuarios/Usuarios";
import Menu from "./components/menu/Menu";
import Login from "./pages/login/Login";

// @ts-ignore
import AgregarPI from "./components/add/AgregarPI";
// @ts-ignore
import AgregarNG from "./components/add/AgregarNG"
// @ts-ignore
import AgregarPE from "./components/add/AgregarPE";
// @ts-ignore
import AgregarCA from "./components/add/AgregarCA";
// @ts-ignore
import AgregarNO from "./components/add/AgregarNO";
// @ts-ignore
import AgregarU from "./components/add/AgregarU";


import { AuthProvider } from './hooks/Auth';


// @ts-ignore
import FormularioPersonalInterno from "./pages/formd/FormularioPersonalInterno";
// @ts-ignore
import FormularioPersonalExterno from "./pages/formd/FormularioPersonalExterno";
// @ts-ignore
import FormularioCamiones from "./pages/formd/FormularioCamiones";
// @ts-ignore
import FormularioSalida from "./pages/formsalida/FormularioSalida";
// @ts-ignore
import FormularioSalidaRE from "./pages/formsalidare/FormularioSalidaRE";


// @ts-ignore
import EditarPI from "./pages/editar/EditarPI";
// @ts-ignore
import EditarPE from "./pages/editar/EditarPE";
// @ts-ignore
import EditarCA from "./pages/editar/EditarCA";
// @ts-ignore
import EditarNG from "./pages/editar/EditarNG";
// @ts-ignore
import EditarU from "./pages/editar/EditarU";
// @ts-ignore
import VerNovedad from "./pages/viewnovedad/VerNovedad";

import TablaIngreso from "./pages/tablaingreso/TablaIngreso";

import TablaIngresoRE from "./pages/tablaingresoRE/TablaIngresoRE";

import TablaNovedad from "./pages/tablanovedad/TablaNovedad";

import Historial from "./pages/historial/Historial";

import Revision from './pages/revision/Revision';

// @ts-ignore
import RevisarCamion from './pages/formrevisar/RevisarCamion';

import InformeCamion from './pages/informes/Informecamion';

// @ts-ignore
import VerInforme from './pages/viewinforme/VerInforme';

import Footer from './components/footer/Footer';

import ProtectedRoute from './components/routes/ProtectedRoute';

const queryClient = new QueryClient();

function App() {

  const Layout = () => {
    
    return (
      <div className="main"><br></br>
        <div className="container">
          <div className="menuContainer">
            <Menu />
          </div>
          <div className="contentContainer">
            <QueryClientProvider client={queryClient}>
              <Outlet />
            </QueryClientProvider>
          </div>
          <Footer/>
        </div>
      </div>
    );
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AuthProvider><Login /></AuthProvider>,
    },
    {
      path: "/",
      element: <AuthProvider><Layout /></AuthProvider>,
      children: [
        {
          path: "/Home",
          element: <ProtectedRoute component={Home} />, // Ruta protegida
        },
        {
          path: "/Personal Interno",
          element: <ProtectedRoute component={PersonalInterno} /> // Ruta protegida
        },
        {
          path: "/Personal Externo",
          element: <ProtectedRoute component={PersonalExterno} /> // Ruta protegida
        },
        {
          path: "/Camiones",
          element: <ProtectedRoute component={Camiones} /> // Ruta protegida
        },
        {
          path: "/Personas Reportadas",
          element: <ProtectedRoute component={PersonasReportadas} /> // Ruta protegida
        },
        {
          path: "/Usuarios",
          element: <ProtectedRoute component={Usuarios} /> // Ruta protegida
        },
        {
          path: "/FormularioPersonalInterno",
          element: <ProtectedRoute component={FormularioPersonalInterno} /> // Ruta protegida
        },
        {
          path: "/FormularioPersonalExterno",
          element: <ProtectedRoute component={FormularioPersonalExterno} /> // Ruta protegida
        },
        {
          path: "/FormularioCamiones",
          element: <ProtectedRoute component={FormularioCamiones} /> // Ruta protegida
        },
        {
          path: "/AgregarPersonalInterno",
          element: <ProtectedRoute component={AgregarPI} /> // Ruta protegida
        },
        {
          path: "/AgregarPersonalExterno",
          element: <ProtectedRoute component={AgregarPE} /> // Ruta protegida
        },
        {
          path: "/AgregarCamion",
          element: <ProtectedRoute component={AgregarCA} /> // Ruta protegida
        },
        {
          path: "/AgregarPersonaNG",
          element: <ProtectedRoute component={AgregarNG} /> // Ruta protegida
        },
        {
          path: "/AgregarUsuario",
          element: <ProtectedRoute component={AgregarU} /> // Ruta protegida
        },
        {
          path: "/TablaIngreso",
          element: <ProtectedRoute component={TablaIngreso} /> // Ruta protegida
        },
        {
          path: "/TablaIngresoRE",
          element: <ProtectedRoute component={TablaIngresoRE} /> // Ruta protegida
        },
        {
          path: "/Logs",
          element: <ProtectedRoute component={Historial} /> // Ruta protegida
        },
        {
          path: "/FormularioSalida/:IDR",
          element: <ProtectedRoute component={FormularioSalida} /> // Ruta protegida
        },
        {
          path: "/FormularioSalidaRE/:IDR",
          element: <ProtectedRoute component={FormularioSalidaRE} /> // Ruta protegida
        },
        {
          path: "/EditarPersonalInterno/:IDPI",
          element: <ProtectedRoute component={EditarPI} /> // Ruta protegida
        },
        {
          path: "/EditarPersonalExterno/:IDPE",
          element: <ProtectedRoute component={EditarPE} /> // Ruta protegida
        },
        {
          path: "/EditarCamiones/:IDCA",
          element: <ProtectedRoute component={EditarCA} /> // Ruta protegida
        },
        {
          path: "/EditarPersonasReportadas/:IDNG",
          element: <ProtectedRoute component={EditarNG} /> // Ruta protegida
        },
        {
          path: "/EditarU/:IDU",
          element: <ProtectedRoute component={EditarU} /> // Ruta protegida
        },
        {
          path: "/Revision",
          element: <ProtectedRoute component={Revision} /> // Ruta protegida
        },
        {
          path: "/RevisionCamion/:IDR",
          element: <ProtectedRoute component={RevisarCamion} /> // Ruta protegida
        },
        {
          path: "/InformeCamion/",
          element: <ProtectedRoute component={InformeCamion} /> // Ruta protegida
        },
        {
          path: "/VerInforme/:IDR",
          element: <ProtectedRoute component={VerInforme} /> // Ruta protegida
        },
        {
          path: "/Novedades",
          element: <ProtectedRoute component={TablaNovedad} /> // Ruta protegida
        },
        {
          path: "/AgregarNO",
          element: <ProtectedRoute component={AgregarNO} /> // Ruta protegida
        },
        {
          path: "/VerNO/:IDNO",
          element: <ProtectedRoute component={VerNovedad} /> // Ruta protegida
        }
      ],
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
