export function withRetries<TData = unknown>(
    f: () => Promise<TData>,
    maxCalls: number
): typeof f {
    let calls = 0;
    const makeAttempt: typeof f = () => Promise.resolve().then(f).catch(error => {
        calls++;
        if (calls < maxCalls) {
            return makeAttempt();
        }
        throw new Error(`withRetries error: could not resolve after ${maxCalls} attemtps. \nOriginal error: ${error}`);
    })
    return makeAttempt;
}