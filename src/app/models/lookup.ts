export interface LookupType {
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

// nested in models to reference multi-value lookups
export interface Lookup {
  value: number;
  text?: string; // left empty for object creation
}
