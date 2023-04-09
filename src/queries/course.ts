import { GET } from "src/@types/resources";
import * as request from '../request'
import { normalizeStrapiEntity, StrapiEntity, StrapiGetReponse } from "./helpers";


export function getAssignedCourses(userId: number): Promise<GET.Course[]> {
    return request
        .get<{ assigned_courses: GET.Course[] }>(`/users/${userId}?populate=assigned_courses`)
        .then(({ data }) => data.assigned_courses);
}

export function getOwnedCourses(userId: number): Promise<GET.Course[]> {
    return request
        .get<{ owned_courses: GET.Course[] }>(`/users/${userId}?populate=owned_courses`)
        .then(({ data }) => data.owned_courses);
}

interface Courses { 
    assigned_courses: GET.Course[];
    owned_courses: GET.Course[];
}

export function getAssignedAndOwnedCourses(userId: number): Promise<Courses> {
    return request
        .get<Courses>(`/users/${userId}?populate=assigned_courses&populate=owned_courses`)
        .then(({ data }) => data);
}

export interface CoursePopulated extends GET.Course {
    students: GET.User[];
    tasks: GET.Task[];
    tests: GET.Test[];
}

interface CoursePopulatedGetResponse extends GET.Course{ 
    students: { data: StrapiEntity<GET.User>[] };
    tasks: { data: StrapiEntity<GET.Task>[] };
    tests: { data: StrapiEntity<GET.Test>[] };
}

export function isCourseOwner(courseId: number, userId: number): Promise<boolean> {
    return getOwnedCourses(userId).then(courses => courses.find(course => course.id === courseId) !== undefined)
}

export function getCourseExtendedInformation(courseId: number) : Promise<CoursePopulated | null> {
    return request
        .get<StrapiGetReponse<CoursePopulatedGetResponse>>(`/courses/${courseId}?populate=students&populate=tasks&populate=tests`)
        .then(({ data: { data } }) => normalizeStrapiEntity(data))
        .then(({ 
            students: { data: students }, 
            tasks: { data: tasks }, 
            tests: { data: tests }, 
            ...rest
        }) => ({ 
            students: students.map(normalizeStrapiEntity), 
            tasks: tasks.map(normalizeStrapiEntity),
            tests: tests.map(normalizeStrapiEntity), 
            ...rest, 
        }));
}