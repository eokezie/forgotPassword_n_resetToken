import { Types } from "mongoose";

export type TUserRegRequest = {
    password: string;
    email: string;
    name: string;
    token?: string
}