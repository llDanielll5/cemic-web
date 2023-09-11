import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import ReactDropdown from "react-dropdown";
import styles from "../../styles/Filter.module.css";
import { StyledTextField } from "../patient/profile";
import { IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

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
          <StyledTextField
            type="text"
            size="small"
            label="Digite o CPF*"
            placeholder="Números somente"
            value={props.filterValue}
            onChange={(e) => props.setFilterValue(e.target.value)}
            inputProps={{
              maxLength: 11,
              style: { height: "24px" },
              pattern: "[/^[0-9\b]+$/]",
            }}
            onKeyDown={({ key }) => {
              if (key === "Enter") return props.onClick();
            }}
          />
        </div>
        <IconButton color="info" onClick={props.onClick}>
          <SearchIcon fontSize="large" />
        </IconButton>
      </div>
    </div>
  );
};

export default Filter;
