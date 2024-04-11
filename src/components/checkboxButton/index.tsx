import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  Fade,
  Modal,
  Typography,
  colors,
  styled,
  useTheme,
} from "@mui/material";

interface CheckboxProps {
  text: string;
  hour?: string;
  modalMessage: string;
  defaultCheck: boolean;
  onChangeChecked: (state: boolean) => void;
}

const CheckboxButton = (props: CheckboxProps) => {
  const [state, setState] = useState(props.defaultCheck);
  const [modal, setModal] = useState(false);

  const handleConfirm = () => {
    if (!state) setModal(true);
    else return;
  };

  useEffect(() => {
    props.onChangeChecked(state);
  }, [state]);

  return (
    <>
      <Container elevation={7} onClick={handleConfirm}>
        <input type="checkbox" checked={state} onChange={handleConfirm} />
        <Typography variant="subtitle1">{props.text}</Typography>

        <Typography variant="body1">{props.hour ?? "--:--"}</Typography>
      </Container>
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        closeAfterTransition
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Fade in={modal}>
          <Box sx={{ backgroundColor: "white", p: 4, borderRadius: 1 }}>
            <Typography variant="subtitle1" mb={2}>
              {props.modalMessage}
            </Typography>

            <Box
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              columnGap={1}
            >
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  setState(true);
                  setModal(false);
                }}
              >
                Sim
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setModal(false)}
              >
                Não
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

const Container = styled(Card)`
  padding: 1rem 1.5rem;
  border-radius: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 2px solid ${colors.blue.A200};
  max-width: 500px;
  min-width: 50%;
  cursor: pointer;
  :hover {
    opacity: 0.7;
  }
`;

export default CheckboxButton;
