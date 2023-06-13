/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import styles from "../../../styles/Admin.module.css";
import FilterLetter from "@/components/filterLetter";
import s from "../../../styles/Professional.module.css";
import Filter from "@/components/filter";
import { useOnSnapshotQuery } from "@/hooks/useOnSnapshotQuery";
import { defaultImage } from "@/services/services";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/services/firebase";
import { Typography, Box } from "@mui/material";
import Modal from "@/components/modal";
import ProfessionalsAdminDetails from "./details";

interface ProfessionalsAdminProps {
  professionalFilterType: any;
  handleSetContentProfessionals: any;
  professionalFilterValue: any;
  setProfessionalFilterValue: any;
}

const ProfessionalsAdmin = (props: ProfessionalsAdminProps) => {
  const {
    handleSetContentProfessionals,
    professionalFilterValue,
    setProfessionalFilterValue,
  } = props;

  const [profDetailsVisible, setProfDetailsVisible] = useState(false);
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [profDetails, setProfDetails] = useState<any | null>(null);
  const [filterLetter, setFilterLetter] = useState("A");
  const [filterValue, setFilterValue] = useState("");
  const ref = collection(db, "professionals");
  const q = query(ref, where("firstLetter", "==", filterLetter));
  const snapProfessionals = useOnSnapshotQuery("professionals", q, [
    filterLetter,
  ]);

  const handleFilterProfessional = async () => {
    const documents: any[] = [];
    const queryRef = collection(db, "professionals");
    const querySnap = query(queryRef, where("cpf", "==", filterValue));

    const querySnapshot = await getDocs(querySnap);
    querySnapshot.forEach((doc) => {
      documents.push(doc.data());
    });
    setProfessionals(documents);
  };

  useEffect(() => {
    setFilterLetter("A");
    setFilterValue("");
  }, []);

  useEffect(() => {
    setProfessionals(snapProfessionals);
  }, [snapProfessionals, filterLetter, filterValue]);

  const getImage = (img: string) => {
    if (img) return img;
    else return defaultImage;
  };

  const handleGetDetails = (infos: any) => {
    setProfDetails(infos);
    setProfDetailsVisible(true);
  };

  const renderProfessionals = ({ item, index }: any) => (
    <div
      key={index}
      className={s["professional-single"]}
      onClick={() => handleGetDetails(item)}
    >
      <img src={getImage(item.profileImage)} alt="" className={s.avatar}></img>
      <p>{item?.name}</p>
      <span>{item?.cro}</span>
    </div>
  );

  return (
    <div className={styles.patients}>
      <Modal
        visible={profDetailsVisible}
        closeModal={() => setProfDetailsVisible(false)}
      >
        {profDetails !== null && (
          <ProfessionalsAdminDetails informations={profDetails} />
        )}
      </Modal>
      <Filter
        title="Filtrar dentista por:"
        options={["CPF"]}
        content={"CPF"}
        filterValue={professionalFilterValue}
        setContent={(e) => handleSetContentProfessionals(e)}
        setFilterValue={(e) => setProfessionalFilterValue(e)}
        onClick={handleFilterProfessional}
        baseStyle={{
          margin: "20px auto",
          padding: "16px",
        }}
      />

      <FilterLetter
        letter={filterLetter}
        setLetter={(l) => setFilterLetter(l)}
      />

      <div className={s.professionals}>
        {professionals.length > 0 && (
          <div className={s.informations}>
            <div />
            <p>Nome:</p>
            <p>CRO:</p>
          </div>
        )}
        {professionals.length > 0 &&
          professionals.map((item, index) =>
            renderProfessionals({ item, index })
          )}
        {professionals.length === 0 && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            mt={4}
          >
            <Typography variant="semibold">
              Não há profissional com esta letra ou dado
            </Typography>
          </Box>
        )}
      </div>
    </div>
  );
};

export default ProfessionalsAdmin;
