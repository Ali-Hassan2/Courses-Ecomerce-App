import { getapi } from "./response";

const getresponse = (payload)=> getapi('/chat/chatwith',payload)

export {getresponse}