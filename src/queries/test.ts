import { GET, StrapiGetResponse } from "../@types/resources";
import * as request from "../request";
import { getUserId } from "./user";

export async function getAssignedTests(username: string): Promise<GET.Test[]> {
    const userId = await getUserId(username);
    if(userId === null) {
        return [];
    }
    return request
        .get<GET.Test[]>(`/users/${userId}/tests/assigned`)
        .then(({data}) => data)
        .catch(() => []);
}

export async function getTest(testId: number): Promise<GET.Test> {
    return request
        .get<StrapiGetResponse<GET.Test>>(`/tests/${testId}`)
        .then(({ data: { data: { id, attributes} }}) => ({ ...attributes, id }));
}