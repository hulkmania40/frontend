import { _get } from "../shared/apiHelpers";

export const sampleHello = async () => {
    return await _get('/api/hello/').then((response:any) => { console.log(response);return (response.message)})
    .catch(error => console.error(error))
}