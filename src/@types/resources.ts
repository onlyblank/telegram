interface Updatable {
    createdAt: string;
    updatedAt: string;
}

interface Identifiable {
    id: number;
}

export interface StrapiGetResponse<Model extends Identifiable> {
    data: { 
        id: Model['id'];
        attributes: Omit<Model, 'id'>;
    };
    meta: Record<any, any>;
} 

export namespace GET {
    export interface User extends Updatable, Identifiable {
        username: string;
        email: string;
        telegram_username: string | null;
        confirmed: boolean;
        blocked: boolean;
    }

    export interface Course extends Updatable, Identifiable {
        name: string;
    }

    export interface Test extends Updatable, Identifiable {
        title: string;
    }

    export interface ExtendedTestInformation extends Test {
        tasksCount: number;
        solvedTasksCount: number;
    };

    export interface TextField extends Identifiable {
        __component: "task-field.text";
        text: string;
    }
    
    export interface RichTextField extends Identifiable {
        __component: "task-field.rich-text";
        text: string;
    }
    
    export interface CodeField extends Identifiable{
        __component: "task-field.code";
        code: string;
        language: string;
    }

    export interface Task extends Updatable, Identifiable {
        fields: (TextField | RichTextField | CodeField)[];
        telegram_file_id: string;
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
