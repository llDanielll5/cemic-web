import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";

export const StyledTable = styled(TableCell)`
  background-color: #ececec;
  .chevronDown {
    margin-left: 8px;
  }
`;

export const NotHaveFiscalContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-direction: column;
  margin: 50px auto 60px auto;
`;

export const IconContainer = styled(Box)`
  background-color: rgba(19, 79, 216, 0.1);
  margin-bottom: 20px;
  padding: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledTableContainer = styled(TableContainer)`
  background: #ffffff;
  box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  border: 1.5px solid #bbb;
  margin-top: 16px;
`;
