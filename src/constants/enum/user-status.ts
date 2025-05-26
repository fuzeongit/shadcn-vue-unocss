export enum UserStatus {
  Normal,
  Frozen
}

export const UserStatusDictionary = {
  [UserStatus.Normal]: '正常',
  [UserStatus.Frozen]: '已冻结'
};
