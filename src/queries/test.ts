import { GET } from "../@types/resources";
import * as request from "../request";
import { destructurizeData, normalizeStrapiEntity, StrapiEntity, StrapiGetReponse } from "./helpers";
import { getUserId } from "./user";

export async function getAssignedTests(chatId: number): Promise<GET.Test[]> {
    const userId = await getUserId(chatId);
    if(userId === null) {
        return [];
    }
    return request
        .get<GET.Test[]>(`/users/${userId}/tests/assigned`)
        .then(({ data }) => data)
        .catch(() => []);
}

export async function getSolvableTests(chatId: number): Promise<GET.ExtendedTestInformation[]> {
    const userId = await getUserId(chatId);
    if(userId === null) {
        return [];
    }

    return request
        .get<GET.ExtendedTestInformation[]>(`/users/${userId}/tests/solvable`)
        .then(({ data }) => data)
        .catch(() => []);
}

export async function getTest(testId: number): Promise<GET.Test>{
    return request
        .get<StrapiGetReponse<GET.Test>>(`/tests/${testId}`)
        .then(({ data: { data } }) => data)
        .then(normalizeStrapiEntity);
}

export async function isTestOwner(userId: number, testId: number): Promise<boolean> {
    return request
        .get<{ data: boolean }>(`/users/${userId}/tests/${testId}/isOwner`)
        .then(destructurizeData)
        .then(destructurizeData)
        .catch(() => false);
}

export async function publishTest(testId: number) {
    return request.put(`/tests/${testId}`, {
        data: {
            publishedAt: new Date().toISOString(),
        }
    });
} 


export function getUsersWithUnsolvedTasks(testId: number) {
    return request
        .get<(GET.User & { unsolvedTasksCount: number})[]>(`/tests/${testId}/usersWithoutAnswers`)
        .then(destructurizeData)
}