import { GET } from "src/@types/resources";
import * as request from '../request';

export async function getUnsolvedTasks(testId: number, userId: number): Promise<GET.Task[]> {
    return request
        .get<GET.Task[]>(`/tasks/unsolved/test/${testId}/user/${userId}`)
        .then(({ data }) => data);
}

export async function createTaskAnswer(dto: {
    taskId: number,
    userId: number,
    answer: string, 
}): Promise<void> {
    return request.post(`/answers`, {
        data: {
            answer: dto.answer,
        student: {
            connect: [dto.userId]
        },
        task: {
            connect: [dto.taskId]
        }
    }
    })
}

export async function taskAsImage(taskId: number): Promise<Buffer> {
    return request
        .get(`/tasks/${taskId}/asImage`, {
            responseType: 'arraybuffer'
        })
        .then(({ data }) => data)
}

export async function updateTaskFileId(taskId: number, fileId: string): Promise<void> {
    return request.put(`/tasks/${taskId}`, {
        data: {
            telegram_file_id: fileId,
        }
    });
}