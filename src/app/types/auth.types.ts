export interface RegisterPayload {
  username: string;
  fullName: string;
  email: string;
  password: string;
}

export interface RegisterFormValues {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
}
