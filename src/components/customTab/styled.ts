import { TabProps, Tab, Box, BoxProps, Tabs, TabsProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import TabList, { TabListProps } from "@mui/lab/TabList";

export const TabStyles = styled(Box)<BoxProps>`
  width: 100%;
`;

export const AllTabList = styled(TabList)<TabListProps>`
  & .MuiTabs-indicator {
    border-radius: 4px;
    border-left: 10px;
    height: 4px;
    background-color: var(--dark-blue);
  }

  .tab {
    padding-bottom: 0px;
    text-transform: none;
    font-size: 20px;

    &.Mui-selected {
      font-weight: 600;
      color: ${({ theme }) => theme.palette.primary.main};
    }
  }
`;
