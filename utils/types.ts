export type IProduct = {
    id: string;
    name: string;
    price: number;
    countInStock: number;
    description: string;
    image: string;
}

export type IUser = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  password: string;
}