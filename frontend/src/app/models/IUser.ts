export default interface IUser {
    _id:string;
    name: string;
    nickname: string;
    email: string;
    password: string;
    birthDate: string;
    createdAt: Date;
    lastActivity: Date;
    receivedStars: Array<String>;
    sentStars: Array<String>;
    stars: Array<Object>;
}
