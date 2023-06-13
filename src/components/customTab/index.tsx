import * as React from "react";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import { useState } from "react";
import * as S from "./styled";

interface ITabProps {
  value: any;
  label: string;
  render: any;
}

interface ICustomTabProps {
  values: any[];
  labels: string[];
  renders: any[];
}

export default function CustomTab(props: ICustomTabProps) {
  const { values, labels, renders } = props;

  const [value, setValue] = useState(values[0]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <S.TabStyles>
      <TabContext value={value}>
        <S.AllTabList onChange={handleChange}>
          {labels.map((item: any, index: any) => (
            <Tab
              className="tab"
              key={index}
              label={item}
              value={values[index]}
              wrapped
              sx={{ marginBottom: "5px" }}
            />
          ))}
        </S.AllTabList>

        {renders.map((item: any, index: any) => (
          <TabPanel
            key={index}
            value={values[index]}
            sx={{ padding: "25px 0" }}
          >
            {item}
          </TabPanel>
        ))}
      </TabContext>
    </S.TabStyles>
  );
}
