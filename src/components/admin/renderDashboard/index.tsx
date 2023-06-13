import React from "react";
import CemicLogo from "../cemicLogo";
import styles from "../../../styles/Dashboard.module.css";
import { dashboardNav } from "data";

interface RenderDashboardProps {
  setPage: any;
  page: any;
  signout: any;
  item: any;
  index: any;
  userData: any;
  dataNav: any;
}

const RenderDashboard = (props: RenderDashboardProps) => {
  const { page, setPage, signout, index, item, userData, dataNav } = props;

  const linearBack = "linear-gradient(300deg,#003147,#09aae8)";

  const navigationRender = (props: any, index: number) => {
    const hasPage = index === page;
    const handleChangePage = () => {
      if (index !== dataNav.length - 1) setPage(index);
      else signout();
    };
    return (
      <li
        onClick={handleChangePage}
        style={hasPage ? { background: linearBack } : undefined}
      >
        <a style={hasPage ? { color: "white" } : undefined}>
          <span className={styles.icon}>{props.icon}</span>
          <span className={styles.title}>{props.title}</span>
        </a>
      </li>
    );
  };

  if (index === 0) return <CemicLogo href={item.href} userData={userData} />;
  else
    return navigationRender(
      {
        href: item.path,
        title: item.title,
        icon: item?.icon,
      },
      index
    );
};

export default RenderDashboard;
