import cleanQueryParams from './cleanQueryParams';

export default async function fetcher(endpoint, params) {
    const search = new URLSearchParams(cleanQueryParams(params));
    const request = await fetch(`${endpoint}?${search.toString()}`);
    const results = await request.json();
    return results;
};
