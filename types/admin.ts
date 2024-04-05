export interface AdminInfosInterface {
  created: any;
  updated?: any;
  createTimestamp?: Date;
  updateTimestamp?: Date;
}

export interface UserPermissionsJsonInterface {
  patients: {
    allowed: boolean;
    permissions: {
      read: boolean;
      create: boolean;
      update: boolean;
      all: boolean;
    };
  };
  dentists: {
    allowed: boolean;
    permissions: {
      read: boolean;
      create: boolean;
      update: boolean;
      all: boolean;
    };
  };
  partners: {
    allowed: boolean;
    permissions: {
      read: boolean;
      create: boolean;
      update: boolean;
      all: boolean;
    };
  };
  screenings: {
    allowed: boolean;
    permissions: {
      read: boolean;
      create: boolean;
      update: boolean;
      all: boolean;
    };
  };
  treatments: {
    allowed: boolean;
    permissions: {
      read: boolean;
      create: boolean;
      update: boolean;
      all: boolean;
    };
  };
  lectures: {
    allowed: boolean;
    permissions: {
      read: boolean;
      create: boolean;
      update: boolean;
      all: boolean;
    };
  };
  cashier: {
    allowed: boolean;
    permissions: {
      read: boolean;
      create: boolean;
      update: boolean;
      all: boolean;
    };
  };
  warehouse: {
    allowed: boolean;
    permissions: {
      read: boolean;
      create: boolean;
      update: boolean;
      all: boolean;
    };
  };
}
