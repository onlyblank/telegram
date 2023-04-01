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

    export interface Course extends Updatable {
        id: number;
        name: string,
    }

    export interface Test extends Updatable {
        id: number,
        title: string,
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
