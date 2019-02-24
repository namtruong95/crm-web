export enum Roles {
  BRANCH_DIRECTOR = 'Branch_Director',
  BRANCH_SALE_STAFF = 'Branch_Sale_Staff',
  HQ_SALE_STAFF = 'HQ_Sale_Staff',
  SALE_DIRECTOR = 'Sale_Director',
  MYTEL_ADMIN = 'Mytel_Admin',
}

export const ROLES = [
  {
    label: 'Admin',
    value: Roles.MYTEL_ADMIN,
  },
  {
    label: 'Branch Director',
    value: Roles.BRANCH_DIRECTOR,
  },
  {
    label: 'Sale Director',
    value: Roles.SALE_DIRECTOR,
  },
  {
    label: 'Branch Sale Staff',
    value: Roles.BRANCH_SALE_STAFF,
  },
  {
    label: 'HQ Sale Staff',
    value: Roles.HQ_SALE_STAFF,
  },
];
