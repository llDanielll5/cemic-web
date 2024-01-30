import React, { useState, useEffect } from "react";
import { dentalArch } from "data";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { handleGetTreatments } from "@/axios/admin/treatments";
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
  onSaveTreatments: (data: any) => void;
  setVisible: any;
  previousTreatments: any[];
}

interface TreatmentPlan {
  region: string;
  treatment: {
    name: string;
    price: string;
  };
}

const buttonStyle = {
  margin: "1px 2px",
  padding: "1.8px",
  maxWidth: "20px",
  maxHeight: "24px",
  width: "20px",
  height: "24px",
  fontWeight: 700,
  fontSize: "14px",
  outline: "none",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const TreatmentPlanUpdate = (props: TreatmentPlanUpdateProps) => {
  const { onSaveTreatments, previousTreatments } = props;
  const { lb, lt, rb, rt } = dentalArch;
  const [treatments, setTreatments] = useState<any[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedTreatments, setSelectedTreatments] = useState<TreatmentPlan[]>(
    []
  );

  useEffect(() => {
    if (previousTreatments?.length === 0 || previousTreatments === undefined)
      return;
    setSelectedTreatments((prev) => [...previousTreatments]);
    let previousRegions: any[] = previousTreatments?.map((v) => v?.region);
    setSelectedRegions((prev) => [...prev, ...previousRegions]);
  }, [previousTreatments]);

  const handleAddRegion = (region: string) => {
    if (selectedTreatments.length === 0) {
      setSelectedRegions([region]);
      setSelectedTreatments([{ region, treatment: { name: "", price: "" } }]);
    } else {
      setSelectedRegions((prev) => [...prev, region]);
      setSelectedTreatments((prev) => [
        ...prev,
        { region, treatment: { name: "", price: "" } },
      ]);
      return;
    }
  };

  const hasSelected = (t: string) => {
    const findRegion = selectedRegions.find((v) => v === t);
    if (!findRegion) return "primary";
    else return "warning";
  };

  const renderRegions = (tooths: string[]) => {
    return tooths.map((v, i) => (
      <Button
        key={i}
        variant="contained"
        color={hasSelected(v)}
        onClick={() => handleAddRegion(v)}
        sx={{ ...buttonStyle }}
      >
        {v}
      </Button>
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
    const hasValues = selectedTreatments.filter((v) => v.treatment.name === "");
    if (hasValues.length > 0)
      return alert("Adicione os tratamentos para as regiões escolhidas!");
    return onSaveTreatments(selectedTreatments);
  };

  useEffect(() => {
    const getTreatments = async () => {
      return await handleGetTreatments().then(
        (res) => {
          let data = res.data.data;
          let mapped = data?.map((v: any) => ({
            name: v.attributes.name,
            price: v.attributes.price,
          }));
          setTreatments(mapped);
        },
        (err) => console.log(err.response)
      );
    };

    getTreatments();
  }, []);

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      width={"100%"}
      mx={"auto"}
      sx={{ position: "relative" }}
      minWidth={"450px"}
    >
      <Typography variant="h6" alignSelf={"center"} textAlign={"center"} mb={2}>
        Escolha a região e o tratamento necessário!
      </Typography>

      <OtherRegions>
        <Box width="100%">
          <Button
            fullWidth
            variant="contained"
            color={hasSelected("Superior Total")}
            onClick={() => handleAddRegion("Superior Total")}
          >
            Superior Total
          </Button>
          <Box display="flex" columnGap={1} mt={1}>
            <Button
              fullWidth
              variant="contained"
              color={hasSelected("Sup. Dir.")}
              onClick={() => handleAddRegion("Sup. Dir.")}
            >
              Sup. Dir.
            </Button>
            <Button
              fullWidth
              variant="contained"
              color={hasSelected("Sup. Esq.")}
              onClick={() => handleAddRegion("Sup. Esq.")}
            >
              Sup. Esq.
            </Button>
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
          <Box display="flex" columnGap={1} mb={1}>
            <Button
              fullWidth
              variant="contained"
              color={hasSelected("Inf. Dir.")}
              onClick={() => handleAddRegion("Inf. Dir.")}
            >
              Inf. Dir.
            </Button>
            <Button
              fullWidth
              variant="contained"
              color={hasSelected("Inf. Esq.")}
              onClick={() => handleAddRegion("Inf. Esq.")}
            >
              Inf. Esq.
            </Button>
          </Box>
          <Button
            fullWidth
            variant="contained"
            color={hasSelected("Inferior Total")}
            onClick={() => handleAddRegion("Inferior Total")}
          >
            Inferior Total
          </Button>
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
            value={v?.treatment}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) =>
              option.name === value?.name && option.price === value.price
            }
            onChange={(e, v) => {
              const clone = [...selectedTreatments];
              let value = { name: v.name, price: v.price };
              clone[i].treatment = value;
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
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 1 }}
          endIcon={<SaveIcon />}
          onClick={handleSubmit}
        >
          Salvar
        </Button>
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
