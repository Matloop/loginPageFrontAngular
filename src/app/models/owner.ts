import { Address } from "./address";

export interface Owner{
  id : number,
  nome : string,
  email : string,
  phone : string,
  enderecos : Address[]
}
