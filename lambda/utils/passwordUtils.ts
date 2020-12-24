import bcrypt = require('bcryptjs');
import jwt = require('jsonwebtoken');
import { IUser } from '../../utils/types';

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

export const decodePassword = async (hashedPassword: string, password: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (email: string, secret: string): string => {
    return jwt.sign({ userEmail: email }, secret, {
        expiresIn: '2d'
    });
}