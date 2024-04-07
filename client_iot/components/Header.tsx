import Link from "next/link";

const NavBar = () => {
    return (
        <>
            <div className="p-5 bg-white shadow-2xl border-b-[#cccccc]">
                <div className="flex justify-between items-center">
                    <div className="w-[50%] text-[#4e73df] font-[400] text-[20px]">
                        <Link href="/">
                        Smart Home
                        </Link>
                        </div>
                    <div className="flex-1 grid grid-cols-3 gap-x-[15px]">
                        <Link href="/dataSensor">
                            <div className="text-gray-700 dark:text-gray-200 text-center ">Sensor Data</div>
                        </Link>
                        <Link href="/actionHistory">
                            <div className="text-gray-700 dark:text-gray-200 text-center">Action History</div>
                        </Link>
                        <Link href="/contact">
                            <div className="text-gray-700 dark:text-gray-200 text-center">Profile</div>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NavBar;