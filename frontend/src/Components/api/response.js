const baseURL = `http://localhost:4001`

const getapi = async (endpoint, body)=>{
    const Controller = new AbortController();
    const signal = Controller.signal;

    const timer = 15000;

    const timeout = setTimeout(()=> Controller.abort, timer);

    try {
        const response = await fetch(`${baseURL}${endpoint}`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            signal,
            body:JSON.stringify(body)
        })
        clearTimeout(timeout)
        if(!response.ok){
            const error_Data = await response.json().catch(()=> null);
            throw new Error(error_Data?.message || "There is an Internal Server Error.")
        }
        const data = await response.json()
        console.log("The data is:",data)
        console.log("The type of data is:", typeof data)
        if(data && typeof data === 'string') return data;
        if(Array.isArray(data)) return data;
        if(data && typeof data === 'object') return [data];
        return [];
    } catch (error) {
        if(error?.name === 'AbortError'){
            console.log("The time is out for this endpoint",`${endpoint}`)
        }
        else{
            console.log("There is an error while getting the response.")
        }

        throw error;
    }

}

export {getapi}