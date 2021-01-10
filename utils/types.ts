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

type OrderedProduct = IProduct & {
  qty: number;
}

type Delivery = {
  addressLine1: string;
  addressLine2: string;
  postCode: string;
  country: string;
}

export type IOrder = {
  id: string;
  product: OrderedProduct[],
  user: IUser,
  delivery: Delivery
}