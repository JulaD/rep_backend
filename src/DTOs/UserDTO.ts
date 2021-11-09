export interface UserCreateDTO {
  name: string;
  email: string;
  organization: string;
  password: string;
}

export interface UserUpdateDTO {
  name: string;
  organization: string;
  password: string;
  repeat: string;
}

export interface UserLoginDTO {
  email: string;
  password: string;
}

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  organization: string;
  type: number;
  status: number;
  active: boolean;
  createdAt: Date;
}
