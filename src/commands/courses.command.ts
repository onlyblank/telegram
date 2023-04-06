import { getUserId } from "../queries/user";
import { getAssignedCourses } from "../queries/course";
import { Command } from "./types";

const middleware: Command['middleware'] = async (ctx) => {
    const username = ctx.from?.username!;
    const userId = await getUserId(username);
    const courses = !userId ? [] : await getAssignedCourses(userId);
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

