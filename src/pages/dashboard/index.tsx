/* eslint-disable @next/next/no-img-element */
import { dashboardNav } from "data";
import React from "react";
import styles from "../../styles/Dashboard.module.css";

const Dashboard = () => {
  const cemicLogo = (props: any) => (
    <li>
      <a href={props.href}>
        <img
          src="/images/cemicLogo.png"
          alt="logo"
          className={styles["cemic-logo"]}
        />
      </a>
    </li>
  );
  const navigationRender = (props: any) => (
    <li>
      <a>
        <span className={styles.icon}>{props.icon}</span>
        <span className={styles.title}>{props.title}</span>
      </a>
    </li>
  );
  return (
    <div className={styles.container}>
      <div className={styles.navigation}>
        <ul>
          {dashboardNav.map((item, index) => {
            if (index === 0)
              return cemicLogo({ href: item.path, title: item.title });
            else
              return navigationRender({
                href: item.path,
                title: item.title,
                icon: item?.icon,
              });
          })}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
