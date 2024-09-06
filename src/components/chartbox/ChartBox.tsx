import { Link } from "react-router-dom";
import "./chartBox.scss";

type Props = {
  color: string;
  icon: string;
  title: string;
  cantidad: number;
  url: string;
};

const ChartBox = (props: Props) => {
  return (
    <div className="chartBox">
      <div className="title">
        <img src={props.icon} alt="" />
        <span>{props.title}</span>
      </div>
      <span className="cantidad">{props.cantidad}</span>
      <Link
        to={props.url}
        className={props.title === "Total en Recinto" ? "hidden-link" : ""}
        style={{ color: "#fga1" }}
      >
        Ver todos
      </Link>
    </div>
  );
};

export default ChartBox;
