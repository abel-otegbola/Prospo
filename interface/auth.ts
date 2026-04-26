export interface IUser {
    uid: string;
    fullname: string;
    displayName?: string;
    email: string;
    isEmailVerified: boolean;
    createdAt?: string;
    updatedAt?: string;
    specialty?: string;
    photoURL?: string;

}