import Image from "next/image";
import LightOffImage from "../assets/images/offLight.png";
import LightOnImage from "../assets/images/onLight.png";
import FanImage from "../assets/images/fan.png";
import { useEffect, useState } from "react";
import axios from "axios";

interface Response {
    fan?: string;

    led?: string;
}
const Devices = ({socket}: any) => {
    const [ledState, setLedState] = useState(false);
    const [fanState, setFanState] = useState(false);

    const handleChangeLed = async (device: string, action: string) => {
        if(action === 'on') {
            if(device === 'led') {
                socket.emit("control", `{"led": "on"}`);
            } else {
                socket.emit("control", `{"fan": "on"}`);
            }
        }else if(action === 'off') {
            if(device === 'led') {
                socket.emit("control", `{"led": "off"}`);
            } else {
                socket.emit("control", `{"fan": "off"}`);
            }
        }
    }

    useEffect(() => {
        if (socket) {
            socket.on('response', (data: string) => {
                const response = JSON.parse(data) as Response;
                if(response.fan){
                    response.fan === 'on' ? setFanState(true) : setFanState(false);
                } else {
                    response.led === 'on' ? setLedState(true) : setLedState(false);
                }
            });
        }
    }, [socket]);

    return (
        <>
            <div className="col-span-1 flex flex-col justify-between">
                <div className="rounded-[0.35rem] shadow-one p-[25px]">
                    <Image src={FanImage} alt="FanImage" className={`w-[30%] aspect-[1/1] mx-auto ${fanState ? 'animate-spin' : ''}`} />
                    <div className="flex justify-evenly mt-[15px]">
                        <button onClick={() => handleChangeLed('fan', 'on')} className={`${!fanState ? `bg-[#1cc88a]` : `bg-[#cccccc]`} rounded-[0.35rem] px-[20px] py-[8px] text-white`} disabled={fanState}>
                            On
                        </button>
                        <button onClick={() => handleChangeLed('fan', 'off')} className={`${fanState ? `bg-[#e74a3b]` : `bg-[#cccccc]`} rounded-[0.35rem] px-[20px] py-[8px] text-white`} disabled={!fanState}>
                            Off
                        </button>
                    </div>
                </div>

                <div className="rounded-[0.35rem] shadow-one p-[25px] ">
                    <Image src={ledState ? LightOnImage : LightOffImage} alt="LightImage" className="w-[30%] aspect-[1/1] mx-auto " />
                    <div className="flex justify-evenly mt-[15px]">
                        <button onClick={() => handleChangeLed('led', 'on')} className={`${!ledState ? `bg-[#1cc88a]` : `bg-[#cccccc]`} rounded-[0.35rem] px-[20px] py-[8px] text-white`} disabled={ledState}>
                            On
                        </button>
                        <button onClick={() => handleChangeLed('led', 'off')} className={`${ledState ? `bg-[#e74a3b]` : `bg-[#cccccc]`} rounded-[0.35rem] px-[20px] py-[8px] text-white`} disabled={!ledState}>
                            Off
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Devices;