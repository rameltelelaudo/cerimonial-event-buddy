
import { Guest, GuestGroup } from "../types/guest";
import { v4 as uuidv4 } from 'uuid';

export const initialGuests: Guest[] = [
  {
    id: uuidv4(),
    name: "Ana Silva",
    email: "ana.silva@email.com",
    group: "Família",
    companions: 2,
    notes: "Alergia a nozes",
    checkedIn: true,
    checkInTime: new Date(2023, 3, 15, 18, 30)
  },
  {
    id: uuidv4(),
    name: "Carlos Oliveira",
    email: "carlos.oliveira@email.com",
    group: "Amigos",
    companions: 1,
    notes: "",
    checkedIn: false
  },
  {
    id: uuidv4(),
    name: "Mariana Santos",
    email: "mariana.santos@email.com",
    group: "Padrinhos",
    companions: 1,
    notes: "Mesa principal",
    checkedIn: true,
    checkInTime: new Date(2023, 3, 15, 18, 15)
  },
  {
    id: uuidv4(),
    name: "Paulo Costa",
    email: "paulo.costa@email.com",
    group: "Colegas de Trabalho",
    companions: 0,
    notes: "",
    checkedIn: false
  },
  {
    id: uuidv4(),
    name: "Fernanda Lima",
    email: "fernanda.lima@email.com",
    group: "Família",
    companions: 3,
    notes: "Crianças pequenas",
    checkedIn: false
  },
  {
    id: uuidv4(),
    name: "Roberto Alves",
    email: "roberto.alves@email.com",
    group: "Amigos",
    companions: 1,
    notes: "",
    checkedIn: true,
    checkInTime: new Date(2023, 3, 15, 19, 0)
  },
  {
    id: uuidv4(),
    name: "Juliana Martins",
    group: "Fornecedores",
    companions: 2,
    notes: "Fotógrafa e assistentes",
    checkedIn: true,
    checkInTime: new Date(2023, 3, 15, 17, 0)
  },
  {
    id: uuidv4(),
    name: "Pedro Souza",
    email: "pedro.souza@email.com",
    group: "Outros",
    companions: 0,
    notes: "",
    checkedIn: false
  }
];

export const guestGroups: GuestGroup[] = [
  "Família",
  "Padrinhos",
  "Amigos",
  "Colegas de Trabalho",
  "Fornecedores",
  "Outros"
];
