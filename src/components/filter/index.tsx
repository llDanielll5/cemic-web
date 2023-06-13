import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import ReactDropdown from "react-dropdown";
import styles from "../../styles/Filter.module.css";

interface FilterProps {
  options: string[];
  title: string;
  baseStyle?: React.CSSProperties;
  content: string;
  setContent: (e: string) => void;
  filterValue: string;
  setFilterValue: (e: string) => void;
  onClick: () => void;
}

const Filter = (props: FilterProps) => {
  return (
    <div className={styles.container} style={props.baseStyle}>
      <h2>{props.title}</h2>
      <div className={styles["inner-container"]}>
        <ReactDropdown
          options={props.options}
          onChange={({ value }) => props.setContent(value)}
          value={props.content}
          placeholder="Filtrar por:"
          className={styles.dropdown}
        />
        <div className={styles["input-content"]}>
          <input
            placeholder="Digite sua busca"
            className={styles.input}
            type="text"
            value={props.filterValue}
            onChange={(e) => props.setFilterValue(e.target.value)}
            maxLength={11}
          />
        </div>
        <FaSearch onClick={props.onClick} className={styles.search} />
      </div>
    </div>
  );
};

export default Filter;
