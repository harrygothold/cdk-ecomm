import axios from 'axios';

interface User {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    password: string;
}

export const checkIsAdmin = async (token: string): Promise<boolean> => {
  const { data } = await axios.get(`https://kio1kws9lb.execute-api.eu-west-2.amazonaws.com/prod/${token}`);
  const user: User = data;
  if (!user.isAdmin) {
      return false;
  }
  return true;
}