import { Role, RoleEnum } from './role.model';

import { GroupModel } from '../../shared/checkbox-group/group.model';

export class Settings {
  constructor(
    public username: String,
    public email: String,
    public servings: Number,
    public role: Role,
    public groups: GroupModel[]) { }

  get isAdmin() {
    return this.role && this.role.id == RoleEnum.Admin;
  }

  get isStakeholder() {
    return this.role && this.role.id == RoleEnum.Stakeholder;
  }

  get isPremium() {
    return this.role && this.role.id == RoleEnum.Premium;
  }

  get isFree() {
    return this.role && this.role.id == RoleEnum.Free;
  }
}