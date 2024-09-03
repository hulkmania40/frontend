import { _delete, _get, _post, _put } from "../shared/apiHelpers";

export const createTask = async (taskData: any) => {
    return await _post('/api/tasks/create/', taskData)
        .then((response: any) => { 
            console.log(response); 
            return response; 
        })
        .catch(error => console.error(error));
};

export const updateTask = async (taskId: number, taskData: any) => {
    return await _put(`/api/tasks/update/${taskId}/`, taskData)
        .then((response: any) => { 
            console.log(response); 
            return response; 
        })
        .catch(error => console.error(error));
};

export const deleteTask = async (taskId: number) => {
    return await _delete(`/api/tasks/delete/${taskId}/`)
        .then((response: any) => { 
            console.log(response); 
            return response; 
        })
        .catch(error => console.error(error));
};

export const getTask = async (taskId: number) => {
    return await _get(`/api/tasks/${taskId}/`)
        .then((response: any) => { 
            console.log(response); 
            return response; 
        })
        .catch(error => console.error(error));
};

export const getTasks = async () => {
    return await _get('/api/tasks/')
        .then((response: any) => { 
            console.log(response); 
            return response; 
        })
        .catch(error => console.error(error));
};