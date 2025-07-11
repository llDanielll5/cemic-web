import { UserPermissionsJsonInterface } from "types/admin";

export const defaultEmployeePermissions: UserPermissionsJsonInterface = {
  patients: {
    allowed: true,
    permissions: {
      read: true,
      create: false,
      update: false,
      all: false,
    },
  },
  dentists: {
    allowed: false,
    permissions: {
      read: false,
      create: false,
      update: false,
      all: false,
    },
  },
  partners: {
    allowed: false,
    permissions: {
      read: false,
      create: false,
      update: false,
      all: false,
    },
  },
  screenings: {
    allowed: false,
    permissions: {
      read: false,
      create: false,
      update: false,
      all: false,
    },
  },
  treatments: {
    allowed: true,
    permissions: {
      read: true,
      create: false,
      update: false,
      all: false,
    },
  },
  lectures: {
    allowed: false,
    permissions: {
      read: false,
      create: false,
      update: false,
      all: false,
    },
  },
  cashier: {
    allowed: false,
    permissions: {
      read: false,
      create: false,
      update: false,
      all: false,
    },
  },
  warehouse: {
    allowed: false,
    permissions: {
      read: false,
      create: false,
      update: false,
      all: false,
    },
  },
  whatsapp: {
    allowed: false,
    permissions: {
      read: false,
      create: false,
      update: false,
      all: false,
    },
  },
};

export const defaultAdminPermissions: UserPermissionsJsonInterface = {
  patients: {
    allowed: true,
    permissions: {
      read: true,
      create: true,
      update: true,
      all: true,
    },
  },
  dentists: {
    allowed: true,
    permissions: {
      read: true,
      create: true,
      update: true,
      all: true,
    },
  },
  partners: {
    allowed: true,
    permissions: {
      read: true,
      create: true,
      update: true,
      all: true,
    },
  },
  screenings: {
    allowed: true,
    permissions: {
      read: true,
      create: true,
      update: true,
      all: true,
    },
  },
  treatments: {
    allowed: true,
    permissions: {
      read: true,
      create: true,
      update: true,
      all: true,
    },
  },
  lectures: {
    allowed: true,
    permissions: {
      read: true,
      create: true,
      update: true,
      all: true,
    },
  },
  cashier: {
    allowed: true,
    permissions: {
      read: true,
      create: true,
      update: true,
      all: true,
    },
  },
  warehouse: {
    allowed: true,
    permissions: {
      read: true,
      create: true,
      update: true,
      all: true,
    },
  },
  whatsapp: {
    allowed: true,
    permissions: {
      read: true,
      create: true,
      update: true,
      all: true,
    },
  },
};

export const defaultDentistPermissions: UserPermissionsJsonInterface = {
  patients: {
    allowed: false,
    permissions: {
      read: false,
      create: false,
      update: false,
      all: false,
    },
  },
  dentists: {
    allowed: false,
    permissions: {
      read: false,
      create: false,
      update: false,
      all: false,
    },
  },
  partners: {
    allowed: false,
    permissions: {
      read: false,
      create: false,
      update: false,
      all: false,
    },
  },
  screenings: {
    allowed: false,
    permissions: {
      read: false,
      create: false,
      update: false,
      all: false,
    },
  },
  treatments: {
    allowed: false,
    permissions: {
      read: false,
      create: false,
      update: false,
      all: false,
    },
  },
  lectures: {
    allowed: false,
    permissions: {
      read: false,
      create: false,
      update: false,
      all: false,
    },
  },
  cashier: {
    allowed: false,
    permissions: {
      read: false,
      create: false,
      update: false,
      all: false,
    },
  },
  warehouse: {
    allowed: false,
    permissions: {
      read: false,
      create: false,
      update: false,
      all: false,
    },
  },
  whatsapp: {
    allowed: false,
    permissions: {
      all: false,
      create: false,
      read: false,
      update: false,
    },
  },
};
