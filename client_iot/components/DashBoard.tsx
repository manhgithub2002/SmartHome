'use client'

import LineChart, { DataEntry } from "./Chart";
import { useEffect, useState } from "react";
import Elements from "./Elements";
import Devices from "./Devices";


const MainDashBoard= ({data, socket}: any) => {

    const defaultDataSensors = [
        { temp: 20, hum: 20, light: 2000, time: '20:20:20' },
        { temp: 25, hum: 24, light: 2430, time: '20:20:20' },
        { temp: 34, hum: 25, light: 2230, time: '20:20:20' },
        { temp: 55, hum: 20, light: 2870, time: '20:20:20' },
        { temp: 43, hum: 28, light: 2098, time: '20:20:20' },
        { temp: 25, hum: 40, light: 2910, time: '20:20:20' },
        { temp: 22, hum: 50, light: 1108, time: '20:20:20' },
        { temp: 36, hum: 23, light: 2002, time: '20:20:20' },
        { temp: 37, hum: 18, light: 3006, time: '20:20:20' },
        { temp: 28, hum: 80, light: 1129, time: '20:20:20' }
    ] as DataEntry[];
    
    const [dataSensors, setDataSensors] = useState<DataEntry[]>(defaultDataSensors);

    function convertTimestampToTime() {
        // Tạo một đối tượng Date từ timestamp
        var date = new Date();
    
        // Đảm bảo rằng các giá trị được hiển thị đúng định dạng (2 chữ số)
        var hours = parseInt(date.getHours().toString(), 10);
        var minutes = parseInt(date.getMinutes().toString(), 10);
        var seconds = parseInt(date.getSeconds().toString(), 10);
    
        // Trả về dữ liệu dạng giờ:phút:giây
        return hours + ':' + minutes + ':' + seconds;
    }

    useEffect(() => {
        setDataSensors(prevData => {
            const newData = [...prevData];
            
            const tempData = {...data, time: convertTimestampToTime()};
            newData.push(tempData);
            newData.shift();
            
            return newData;
        });
    }, [data]);

    return (
        <>
            <div className="py-[30px] px-[40px]">
                <div className="grid grid-cols-3 space-x-[30px] mb-[4rem]">
                    <Elements values={dataSensors[dataSensors.length - 1]} />
                    {/* <Elements values={data} /> */}
                </div>

                <div className="grid grid-cols-3 space-x-[30px]">
                    <div className="col-span-2 rounded-[0.35rem] shadow-one overflow-hidden">
                        <div className="py-[0.75rem] px-[0.75rem] bg-[#cccccc] border-b-[#e3e6f0] ">Chart</div>
                        <LineChart dataSensors={dataSensors} />
                    </div>

                    <Devices socket={socket}/>

                </div>
            </div>
        </>
    )
}

export default MainDashBoard;