import { useEffect, useRef } from "react";
import { FaTemperatureLow, FaRegSnowflake, FaLightbulb } from "react-icons/fa"

interface IValueProps {
    values: {
        temp: number,
        hum: number,
        light: number,
        time: string
    }
}

const Elements = ({ values }: IValueProps) => {
    const bgTempRef = useRef<HTMLDivElement>(null);
    const bgHumiRef = useRef<HTMLDivElement>(null);
    const bgLightRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bgTempRef.current) {
            const temperature = values.temp;
            bgTempRef.current.style.width = `${temperature}%`;
            bgTempRef.current.className = `bg-temp-progress h-full leading-[1] transition-all`;
        }
        if (bgHumiRef.current) {
            const humidity = values.hum;
            bgHumiRef.current.style.width = `${humidity}%`;
            bgHumiRef.current.className = `bg-hum-progress h-full leading-[1] transition-all`;
        }
        if (bgLightRef.current) {
            const brightness = values.light;
            bgLightRef.current.style.width = `${Math.floor(brightness / 4095 * 100)}%`;
            bgLightRef.current.className = `bg-light-progress h-full leading-[1] transition-all`;
        }
    }, [values]);

    return (
        <>
            <div className="border-[#e3e6f0] border-t-[0.25rem] border-t-[#e74a3b] py-[0.5rem] rounded-[0.35rem] shadow-one ">
                <div className="py-[10px] px-[20px] flex-1">
                    <div className="text-[0.7rem] font-[700] uppercase text-temp">Temperature(Nhiệt độ)</div>
                    <div className="flex justify-between">
                        <div className="flex flex-1 items-center">
                            <span className="font-[700] text-center text-[1rem] leading-[1] text-[#5a5c69]">{values.temp} {"°C"}</span>
                            <div className="flex-1 ml-[15px] rounded-[30px] bg-gray-300 h-[0.5rem] overflow-hidden">
                                <div ref={bgTempRef} className={`bg-temp-progress h-full leading-[1] transition-all`}></div>
                            </div>
                        </div>

                        <div className="text-[30px] text-[#dddfeb] ml-5">
                            <FaTemperatureLow />
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-[#e3e6f0] border-t-[0.25rem] border-t-[#1cc88a] py-[0.5rem] rounded-[0.35rem] shadow-one ">
                <div className="py-[10px] px-[20px] flex-1">
                    <div className="text-[0.7rem] font-[700] uppercase text-hum">Humidity(Độ ẩm)</div>
                    <div className="flex justify-between">
                        <div className="flex flex-1 items-center">
                            <span className="font-[700] text-center text-[1rem] leading-[1] text-[#5a5c69]">{values.hum} {"%"}</span>
                            <div className="flex-1 ml-[15px] rounded-[30px] bg-gray-300 h-[0.5rem] overflow-hidden">
                                <div ref={bgHumiRef} className={`bg-hum-progress h-full leading-[1] transition-all`}></div>
                            </div>
                        </div>

                        <div className="text-[30px] text-[#dddfeb] ml-5">
                            <FaRegSnowflake />
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-[#e3e6f0] border-t-[0.25rem] border-t-[#f6c23e] py-[0.5rem] rounded-[0.35rem] shadow-one ">
                <div className="py-[10px] px-[20px] flex-1">
                    <div className="text-[0.7rem] font-[700] uppercase text-light">Light(Ánh sáng)</div>
                    <div className="flex justify-between">
                        <div className="flex flex-1 items-center">
                            <span className="font-[700] text-center text-[1rem] leading-[1] text-[#5a5c69]">{values.light} {"Lux"}</span>
                            <div className="flex-1 ml-[15px] rounded-[30px] bg-gray-300 h-[0.5rem] overflow-hidden">
                                <div ref={bgLightRef} className={`bg-light-progress h-full leading-[1] transition-all`}></div>
                            </div>
                        </div>

                        <div className="text-[30px] text-[#dddfeb] ml-5">
                            <FaLightbulb /> 
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className="border-[#e3e6f0] border-t-[0.25rem] border-t-[#f6c23e] py-[0.5rem] rounded-[0.35rem] shadow-one ">
                <div className="py-[10px] px-[20px] flex-1">
                    <div className="text-[0.7rem] font-[700] uppercase text-light">Bụi(Ánh sáng)</div>
                    <div className="flex justify-between">
                        <div className="flex flex-1 items-center">
                            <span className="font-[700] text-center text-[1rem] leading-[1] text-[#5a5c69]">{values.humi} {"°C"}</span>
                            <div className="flex-1 ml-[15px] rounded-[30px] bg-gray-300 h-[0.5rem] overflow-hidden">
                                <div ref={bgLightRef} className={`bg-light-progress h-full leading-[1] transition-all`}></div>
                            </div>
                        </div>

                        <div className="text-[30px] text-[#dddfeb] ml-5">
                            <FaLightbulb /> 
                        </div>
                    </div>
                </div>
            </div> */}

        </>
    )
}

export default Elements;