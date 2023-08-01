export interface Indication {
  link: string
  name: string
  track: string
}

export interface IndicationWithId extends Indication {
  id: string
}

export interface IndicationWithState extends Indication {
  state: string
}
