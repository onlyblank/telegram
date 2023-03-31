import { getCoursesByUsername } from "../queries/course";
import { Command } from "./types";

const middleware: Command['middleware'] = async (ctx) => {
    const username = ctx.from?.username!;
    const courses = await getCoursesByUsername(username);
    const message = courses.length === 0 
        ? "У вас нет назначенных курсов"
        : courses.map(({ name }, i) => `${i + 1}) ${name}`).join('\n')

    await ctx.reply(message);
}

export const coursesCommand: Command = {
    command: "courses",
    description: "Lists all assigned courses",
    middleware,
}

