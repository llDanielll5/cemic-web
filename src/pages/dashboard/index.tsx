/* eslint-disable @next/next/no-img-element */
import React, { useState, useCallback, useEffect } from "react";
import { dashboardNav } from "data";
import styles from "../../styles/Dashboard.module.css";

const Dashboard = () => {
  const [page, setPage] = useState("Geral");

  const getActualPageSelected = useCallback(() => {
    const list = document?.querySelectorAll("li");
    const setSelectedItem = (pageIndex: number, index: number) => {
      if (index === pageIndex) {
        list[pageIndex].style?.setProperty("background", "white");
        list[pageIndex]
          .querySelector("a")
          ?.style.setProperty("color", "#09aae8");
      } else {
        list[index].style?.setProperty("background", "#09aae8");
        list[index].querySelector("a")?.style.setProperty("color", "white");
      }
    };
    if (page === "Geral") {
      list?.forEach((i, index) => {
        setSelectedItem(1, index);
      });
    } else if (page === "Pacientes") {
      list?.forEach((i, index) => {
        setSelectedItem(2, index);
      });
    } else if (page === "Fechamentos") {
      list?.forEach((i, index) => {
        setSelectedItem(3, index);
      });
    } else if (page === "Doações") {
      list?.forEach((i, index) => {
        setSelectedItem(4, index);
      });
    } else if (page === "Dentistas") {
      list?.forEach((i, index) => {
        setSelectedItem(5, index);
      });
    }
  }, [page]);

  useEffect(() => {
    getActualPageSelected();
  }, [getActualPageSelected]);

  const cemicLogo = (props: any) => (
    <li>
      <a href={props.href}>
        <img
          src="/images/logo.png"
          alt="logo"
          className={styles["cemic-logo"]}
        />
        <span className={styles.title}>{"Daniel Mota"}</span>
      </a>
    </li>
  );
  const navigationRender = (props: any) => (
    <li onClick={() => setPage(props.title)}>
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
