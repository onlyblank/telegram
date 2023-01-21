interface Updatable {
    createdAt: string;
    updatedAt: string;
}

export namespace CMS {
    export interface User extends Updatable {
        id: number;
        username: string;
        email: string;
        confirmed: boolean;
        blocked: boolean;
        tg_username: string | null;
    }
}
