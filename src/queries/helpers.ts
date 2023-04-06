import { Identifiable } from "src/@types/resources";

interface CacheOptions {
    cacheTime: number;
}

export function withCache<TFn extends (...args: any[]) => TRValue, TRValue>(fn: TFn, { cacheTime }: CacheOptions ): TFn {
    let updateTime: number = 0;
    let cache: TRValue;
    const curried = (...args) => {
        const now = Date.now();
        if (updateTime === 0 || now - updateTime > cacheTime) {
            updateTime = now;
            cache = fn(...args);
        }

        return cache;
    };

    return curried as TFn;
}

export interface StrapiEntity<Model extends Identifiable> { 
    id: Model['id'];
    attributes: Omit<Model, 'id'>;
}

export interface StrapiGetReponse<Model extends Identifiable> {
    data: StrapiEntity<Model>;
    meta: Record<any, any>;
}

export const normalizeStrapiEntity = <Model extends Identifiable>({ id, attributes } : StrapiEntity<Model>) => ({ ...attributes, id }) as Model;

export const destructurizeData = <T>({ data }: { data: T }) => data;