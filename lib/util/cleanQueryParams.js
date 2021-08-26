export default function cleanQueryParams(queryParams) {
    return Object.entries(queryParams).reduce((obj, [key, value]) => {
        if ([null, 'null', '', undefined].includes(value)) return obj;
        obj[key] = value;
        return obj;
    }, {});
}
