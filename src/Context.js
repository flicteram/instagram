import React,{createContext,useState,useEffect} from "react";
import {onAuthStateChanged} from 'firebase/auth'
import {auth} from './firebase'
import { useHistory } from "react-router-dom";
import LinearProgress from '@mui/material/LinearProgress';
import InstagramIcon from '@mui/icons-material/Instagram';

const Context = createContext()

function ContextProvider({children}){
    const [user,setUser]=useState(null)
    const [pending,setPending]=useState(true)
    const history = useHistory()

    useEffect(()=>{
        onAuthStateChanged(auth,(user)=>{
            if(user){
                setUser(user)
                history.push('/')
                setPending(false)
            }
            else {
                history.push('/signin')
                setPending(false)
            }
        })
    },[history])

    if(pending){
        return <div className='pendingUserCheck'>
            <LinearProgress sx={{textAlign:'center',width:'100%'}}/>
            <InstagramIcon sx={{width:'100%',height:'100px',color:'rgb(185, 185, 185)',position:'absolute',top:'50%',transform:'translateY(-50%)'}}/>
        </div>
        
    }
    return(
        <Context.Provider value={{user,setUser}}>
            {children}
        </Context.Provider>
    )
}

export {ContextProvider,Context}