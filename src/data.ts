// menu.tsx
import {
  ClipboardDocumentListIcon,
  UsersIcon,
  TruckIcon,
  ShieldExclamationIcon,
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  ClipboardIcon,
  ListBulletIcon,
  HomeIcon,
} from "@heroicons/react/24/solid"; // Puedes cambiar a outline si prefieres bordes

export const menu = [
  {
    id: 1,
    title: "Monitoreo",
    icon: HomeIcon, // Icono de lista con check para "Marcar Entrada"
    role: ["Administrador", "Guardia", "Supervisor"],
    url: "/home",
  },
  {
    id: 2,
    title: "Gestión",
    icon: ClipboardDocumentListIcon, // Icono principal de Gestión
    role: ["Administrador", "Supervisor"],
    listItems: [
      {
        id: 1,
        title: "Agregar Personal",
        url: "/Persona",
        icon: UsersIcon, // Icono de usuarios para representar Personal
      },
      {
        id: 2,
        title: "Agregar Transporte",
        url: "/Transporte",
        icon: TruckIcon, // Icono de camión para Transporte
      },
      {
        id: 3,
        title: "Reportar Persona",
        url: "/Personas Reportadas",
        icon: ShieldExclamationIcon, // Icono de exclamación para reportar
      },
      {
        id: 4,
        title: "Usuarios",
        url: "/Usuarios",
        icon: UsersIcon, // Reutilizamos el icono de usuarios
      },
    ],
  },
  {
    id: 3,
    title: "Marcar Entrada",
    icon: ClipboardDocumentCheckIcon, // Icono de lista con check para "Marcar Entrada"
    role: ["Administrador", "Guardia"],
    url: "/FormularioIngreso",
  },
  {
    id: 4,
    title: "Marcar Salida",
    icon: ClipboardIcon, // Icono de lista con una X para "Marcar Salida"
    role: ["Administrador", "Guardia"],
    url: "/TablaIngreso",
  },
  {
    id: 5,
    title: "Logs",
    icon: ClipboardDocumentListIcon, // Ícono de documento para Logs
    role: ["Administrador", "Guardia"],
    url: "/Logs",
  },
  {
    id: 6,
    title: "Novedades",
    icon: ListBulletIcon, // Icono de lista para Novedades
    role: ["Administrador", "Guardia"],
    listItems: [
      {
        id: 1,
        title: "Registrar Novedad",
        url: "/Novedades",
        icon: DocumentTextIcon, // Icono de documento para "Registrar Novedad"
      },
    ],
  },
  
];
export const chartBoxUser = {
  color: "#8884d8",
  icon: "",
  title: "Total en Recinto",
  url: ""
};

export const chartBoxProduct = {
  color: "skyblue",
  icon: "/productIcon.svg",
  title: "Personal Interno",
  url: ""  
};

export const chartBoxRevenue = {
  color: "teal",
  icon: "/revenueIcon.svg",
  title: "Personal Externo",
  url: ""  
};

export const chartBoxConversion = {
  color: "gold",
  icon: "/conversionIcon.svg",
  title: "Camiones",
  url: "/TablaIngreso"
};