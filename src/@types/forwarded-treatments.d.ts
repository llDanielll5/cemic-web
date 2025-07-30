type FORWARDED_TREATMENTS_STATUS =
  | "WAITING"
  | "FINISHED"
  | "RETURNED"
  | "SCHEDULED"
  | "REMAKE"
  | "CANCELLED"
  | "WAITING_MATERIAL"
  | "WAITING_COMPONENTS"
  | "WAITING_IMPLANTS";

interface ForwardedTreatmentsInterface {
  date: string | Date;
  obs: string;
  patient: PatientInterface | StrapiRelationData<PatientInterface> | number;
  adminInfos?: AdminInfosInterface;
  inProgress: boolean;
  dentist: DentistInterface | StrapiRelationData<DentistInterface> | number;
  status: FORWARDED_TREATMENTS_STATUS;
  treatment:
    | PatientTreatmentInterface
    | StrapiRelationData<PatientTreatmentInterface>
    | number;
}
