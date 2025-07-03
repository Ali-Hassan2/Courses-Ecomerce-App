import { createContext,useState,useEffect } from "react";

export const AdminContext = createContext();


export function AdminProvider({children}){
    const [admin,setadmin]=useState(null);
    
    useEffect(()=>{
        const storedAdmin = localStorage.getItem('admin');

        if(storedAdmin){
            try {
                const parsed = JSON.parse(storedAdmin);
                setadmin(parsed);
            } catch (error) {
                console.log("Invalid there is an error.")
                setadmin(null);
            }
        }
    },[]);

    return(
        <AdminContext.Provider value={{admin,setadmin}}>
            {children}
        </AdminContext.Provider>
    )
}