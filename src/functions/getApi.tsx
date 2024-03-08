import * as React from 'react';

const getApi = async (url: string) => {
    return fetch(`http://127.0.0.1:8000/${url}`, {
        credentials: 'include'
    });
}
export default getApi;