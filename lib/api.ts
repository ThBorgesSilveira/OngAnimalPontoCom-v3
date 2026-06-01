import axios from "axios";
import { PersonType } from "@/lib/enums/person-type";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
});

type AddressPayload = {
  state: string;
  city: string;
  district: string;
  street: string;
  number?: string;
  postalCode: string;
};

type PersonPayload = {
  name: string;
  personType: PersonType;
  cpfCnpj: string;
  address: AddressPayload;
};

export async function createPersonWithAddress(payload: PersonPayload) {
  const normalizedPostalCode = payload.address.postalCode.replace(/\D/g, "").slice(0, 8);
  const normalizedCpfCnpj = payload.cpfCnpj.replace(/\D/g, "").slice(0, 20);

  const addressResponse = await api.post("/address", {
    countryCode: "BR",
    state: payload.address.state,
    city: payload.address.city,
    district: payload.address.district,
    street: payload.address.street,
    number: payload.address.number ?? "",
    postalCode: normalizedPostalCode,
  });

  const personResponse = await api.post("/person", {
    name: payload.name,
    personType: payload.personType,
    cpfCnpj: normalizedCpfCnpj,
    addressId: addressResponse.data.id,
  });

  return personResponse.data;
}
