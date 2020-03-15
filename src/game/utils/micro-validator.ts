export function microValidator(array: any[], msg?: string) {
    if (array.filter(x => x != null).length !== array.length) {
        throw new Error(`Null detected : ${array} - ${msg}`)
    }
}