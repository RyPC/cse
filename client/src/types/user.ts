export type User = {
  id: number;
  email: string;
  firebaseUid: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin";
  userRole: "student" | "teacher" | "admin";
};
