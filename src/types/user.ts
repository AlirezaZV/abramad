export interface UserData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  date: string; // ISO timestamp captured when the user finishes the game
}

export type UserFormPayload = Omit<UserData, "date">;
