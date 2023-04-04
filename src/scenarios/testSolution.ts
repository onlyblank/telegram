import { Conversation } from "@grammyjs/conversations";
import { GET } from "src/@types/resources";
import { getTest } from "../queries/test";
import { createTaskAnswer, getUnsolvedTasks } from "../queries/tasks";
import { getUserId } from "../queries/user";
import { MyContext } from "../types";

const renderCodeField = (field: GET.CodeField) => "```" + field.language + "\n" + field.code + "\n```";
const renderTextField = (field: GET.TextField) => field.text;
const renderRichTextField = (field: GET.RichTextField) => field.text;

function renderTaskField(field: GET.Task['fields'][number]): string {
    if(field.__component === 'task-field.code'){
        return renderCodeField(field);
    }
    if(field.__component === 'task-field.text'){
        return renderTextField(field);
    }
    if(field.__component === 'task-field.rich-text'){
        return renderRichTextField(field);
    }
    return "";
}

function renderTextTask(task: GET.Task): string {
    return task.fields.map(renderTaskField).join("\n");
}

export async function testSolutionConversation(conversation: Conversation<MyContext>, ctx: MyContext) {
    const username = ctx.from?.username;
    const testId = await conversation.external(() => ctx.session.currentTestId);
    if(!username || testId === null){
        return;
    }
    const userId = await conversation.external(() => getUserId(username)) as number;
    const test = await conversation.external(() => getTest(testId));
    
    conversation.log(test);

    const loadTasksChunk = () => conversation.external(() => getUnsolvedTasks(testId, userId));
    let tasks = await loadTasksChunk();
    const initialTasksCount = tasks.length;

    await ctx.reply(initialTasksCount
        ? `Вы начали решать тест "${test.title}", состоящий из ${initialTasksCount} заданий.`
        : `Тест уже был решен или в нем нет заданий`
    );
    

    let tasksSolved = 0;
    while(tasks.length !== 0) {
        const task = tasks[0];
        const taskAsText = renderTextTask(task);
        await ctx.reply(`Задание \\[${initialTasksCount - tasks.length + 1}/${initialTasksCount}\\]:\n\n${taskAsText}`, {
            parse_mode: "MarkdownV2"
        });

        const { message: { text: answer } } = await conversation.waitFor("message:text");
        await conversation.external(() => createTaskAnswer({
            answer,
            userId,
            taskId: task.id,
        }));

        tasks = await loadTasksChunk();
        tasksSolved = await conversation.external(() => tasksSolved + 1);
    }

    if(tasksSolved){
        await ctx.reply(`Тест завершен. Решено заданий: ${tasksSolved}`);
    }
    await conversation.external(() => ctx.session.currentTestId = null);
}

export async function enterTestSolution(testId: number, ctx: MyContext) {
    ctx.session.currentTestId = testId;

    return await ctx.conversation.enter('testSolutionConversation');
}