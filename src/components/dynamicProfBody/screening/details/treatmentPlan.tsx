import React, { useState, useEffect } from "react";
import { dentalArch } from "data";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/services/firebase";
import { StyledButton } from "@/components/dynamicAdminBody/receipts";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import {
  Box,
  Typography,
  styled,
  Button,
  Autocomplete,
  TextField,
  IconButton,
} from "@mui/material";

interface TreatmentPlanUpdateProps {
  onSaveTreatments: (field: string, value: any[]) => void;
  setVisible: any;
  previousTreatments: any[];
}

interface TreatmentPlan {
  region: string;
  treatments: {
    cod: string;
    name: string;
    price: string;
  };
}

const buttonStyle = {
  margin: "1px 2px",
  padding: "1.8px",
  width: "20px",
  height: "24px",
  fontWeight: 500,
  color: "white",
  outline: "none",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const TreatmentPlanUpdate = (props: TreatmentPlanUpdateProps) => {
  const { onSaveTreatments, previousTreatments } = props;
  const { lb, lt, rb, rt } = dentalArch;
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedTreatments, setSelectedTreatments] = useState<TreatmentPlan[]>(
    []
  );
  const [treatments, setTreatments] = useState<any[]>([]);

  useEffect(() => {
    if (previousTreatments?.length === 0 || previousTreatments === undefined)
      return;
    setSelectedTreatments((prev) => [...previousTreatments]);
    let previousRegions: any[] = previousTreatments?.map((v) => v?.region);
    setSelectedRegions((prev) => [...prev, ...previousRegions]);
  }, [previousTreatments]);

  useEffect(() => {
    const getTreatments = async () => {
      const ref = collection(db, "treatments");
      const querySnap = await getDocs(ref);
      const treats: any[] = [];
      querySnap.forEach((doc) => {
        treats.push(doc.data());
      });

      setTreatments(treats);
    };

    getTreatments();
  }, []);

  const handleAddRegion = (region: string) => {
    if (selectedTreatments.length === 0) {
      setSelectedRegions([region]);
      setSelectedTreatments([
        { region, treatments: { cod: "", name: "", price: "" } },
      ]);
    } else {
      setSelectedRegions((prev) => [...prev, region]);
      setSelectedTreatments((prev) => [
        ...prev,
        { region, treatments: { cod: "", name: "", price: "" } },
      ]);
      return;
    }
  };

  const hasSelected = (t: string) => {
    const findRegion = selectedRegions.find((v) => v === t);
    if (!findRegion) return "var(--dark-blue)";
    else return "orangered";
  };

  const renderRegions = (tooths: string[]) => {
    return tooths.map((v, i) => (
      <button
        key={i}
        className={"opacity0"}
        onClick={() => handleAddRegion(v)}
        style={{ ...buttonStyle, backgroundColor: hasSelected(v) }}
      >
        {v}
      </button>
    ));
  };

  const handleDeleteRegion = (i: number, region: string) => {
    const clone = [...selectedTreatments];
    const cloneReg = [...selectedRegions];
    const filter = clone.filter((v, index) => index !== i);
    const filterReg = cloneReg.filter((v) => v !== region);
    setSelectedTreatments(filter);
    setSelectedRegions(filterReg);
    return;
  };

  const handleSubmit = async () => {
    const hasValues = selectedTreatments.filter(
      (v) => v.treatments.name === ""
    );
    if (hasValues.length > 0)
      return alert("Adicione os tratamentos para as regiões escolhidas!");
    return onSaveTreatments("treatment_plan", selectedTreatments);
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      width={"100%"}
      mx={"auto"}
      sx={{ position: "relative" }}
      minWidth={"450px"}
    >
      <IconClose onClick={() => props.setVisible(false)}>
        <HighlightOffIcon />
      </IconClose>
      <Typography
        variant="subtitle1"
        alignSelf={"center"}
        textAlign={"center"}
        mt={5}
        mb={2}
      >
        Escolha a região e o tratamento necessário!
      </Typography>

      <OtherRegions>
        <Box width="100%">
          <StyledButton
            sx={{
              width: "100%",
              backgroundColor: hasSelected("Superior Total"),
            }}
            onClick={() => handleAddRegion("Superior Total")}
          >
            Superior Total
          </StyledButton>
          <Box display="flex" columnGap={1}>
            <StyledButton
              sx={{ width: "50%", backgroundColor: hasSelected("Sup. Dir.") }}
              onClick={() => handleAddRegion("Sup. Dir.")}
            >
              Sup. Dir.
            </StyledButton>
            <StyledButton
              sx={{ width: "50%", backgroundColor: hasSelected("Sup. Esq.") }}
              onClick={() => handleAddRegion("Sup. Esq.")}
            >
              Sup. Esq.
            </StyledButton>
          </Box>
        </Box>
      </OtherRegions>

      <GridColumns>
        <Div1>{renderRegions(lt)}</Div1>
        <div className="div2">{renderRegions(rt)}</div>
        <div className="div3">{renderRegions(lb)}</div>
        <div className="div4">{renderRegions(rb)}</div>
      </GridColumns>

      <OtherRegions>
        <Box width="100%">
          <Box display="flex" columnGap={1}>
            <StyledButton
              sx={{ width: "50%", backgroundColor: hasSelected("Inf. Dir.") }}
              onClick={() => handleAddRegion("Inf. Dir.")}
            >
              Inf. Dir.
            </StyledButton>
            <StyledButton
              sx={{ width: "50%", backgroundColor: hasSelected("Inf. Esq.") }}
              onClick={() => handleAddRegion("Inf. Esq.")}
            >
              Inf. Esq.
            </StyledButton>
          </Box>
          <StyledButton
            sx={{
              width: "100%",
              backgroundColor: hasSelected("Inferior Total"),
            }}
            onClick={() => handleAddRegion("Inferior Total")}
          >
            Inferior Total
          </StyledButton>
        </Box>
      </OtherRegions>

      {selectedTreatments?.map((v, i) => (
        <AddedRegion key={i} my={1}>
          <IconButton
            title={"Deletar a região " + v?.region}
            onClick={() => handleDeleteRegion(i, v?.region)}
          >
            <DeleteIcon color="warning" />
          </IconButton>
          <Typography variant="subtitle1" width={"10%"} mx={"2%"}>
            {v.region} -{" "}
          </Typography>

          <Autocomplete
            options={treatments}
            sx={{ width: "85%" }}
            limitTags={2}
            value={v?.treatments}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) =>
              option.name === value?.name
            }
            onChange={(e, v) => {
              const clone = [...selectedTreatments];
              clone[i].treatments = v;
              setSelectedTreatments(clone);
            }}
            renderInput={(params) => (
              <TextInput
                {...params}
                placeholder="Selecione o tratamento."
                variant="standard"
              />
            )}
          />
        </AddedRegion>
      ))}

      {selectedTreatments.length > 0 && (
        <SaveButton
          variant="contained"
          sx={{ backgroundColor: "var(--dark-blue)", color: "white" }}
          endIcon={<SaveIcon />}
          onClick={handleSubmit}
        >
          Salvar
        </SaveButton>
      )}
    </Box>
  );
};

