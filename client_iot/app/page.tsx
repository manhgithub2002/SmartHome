'use client'

import DashBoard from "@/components/DashBoard";
import Header from "@/components/Header";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { Socket } from "socket.io";
let socket: any;
export default function Home() {
  const [data, setData] = useState({});

  useEffect(() => {
    socket = io("http://localhost:4000");
  
    socket.on('connect', () => {
        console.log('Connected to server');
    });
  
    socket.on('disconnect', () => {
      console.log('Disconnected from server');

    })
    socket.on('sensor', (data: string) => {
      // console.log(data)
      setData(JSON.parse(data));
    })
  }, [])
  

  return (
    <>
      <Header />
      <DashBoard data={data} socket={socket}/>
    </>
  );
}
