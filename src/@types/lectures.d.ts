interface WAScheduleInterface {
  from: string;
  device: string;
  name: string;
  day: string;
  hour: string;
  feedback: string;
  otherRegions: string;
  match: boolean;
  stage: number;
  location: LOCATION_FILIAL;
  createdAt: string;
  updatedAt: string;
  dayWeek: string;
  treatments: "clinic" | "implant";
  indication: any | null;
  indicationCPF: string | null;
  date: string;
}

interface LecturesInterface {
  dateString: string | null;
  isMissed: boolean;
  examRequest: boolean;
  hour: string;
  createdAt: string;
  updatedAt: string;
  date: string;
  timestamp: string;
  wa_schedule?: StrapiRelationData<WAScheduleInterface> | WAScheduleInterface;
  patient?: StrapiRelationData<PatientInterface> | PatientInterface;
}
