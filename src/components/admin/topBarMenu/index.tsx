//@ts-nocheck
import React from "react";
import styles from "../../../styles/Dashboard.module.css";
import { TiThMenuOutline } from "react-icons/ti";

interface TopBarProps {
  page: Index;
  onClick: any;
  toggleRef: any;
  panelTitle: {
    [i as number]: string;
  };
}

const TopBarMenu = (props: TopBarProps) => {
  return (
    <div className={styles.topbar}>
      <div
        className={styles.toggle}
        onClick={props.onClick}
        ref={props.toggleRef}
      >
        <TiThMenuOutline className={styles.icon} />
      </div>
      <div className={styles.search}>
        <h2 className={styles.title}>{props.panelTitle[props.page]}</h2>
      </div>
      <div className={styles.user}></div>
    </div>
  );
};

export default TopBarMenu;
