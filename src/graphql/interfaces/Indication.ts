export interface Indication {
  link: string
  name: string
  track: string
  artist: string
  cover: string
}

export interface IndicationWithId extends Indication {
  id: string
}

export interface IndicationWithState extends Indication {
  state: string
}
