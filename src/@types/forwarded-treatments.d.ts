type FORWARDED_TREATMENTS_STATUS =
  | "WAITING"
  | "FINISHED"
  | "RETURNED"
  | "SCHEDULED";

interface ForwardedTreatmentsInterface {
  date: string | Date;
  treatment:
    | PatientTreatmentInterface
    | StrapiRelationData<PatientTreatmentInterface>;
  obs: string;
  patient: PatientInterface | StrapiRelationData<PatientInterface>;
  adminInfos?: AdminInfosInterface;
  inProgress: boolean;
  dentist: DentistInterface | StrapiRelationData<DentistInterface>;
  status: FORWARDED_TREATMENTS_STATUS;
}
