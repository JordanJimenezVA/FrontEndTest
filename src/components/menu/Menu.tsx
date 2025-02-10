// import { useState, useEffect, useRef } from "react";
// import { menu } from "../../data";
// import { useAuth } from "../../hooks/Auth";
// import "./menu.scss";
// import Axios from "axios";
// import { Link } from "react-router-dom";
// import { ChevronDownIcon, ChevronUpIcon, HomeIcon } from "@heroicons/react/24/solid";

// const host_server = import.meta.env.VITE_SERVER_HOST;

// type OpenItems = {
//   [key: number]: boolean;
// };

// export const Menu = () => {
//   const { userType, nombreUsuario } = useAuth();
//   const [openItems, setOpenItems] = useState<OpenItems>({});
//   const hamBurgerRef = useRef<HTMLButtonElement>(null);

//   const handleLogout = () => {
//     Axios.get(`${host_server}/Logout`)
//       .then(() => {
//         window.location.href = "/";
//       })
//       .catch((err) => console.log(err));
//   };

//   const handleToggle = (id: number) => {
//     setOpenItems((prevState) => ({
//       ...prevState,
//       [id]: !prevState[id],
//     }));
//   };


//   const renderMenuIcon = (Icon: any, isOpen: boolean, hasSubItems: boolean) => {
//     return (
//       <div className="flex items-center justify-between w-full">
//         {typeof Icon === "string" ? (
//           <i className={`${Icon} icon-small`} />
//         ) : (
//           <Icon className="icon-small inline-block mr-2" />
//         )}
//       </div>
//     );
//   };

//   // Aquí es donde renderizas el menú
//   const getMenuItems = () => {
//     return menu.map((item) => {
//       if (!item.role || item.role.includes(userType || "")) {
//         const isOpen = openItems[item.id];

//         const hasSubItems = Array.isArray(item.listItems) && item.listItems.length > 0;

//         return (
//           <li className={`sidebar-item ${isOpen ? "open" : ""}`} key={item.id}>
//             {hasSubItems ? (
//               <>
//                 <a
//                   onClick={() => handleToggle(item.id)}
//                   className="sidebar-link collapsed has-dropdown"
//                   aria-expanded={isOpen ? "true" : "false"}
//                 >
//                   <div className="flex items-center w-full">
//                     {renderMenuIcon(item.icon, isOpen, hasSubItems)}
//                     <span>{item.title}</span>
//                     {isOpen ? (
//                       <ChevronUpIcon className="icon-arrow" />
//                     ) : (
//                       <ChevronDownIcon className="icon-arrow" />
//                     )}
//                   </div>
//                 </a>

//                 {item.listItems && (
//                   <ul className={`submenu ${isOpen ? "open" : ""}`}>
//                     {item.listItems.map((subItem) => (
//                       <li key={subItem.id}>
//                         <Link to={subItem.url} className="sidebar-link">
//                           {renderMenuIcon(subItem.icon, false, false)}
//                           <span>{subItem.title}</span>
//                         </Link>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </>
//             ) : (
//               <Link to={item.url || "#"} className="sidebar-link">
//                 {renderMenuIcon(item.icon, isOpen, hasSubItems)}
//                 <span>{item.title}</span>
//               </Link>
//             )}
//           </li>
//         );
//       }
//       return null;
//     });
//   };

//   useEffect(() => {
//     const hamBurger = hamBurgerRef.current;
//     const toggleSidebar = () => {
//       document.querySelector("#sidebar")?.classList.toggle("expand");
//     };
//     hamBurger?.addEventListener("click", toggleSidebar);
//     return () => {
//       hamBurger?.removeEventListener("click", toggleSidebar);
//     };
//   }, []);

//   return (
//     <div className="wrapper">
//       <aside id="sidebar" className="expand">
//         <div className="d-flex">
//           <button className="toggle-btn" type="button" ref={hamBurgerRef}>
//             <i className="ti ti-menu-2"></i>
//           </button>
//           <div className="sidebar-logo">
//             <a href="#">Sistema Andes</a>
//           </div>
//         </div>
//         <ul className="sidebar-nav">
//           <li className="sidebar-item">
//             <Link to="/home" className="sidebar-link">
//             <HomeIcon className="icon-small"></HomeIcon>
//               <span>Monitoreo</span>
//             </Link>
//           </li>
//           {getMenuItems()}
//         </ul>

