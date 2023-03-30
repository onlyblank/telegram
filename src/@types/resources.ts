interface Updatable {
    createdAt: string;
    updatedAt: string;
}

export namespace GET {
    export interface User extends Updatable {
        id: number;
        username: string;
        email: string;
        telegram_username: string | null;
        confirmed: boolean;
        blocked: boolean;
    }
}

export namespace POST {
    export interface User {
        username: string;
        email: string;
        confirmed?: boolean;
        blocked?: boolean;
    }

    export interface RegisteredUserData {
        jwt: string,
        user: GET.User,
    }
}