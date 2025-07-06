import { createContext } from "react";
import {useState,useEffect} from 'react';


const ThemeContext = createContext();
const ThemeProvider = ({children})=>{
    const [theme,settheme] = useState('light');
    
}