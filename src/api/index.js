import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000/ivr",
    headers: {
        "Content-type": "application/json"
    }
})

export const fetchWorkers = () => api.get("/task-router/fetch-workers")
export const getGrToken = (payload) => api.post("/task-router/get-gr-token", payload)
export const createTask = () => api.post("/task-router/create-task")
export const online = (payload) => api.post("/task-router/update-availability", payload) 
export const offline = (payload) => api.post("/task-router/update-availability", payload) 

export const acceptReject = (payload) => api.post("/task-router/accept-reservation", payload)

export const dequeueConference = (payload) => api.post("/task-router/dequeue-conference", payload)
export const endConference = (payload) => api.post("/task-router/end-conference", payload)

const apiTaskRouter = {
    fetchWorkers,
    getGrToken,
    createTask,
    online,
    offline,
    acceptReject,
    dequeueConference,
    endConference
}

export default {apiTaskRouter}