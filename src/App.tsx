import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from "./pages/home/Home"
import "./styles/global.scss";

import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";

import PersonalInterno from "./pages/personalinterno/PersonalInterno";
import persona from "./pages/personalexterno/persona";
import Transporte from "./pages/camiones/Transporte.js";
import PersonasReportadas from "./pages/personasreportadas/PersonasReportadas";
import Usuarios from "./pages/usuarios/Usuarios";
import Menu from "./components/menu/Menu";
import Login from "./pages/login/Login";

// @ts-ignore
import AgregarPersonaReportada from "./components/add/AgregarPersonaReportada.jsx"
// @ts-ignore
import AgregarPersonal from "./components/add/AgregarPersonal.jsx";

// @ts-ignore
import AgregarTransporte from "./components/add/AgregarTransporte.jsx";
// @ts-ignore
import AgregarNO from "./components/add/AgregarNO";
// @ts-ignore
import AgregarUsuario from "./components/add/AgregarUsuario.jsx";


import { AuthProvider } from './hooks/Auth';



// @ts-ignore
import FormularioIngreso from "./pages/FormularioEntrada/FormularioIngreso.jsx";
// @ts-ignore
import FormularioCamiones from "./pages/FormularioEntrada/FormularioCamiones.jsx";

// @ts-ignore
import FormularioSalida from "./pages/FormularioSalida/FormularioSalida.jsx";



// @ts-ignore
import EditarPE from "./pages/editar/EditarPersona";
// @ts-ignore
import EditarTransporte from "./pages/editar/EditarTransporte.jsx";
// @ts-ignore
import EditarNG from "./pages/editar/EditarNG";
// @ts-ignore
import EditarUsuario from "./pages/editar/EditarUsuario.jsx";
// @ts-ignore
import VerNovedad from "./pages/viewnovedad/VerNovedad";

import TablaIngreso from "./pages/tablaingreso/TablaIngreso";



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
          element: <ProtectedRoute component={Home} />,
        },
        {
          path: "/Personal Interno",
          element: (
            <>
              <ProtectedRoute component={PersonalInterno} />
            </>
          ),
        },
        {
          path: "/Persona",
          element: <ProtectedRoute component={persona} /> // Ruta protegida
        },
        {
          path: "/Transporte",
          element: <ProtectedRoute component={Transporte} /> // Ruta protegida
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
          path: "/FormularioIngreso",
          element: <ProtectedRoute component={FormularioIngreso} /> // Ruta protegida
        },
        {
          path: "/FormularioCamiones",
          element: <ProtectedRoute component={FormularioCamiones} /> // Ruta protegida
        },

        {
          path: "/AgregarPersonal",
          element: <ProtectedRoute component={AgregarPersonal} /> // Ruta protegida
        },
        {
          path: "/AgregarTransporte",
          element: <ProtectedRoute component={AgregarTransporte} /> // Ruta protegida
        },
        {
          path: "/ReportarPersona",
          element: <ProtectedRoute component={AgregarPersonaReportada} /> // Ruta protegida
        },
        {
          path: "/AgregarUsuario",
          element: <ProtectedRoute component={AgregarUsuario} /> // Ruta protegida
        },
        {
          path: "/TablaIngreso",
          element: <ProtectedRoute component={TablaIngreso} /> // Ruta protegida
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
          path: "/EditarPersonal/:RUTP",
          element: <ProtectedRoute component={EditarPE} /> // Ruta protegida
        },
        {
          path: "/EditarTransporte/:PATENTE",
          element: <ProtectedRoute component={EditarTransporte} /> // Ruta protegida
        },
        {
          path: "/EditarPersonasReportadas/:IDNG",
          element: <ProtectedRoute component={EditarNG} /> // Ruta protegida
        },
        {
          path: "/EditarUsuario/:RUTU",
          element: <ProtectedRoute component={EditarUsuario} /> // Ruta protegida
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
