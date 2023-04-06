import { GET } from "src/@types/resources";
import * as request from '../request'


export function getAssignedCourses(userId: number): Promise<GET.Course[]> {
    return request
        .get<{ assigned_courses: GET.Course[] }>(`/users/${userId}?populate=assigned_courses`)
        .then(({ data }) => data.assigned_courses);
}

interface Coruses { 
    assigned_courses: GET.Course[];
    owned_courses: GET.Course[];
}

export function getAssignedAndOwnedCourses(userId: number): Promise<Coruses> {
    return request
        .get<Coruses>(`/users/${userId}?populate=assigned_courses&populate=owned_courses`)
        .then(({ data }) => data);
}