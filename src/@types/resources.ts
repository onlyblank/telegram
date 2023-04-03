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
        name: string;
    }

    export interface Test extends Updatable {
        id: number;
        title: string;
    }

    interface TextField {
        __component: "task-field.text";
        id: number;
        text: string;
    }
    
    interface RichTextField {
        __component: "task-field.rich-text";
        id: number;
        text: string;
    }
    
    interface CodeField {
        __component: "task-field.code";
        id: number;
        code: string;
        language: string;
    }

    export interface Task extends Updatable {
        id: number;
        fields: (TextField | RichTextField | CodeField)[];
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
        jwt: string;
        user: GET.User;
    }
}
