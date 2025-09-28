export interface Person {
  id: string;              // unique identifier if needed for keyed lists
  name: string;
  dob: string;             // "MM/DD/YYYY" or ISO "YYYY-MM-DD"
  color?: string;          // optional UI color for that person’s card
}

export const persons: Person[] = [
  {
    id: "oliver",
    name: "Oliver Ramon Abreu",
    dob: "09/02/1989",
    color: "#007aff"
  },
  {
    id: "cara",
    name: "Cara Grace Abreu",
    dob: "04/01/1992"
  },
  {
    id: "ezekiel",
    name: "Ezekiel Oliver Abreu",
    dob: "01/08/2021"
  },
  {
    id: "elias",
    name: "Elias James Abreu",
    dob: "08/17/2022"
  }
];
