export interface Lookup {
  lookupType: string;
  values: LookupValue[];
}

export interface LookupValue {
  lookupValue: number; // | undefined
  disabled: boolean;
  default: boolean;
  indicator: string;
  textEN: string;
  textDE: string;
}