//         <div className="sidebar-footer">
//           <i className="lni lni-home icon-small"></i>
//           <span className="sidebar-span">{nombreUsuario}</span>
//           <a className="sidebar-link" onClick={handleLogout}>
//             <i className="lni lni-exit icon-small"></i>
//             <span>Cerrar Sesión</span>
//           </a>
//         </div>
//       </aside>
//     </div>
//   );
// };

// export default Menu;
import { useState, useEffect, useRef } from "react";
import { menu } from "../../data";
import { useAuth } from "../../hooks/Auth";
import "./menu.scss";
import Axios from "axios";
import { Link } from "react-router-dom";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

const host_server = import.meta.env.VITE_SERVER_HOST || "http://localhost:3000";

interface OpenItems {
  [key: number]: boolean;
}

export const Menu = () => {
  const { userType, nombreUsuario } = useAuth();
  const [openItems, setOpenItems] = useState<OpenItems>({});
  const hamBurgerRef = useRef<HTMLButtonElement>(null);

  const handleLogout = () => {
    Axios.get(`${host_server}/Logout`)
      .then(() => {
        window.location.href = "/";
      })
      .catch((err) => console.log(err));
  };

  const handleToggle = (id: number) => {
    setOpenItems((prevState) => {
      const isOpen = prevState[id];
      const newState = Object.keys(prevState).reduce((acc, key) => {
        acc[parseInt(key)] = false; // Contrae todos los menús
        return acc;
      }, {} as OpenItems);
      return { ...newState, [id]: !isOpen }; // Expande o contrae el actual
    });
  };

  const renderMenuIcon = (Icon: any) => {
    if (typeof Icon === "string") {
      return <i className={`${Icon} icon-small mr-2`} />;
    } else if (Icon) {
      return <Icon className="icon-small mr-2" />;
    }
    return null;
  };

  const getMenuItems = () => {
    return menu.map((item) => {
      if (!item.role || item.role.includes(userType || "")) {
        const isOpen = openItems[item.id];
        const hasSubItems = Array.isArray(item.listItems) && item.listItems.length > 0;

        return (
          <li className={`sidebar-item ${isOpen ? "open" : ""}`} key={item.id}>
            {hasSubItems ? (
              <>
                <a
                  href="#"
                  className="sidebar-link collapsed has-dropdown"
                  onClick={(e) => {
                    e.preventDefault();
                    handleToggle(item.id);
                  }}
                  aria-expanded={isOpen ? "true" : "false"}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      {renderMenuIcon(item.icon)}
                      <span>{item.title}</span>
                    </div>
                    {isOpen ? (
                      <ChevronUpIcon className="icon-arrow" />
                    ) : (
                      <ChevronDownIcon className="icon-arrow" />
                    )}
                  </div>
                </a>

                <ul
                  id={`collapse${item.id}`}
                  className={`sidebar-dropdown list-unstyled collapse ${isOpen ? "show" : ""}`}
                  aria-expanded={isOpen ? "true" : "false"}
                >
                  {item.listItems?.map((subItem) => (
                    <li className="sidebar-subitem" key={subItem.id}>
                      <Link to={subItem.url || "#"} className="sidebar-link">
                        {renderMenuIcon(subItem.icon)}
                        <span className="item-title-x">{subItem.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <Link to={item.url || "#"} className="sidebar-link">
                <div className="flex items-center">
                  {renderMenuIcon(item.icon)}
                  <span>{item.title}</span>
                </div>
              </Link>
            )}
          </li>
        );
      }
      return null;
    });
  };

  useEffect(() => {
    const hamBurger = hamBurgerRef.current;
    const toggleSidebar = () => {
      document.querySelector("#sidebar")?.classList.toggle("expand");
    };
    hamBurger?.addEventListener("click", toggleSidebar);
    return () => {
      hamBurger?.removeEventListener("click", toggleSidebar);
    };
  }, []);

  return (
    <div className="wrapper">
      <aside id="sidebar" className="expand">
        <div className="d-flex">
          <button className="toggle-btn" type="button" ref={hamBurgerRef}>
            <i className="ti ti-menu-2"></i>
          </button>
          <div className="sidebar-logo">
            <a href="#">Sistema Andes</a>
          </div>
        </div>
        <ul className="sidebar-nav">
          {getMenuItems()}
        </ul>

        <div className="sidebar-footer">
          <i className="lni lni-home icon-small"></i>
          <span className="sidebar-span">{nombreUsuario}</span>
          <a className="sidebar-link" onClick={handleLogout}>
            <i className="lni lni-exit icon-small"></i>
            <span>Cerrar Sesión</span>
          </a>
        </div>
      </aside>
    </div>
  );
};

export default Menu;
