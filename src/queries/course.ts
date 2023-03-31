import { GET } from "src/@types/resources";
import * as request from '../request'


export function getCoursesByUsername(username: string): Promise<GET.Course[]> {
    return request
        .get<{ assigned_courses: GET.Course[] }[]>(`/users?populate=assigned_courses&filters[telegram_username][$eq]=${username}`)
        .then(({ data }) => data.length === 0 ? [] : data[0].assigned_courses);
}