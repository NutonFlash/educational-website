
export function isHashOk(hash) {
    if (hash) {
        let pattern = /[^A-Za-zА-Яa-я0-9\\\/]+/g;
        if (hash.match(pattern))
            return hash.match(pattern).length === 0;
        else return true;
    }
    return false;
}