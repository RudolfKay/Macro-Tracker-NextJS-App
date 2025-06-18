// In-memory user storage (replace with database later)
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export let users: User[] = [
  {
    id: "1",
    name: "Test User",
    email: "test@example.com",
    password: "password123", // In production, use hashed passwords
  },
];

export const addUser = (user: Omit<User, "id">) => {
  const newUser = {
    ...user,
    id: (users.length + 1).toString(),
  };
  users.push(newUser);
  return newUser;
};

export const findUserByEmail = (email: string) => {
  return users.find((user) => user.email === email);
};

export const findUserByCredentials = (email: string, password: string) => {
  return users.find(
    (user) => user.email === email && user.password === password
  );
}; 