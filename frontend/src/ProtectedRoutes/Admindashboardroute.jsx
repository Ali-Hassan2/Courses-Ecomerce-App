import React from 'react'
import { Navigate } from 'react-router-dom'
function Admindashboardroute({children}) {


    const isadminlogedin = localStorage.getItem('admintoken');
    const isadminlogin2 = localStorage.getItem('admin');
    if(!isadminlogedin || !isadminlogin2){
        return <Navigate to='/adminlogin' replace/>
    }
  return  children;
}

export default Admindashboardroute
