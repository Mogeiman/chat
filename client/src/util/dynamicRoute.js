import React from "react";
import {Navigate} from 'react-router-dom'
import { useAuthState } from "../context/auth";

export default function DynamicRoute({children}){
    const {user} = useAuthState()
    if(!user){
        return( 
        <Navigate to='/login'/>
        )
    }else{
        return children
    }
        
        
    }