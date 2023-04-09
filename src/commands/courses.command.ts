import { getUserId } from "../queries/user";
import { CoursePopulated, getAssignedAndOwnedCourses,  getCourseExtendedInformation, isCourseOwner } from "../queries/course";
import { Command } from "./types";
import { Bot, CommandContext } from "grammy";
import { MyContext } from "src/types";
import { GET } from "src/@types/resources";
import { withKeyboard } from "./utils";
import { getTest, getUsersWithUnsolvedTasks, isTestOwner, publishTest } from "../queries/test";

interface MenuPipeline<TArgs extends any[], TRegex, TParams> {
    route: TRegex;
    parse: (regex: TRegex) => TParams;
    entryPoint: (ctx: MyContext) => Promise<TArgs>;
    action: (...args: TArgs) => Promise<any>;
}


const courseRoute = /^courses\/(\d+)$/;

const useCourseCallback = (bot: Bot<MyContext>) =>  {
    bot.callbackQuery(courseRoute, async (ctx) => {
        const courseId = +ctx.match[1];
        const username = ctx.from?.username;
        const userId = await getUserId(username!);
        
        const hasAccess = await isCourseOwner(courseId, userId!);
        if(!hasAccess) {
            return await ctx.answerCallbackQuery("У вас нет доступа для просмотра информации");
        }
        const course = await getCourseExtendedInformation(courseId);

        if(course === null){
            return await ctx.answerCallbackQuery("Информация о курсе не найдена.");
        }

        return Promise.all([
            ctx.answerCallbackQuery(), 
            replyCourseInfo(ctx, course)
        ]);
    });
};

const testRoute = /^tests\/(\d+)$/;

const useTestCallback = (bot: Bot<MyContext>) =>  {
    bot.callbackQuery(testRoute, async (ctx) => {
        const testId = +ctx.match[1];
        const username = ctx.from?.username;
        const userId = await getUserId(username!);
        
        const hasAccess = await isTestOwner(userId!, testId);
        if(!hasAccess) {
            return await ctx.answerCallbackQuery("У вас нет доступа для просмотра информации");
        }
        const test = await getTest(testId);

        return Promise.all([
            ctx.answerCallbackQuery(), 
            replyTestInfo(ctx, test),
        ])
    });
};

const publishTestRoute = /^tests\/(\d+)\/publish$/;

const useTestPublishCallback = (bot: Bot<MyContext>) =>  {
    bot.callbackQuery(publishTestRoute, async (ctx) => {
        const testId = +ctx.match[1];
        const username = ctx.from?.username;
        const userId = await getUserId(username!);

        const hasAccess = await isTestOwner(userId!, testId);
        if(!hasAccess) {
            return await ctx.answerCallbackQuery("У вас нет доступа для просмотра информации");
        }

        try {
            await publishTest(testId);
            return await ctx.answerCallbackQuery("Тест опубликован");
        } catch (error){
            await ctx.answerCallbackQuery("Произошла ошибка. Тест не был опубликован");
            throw error;
        }
    });
};


const notifyTestRoute = /^tests\/(\d+)\/notify$/;

const useTestNotificationCallback = (bot: Bot<MyContext>) =>  {
    bot.callbackQuery(notifyTestRoute, async (ctx) => {
        const testId = +ctx.match[1];
        const username = ctx.from?.username;
        const userId = await getUserId(username!);

        const hasAccess = await isTestOwner(userId!, testId);
        if(!hasAccess) {
            return await ctx.answerCallbackQuery("У вас нет доступа для выполнения действия");
        }
        await ctx.answerCallbackQuery();
        
        const users = await getUsersWithUnsolvedTasks(testId);
        const suitableUsers = users.filter(user => user.telegram_username);
        const unsuitableUsers = users.filter(user => !user.telegram_username);

        if(unsuitableUsers.length) {
            // console.log(unsuitableUsers)
        }

        const notifications = await Promise.allSettled(
            suitableUsers
            .map(({ 
                username, 
                unsolvedTasksCount 
            }) => bot.api.sendMessage('@'+username, `У вас есть тест с ${unsolvedTasksCount} нерешенными заданиями. <вставить клаву>`))
        );

        const errors = notifications.filter(({ status }) => status === 'rejected').length;
        const successes = notifications.length - errors;
        const notRegistered = unsuitableUsers.length;


        const lines: [message: string, shouldShow: boolean][] = [
            [`Уведомление было успешно отправлено ${successes} пользователям`, true],
            [`Неуспешных уведомлений: ${errors}`, errors > 0],
            [`Пользователей, не привязавших почту: ${notRegistered}`, notRegistered > 0]
        ];

        return await ctx.reply(
            lines
                .filter(([_, shouldShow]) => shouldShow)
                .map(([ message ]) => message)
                .join("\n")
        );
    });
};

const createTestManagementKeyboard = withKeyboard((keyboard, testId: number, isPublished: boolean) => 
    isPublished 
        ? keyboard
            .text(`Напомнить о необходимости решить тест`, `tests/${testId}/notify`)
            .row()
            .text(`Выгрузить статистику`, `tests/${testId}/downloadStats`)
        : keyboard.text(`Опубликовать`, `tests/${testId}/publish`)
)

function replyTestInfo(ctx: MyContext, test: GET.Test) {
    const isPublished = Boolean(test.publishedAt);
    return ctx.reply(`Тест "${test.title}" [${isPublished ? "Опубликован" : "Не опубликован"}]`, {
        reply_markup: createTestManagementKeyboard(test.id, isPublished)
    });
}

const createCoursesKeyboard = withKeyboard((keyboard, courses: GET.Course[]) => {
    for(const course of courses) {
        keyboard.text(
            `${course.name}`,
            `courses/${course.id}`
        ).row();
    }
});

async function replyCoursesList(ctx: CommandContext<MyContext>, courses: GET.Course[], isTeacher: boolean) {
    const message = courses.length 
        ? `${isTeacher ? "Список курсов, которыми вы управляете:" : "Список курсов:"}`
        : "Список курсов пуст";

    const options = courses.length !== 0 ? {
        reply_markup: createCoursesKeyboard(courses)
    } : undefined;

    return await ctx.reply(message, options)
}

const createTestsKeyboard = withKeyboard((keyboard, tests: GET.Test[]) => {
    for(const test of tests) {
        keyboard.text(
            `${test.title}`,
            `tests/${test.id}`
        ).row();
    }
});

async function replyCourseInfo(ctx: MyContext, course: CoursePopulated) {
    const message = `
Курс "${course.name}"
Количество студентов: ${course.students.length}
Количество тестов: ${course.tests.length}
Общее количесто заданий: ${course.tasks.length}`;

    return await ctx.reply(message,{
        reply_markup: createTestsKeyboard(course.tests),
    });
}


const middleware: Command['middleware'] = async (ctx: CommandContext<MyContext>) => {
    const username = ctx.from?.username;
    const userId = await getUserId(username!);
    const allCourses = await getAssignedAndOwnedCourses(userId!);
    const isTeacher = allCourses.owned_courses.length !== 0;
    const courses = isTeacher ? allCourses.owned_courses : allCourses.assigned_courses;

    return await replyCoursesList(ctx, courses, isTeacher);
}

export const coursesCommand: Command = {
    command: "courses",
    description: "Lists all assigned courses",
    middleware,
    callbackQueryRegisterFunctions: [
        useCourseCallback, 
        useTestCallback,
        useTestPublishCallback,
        useTestNotificationCallback
    ]
}