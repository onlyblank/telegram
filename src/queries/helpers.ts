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