import React, { useEffect,useState } from "react";
import { Link } from "react-router-dom";
import { useWebSocket } from './WebSocketContext';
export default function Navbar(){
    const { socket } = useWebSocket();
    const [count,setcount] = useState('--');
    useEffect(()=>{
        if(socket){
            socket.on("count",(count)=>{
                setcount(count);
            })
        }
    },[socket,count])
    return(
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-dark">
                <h4 style={{color:"white"}}>Count-{count}</h4>
                <Link className="navbar-brand" style={{marginLeft:"38%",color:"white"}} to="/Connectify">Talk To Strangers</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                </div>
            </nav>
        </div>
    )
}