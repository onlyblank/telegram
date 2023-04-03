import { GET } from "src/@types/resources";
import * as request from '../request';

export async function getUnsolvedTasks(testId: number, userId: number): Promise<GET.Task[]> {
    return request
        .get<GET.Task[]>(`/tasks/unsolved/test/${testId}/user/${userId}`)
        .then(({ data }) => data);
}