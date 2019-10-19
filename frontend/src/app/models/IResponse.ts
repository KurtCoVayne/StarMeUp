import IUser from './IUser';

interface Body {
    token: string;
    user: IUser;
}
export interface IResponse {
    readonly ok: boolean;
    readonly status: number;
    readonly statusText: string;
    readonly data: Body;
}
