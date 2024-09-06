import { useState, useEffect, useRef } from "react";
import { menu } from "../../data";
import { useAuth } from "../../hooks/Auth";
import "./menu.scss";
import Axios from "axios";
import { Link } from "react-router-dom";
const host_server = import.meta.env.VITE_SERVER_HOST;

// Definimos el tipo para el estado openItems
type OpenItems = {
  [key: number]: boolean;
};

export const Menu = () => {
  const { userType } = useAuth();
  const [openItems, setOpenItems] = useState<OpenItems>({});
  const hamBurgerRef = useRef<HTMLButtonElement>(null);
  const { nombreUsuario } = useAuth();

  const handleLogout = () => {
    Axios.get(`${host_server}/Logout`)
      .then(() => {
        window.location.href = "/";
      })
      .catch((err) => console.log(err));
  };

  const handleToggle = (id: number) => {
    setOpenItems((prevState) => ({
      ...Object.keys(prevState).reduce((acc, key) => {
        acc[parseInt(key)] = parseInt(key) === id ? !prevState[id] : false;
        return acc;
      }, {} as OpenItems),
    }));
  };

  const getMenuItems = () => {
    return menu.map((item) => {
      if (!item.role || item.role.includes(userType || "")) {
        const isOpen = openItems[item.id];
        return (
          <li className={`sidebar-item ${isOpen ? "open" : ""}`} key={item.id}>
            {item.listItems.length === 0 ? (
              <span className="sidebar-link">
                <span>{item.title}</span>
              </span>
            ) : (
              <>
                <a
                  href="#"
                  className="sidebar-link collapsed has-dropdown"
                  onClick={() => handleToggle(item.id)}
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${item.id}`}
                  aria-expanded={isOpen ? "true" : "false"}
                  aria-controls={`collapse${item.id}`}
                >
                  {item.icon && <i className={item.icon}></i>}
                  <span>{item.title}</span>
                </a>

                <ul
                  id={`collapse${item.id}`}
                  className={`sidebar-dropdown list-unstyled collapse ${isOpen ? "show" : ""}`}
                  data-bs-parent="#sidebar"
                >
                  {item.listItems.map((listItem) => (
                    <li className="sidebar-subitem" key={listItem.id}>
                      <Link to={listItem.url || "#"} className="sidebar-link">
                        {listItem.icon && <i className={listItem.icon}></i>}
                        <span className="item-title-x">{listItem.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
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

    // Añadimos el evento de toggle solo al hacer clic
    hamBurger?.addEventListener("click", toggleSidebar);

    return () => {
      hamBurger?.removeEventListener("click", toggleSidebar);
    };
  }, []);

  return (
    <div className="wrapper">
      <aside id="sidebar" className="expand"> {/* Aquí se añade la clase "expand" por defecto */}
        <div className="d-flex">
          <button className="toggle-btn" type="button" ref={hamBurgerRef}>
            <i className="ti ti-menu-2"></i>
          </button>
          <div className="sidebar-logo">
            <a href="#">Sistema Andes</a>
          </div>
        </div>
        <ul className="sidebar-nav">
          <li className="sidebar-item">
            <Link to="/home" className="sidebar-link">
              <i className="lni lni-home"></i>
              <span>Monitoreo</span>
            </Link>
          </li>
          {getMenuItems()}
        </ul>

        <div className="sidebar-footer">
          <i className="lni lni-home"></i>
          <span className="sidebar-span">{nombreUsuario}</span>

          <a className="sidebar-link" onClick={handleLogout}>
            <i className="lni lni-exit"></i>
            <span>Cerrar Sesión</span>
          </a>
        </div>
      </aside>
    </div>
  );
};

export default Menu;