const OtherRegions = styled(Box)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 415px;
  min-width: 415px;
  margin: 8px auto;
  column-gap: 8px;
`;

const GridColumns = styled(Box)`
  display: grid;
  width: 100%;
  min-height: 300px;
  max-width: 415px;
  min-width: 415px;
  background-image: url("/images/arcada.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-row-gap: 8px;
  position: relative;
  margin: 8px auto;
  .div2 {
    display: flex;
    grid-area: 1 / 2 / 2 / 3;
    position: absolute;
    bottom: 0px;
    left: 6px;
  }
  .div3 {
    display: flex;
    grid-area: 2 / 1 / 2 /2;
    position: absolute;
    top: 0px;
    right: 4px;
  }
  .div4 {
    display: flex;
    grid-area: 2 / 2 / 3 / 3;
    position: absolute;
    top: 0px;
    left: 6px;
  }
`;

const Div1 = styled(Box)`
  display: flex;
  grid-area: 1 / 1 / 2 / 2;
  position: absolute;
  bottom: 0;
  right: 4px;
`;

const AddedRegion = styled(Box)`
  display: flex;
  align-items: center;
  border: 1.2px solid #bbb;
  padding: 2px;
  border-radius: 4px;
`;

const SaveButton = styled(Button)`
  :hover {
    color: var(--dark-blue);
  }
`;

const TextInput = styled(TextField)`
  border-radius: 4px;
  .MuiAutocomplete-input {
    border: none;
    outline: none;
  }
`;

export const IconClose = styled(IconButton)`
  position: absolute;
  top: 8px;
  right: 8px;
`;

export default TreatmentPlanUpdate;
