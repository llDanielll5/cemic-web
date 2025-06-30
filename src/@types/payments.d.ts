interface PaymentsInterface {
  adminInfos: any;
  date: Date;
  patient: any;
  total_value: number;
  discount: number;
  description: string;
  payment_shapes: any;
  bank_check_infos: any[];
  cashier_info?: any;
  hasFundCredit?: boolean;
  hasFundPayed?: boolean;
}
