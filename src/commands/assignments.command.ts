import { Command } from "./types";

const middleware: Command['middleware'] = async (ctx) => {

}

export const assignmentsCommand: Command = {
    command: 'assignments',
    description: 'Lists all assignments',
    middleware,
}