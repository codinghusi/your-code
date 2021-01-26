

export function convertToMap<T>(array: T[], predicate: (item: T) => { name: string, value: any }) {
    return array.reduce((acc, current) => {
        const result = predicate(current);
        acc[result.name] = result.value;
        return acc;
    }, {});
}