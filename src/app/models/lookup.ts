export interface Lookup {
  lookupType: string;
  values: LookupValue[];
}

export interface LookupValue {
  lookupValue: number;
  disabled: boolean;
  default: boolean;
  indicator: string;
  textEN: string;
  textDE: string;
}
