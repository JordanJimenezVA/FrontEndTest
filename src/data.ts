export const menu = [
  {
    id: 1,
    title: "Gestión",
    icon: "lni lni-clipboard",
    role: ["Administrador", "Supervisor"],
    listItems: [
      {
        id: 1,
        title: "Personal Externo",
        url: "/Personal Externo",
        icon: "ti ti-users",
      },
      {
        id: 2,
        title: "Personal Interno",
        url: "/Personal Interno",
        icon: "ti ti-user",
      },
      {
        id: 3,
        title: "Camiones",
        url: "/Camiones",
        icon: "lni lni-delivery",
      },
      {
        id: 4,
        title: "Reportar Persona",
        url: "/Personas Reportadas",
        icon: "ti ti-user-exclamation",
      },
      {
        id: 5,
        title: "Usuarios",
        url: "/Usuarios",
        icon: "ti ti-users",
      },
    ],
  },
  {
    id: 2,
    title: "Marcar Entrada",
    icon: "ti ti-list-check",
    role: ["Administrador", "Guardia"],
    listItems: [
      {
        id: 1,
        title: "Personal Externo",
        url: "/FormularioPersonalExterno",
        icon: "ti ti-users",
      },
      {
        id: 2,
        title: "Personal Interno",
        url: "/FormularioPersonalInterno",
        icon: "ti ti-user",
      },
      {
        id: 3,
        title: "Camiones",
        url: "/FormularioCamiones",
        icon: "lni lni-delivery",
      },
    ],
  },
  // {
  //   id: 3,
  //   title: "Revision",
  //   icon: "ti ti-file-description",
  //   role: ["Administrador", "Supervisor"],
  //   listItems: [
  //     {
  //       id: 1,
  //       title: "Revisión Camiones",
  //       url: "/Revision",
  //       icon: "lni lni-delivery",
  //     },
  //     {
  //       id: 2,
  //       title: "Informe Camiones",
  //       url: "/InformeCamion",
  //       icon: "ti ti-file-description",
  //     }
  //   ],
  // },
  {
    id: 4,
    title: "Marcar Salida",
    icon: "ti ti-clipboard-x",
    role: ["Administrador", "Guardia"],
    listItems: [
      {
        id: 1,
        title: "Marcar Salida Camión",
        url: "/TablaIngreso",
        icon: "lni lni-delivery",
      },
      {
        id: 2,
        title: "Marcar Salida",
        url: "/TablaIngresoRE",
        icon: "ti ti-clipboard-text",
      },
      {
        id: 3,
        title: "Historial",
        url: "/Logs",
        icon: "ti ti-file-description",
      }
    ],
  },
  {
    id: 5,
    title: "Novedades",
    icon: "lni lni-list",
    role: ["Administrador", "Guardia"],
    listItems: [
      {
        id: 1,
        title: "Registrar Novedad",
        url: "/Novedades",
        icon: "ti ti-file-description",
      }
    ],
  },
];


export const chartBoxUser = {
  color: "#8884d8",
  icon: "/userIcon.svg",
  title: "Total en Recinto",
};

export const chartBoxProduct = {
  color: "skyblue",
  icon: "/productIcon.svg",
  title: "Personal Interno",
  url: "/TablaIngresoRE"
};
export const chartBoxRevenue = {
  color: "teal",
  icon: "/revenueIcon.svg",
  title: "Personal Externo",
  url: "/TablaIngresoRE"
};
export const chartBoxConversion = {
  color: "gold",
  icon: "/conversionIcon.svg",
  title: "Camiones",
    url: "/TablaIngreso"
};

