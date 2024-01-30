import React from "react";
import { SvgIcon, Tooltip, IconButton as Icon } from "@mui/material";

const IconButton = (props: {
  children: any;
  iconSize: "large" | "medium" | "small";
  tooltip: string;
  onClick: any;
}) => {
  return (
    <Tooltip title={props.tooltip}>
      <Icon onClick={props.onClick}>
        <SvgIcon fontSize={props.iconSize}>{props.children}</SvgIcon>
      </Icon>
    </Tooltip>
  );
};

export default IconButton;
