import React from "react";
import useWindowSize from "@/hooks/useWindowSize";
import styles from "../../styles/Filter.module.css";

interface FilterLetterProps {
  letter: string | null;
  setLetter: (e: string) => void;
}

const FilterLetter = (props: FilterLetterProps) => {
  const size = useWindowSize();
  const alfabeto = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  return (
    <div className={styles["letters-container"]}>
      {alfabeto.map((item, index) => {
        if (size?.width! > 760) {
          return (
            <div
              key={index}
              className={styles.letter}
              onClick={() => props.setLetter(item)}
              style={
                props.letter === item
                  ? {
                      backgroundColor: "#1b083e",
                      color: "white",
                      padding: "0 8px",
                      borderRadius: "4px",
                    }
                  : undefined
              }
            >
              {item}
            </div>
          );
        } else return null;
      })}
      {size?.width! < 760 && (
        <div className={styles["dropdown-letter-container"]}>
          <h2>Filtrar por primeira letra:</h2>
          {/* <ReactDropdown
            options={alfabeto}
            onChange={({ value }) => props.setLetter(value)}
            value={props.letter!}
            placeholder="Filtrar por letra:"
            className={styles["dropdown-letter"]}
          /> */}
        </div>
      )}
    </div>
  );
};

export default FilterLetter;
