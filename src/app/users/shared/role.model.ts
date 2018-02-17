export enum RoleEnum {
  Free = 3,
  Premium = 4,
  Stakeholder = 2,
  Admin = 1
}

export class Role {
  constructor(public id: RoleEnum, public name: String) { }
}