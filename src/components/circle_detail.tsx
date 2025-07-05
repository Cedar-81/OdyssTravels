import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { Circle } from "@/services/circles";

interface CircleDetailProps {
  circle: Circle;
  onClose: () => void;
}

export default function CircleDetail({ circle, onClose }: CircleDetailProps)  {
    return(
        <section className="shadow-2xl space-y-6 fixed w-[22rem] top-0 right-0 h-screen z-50 bg-white">
            <div className="px-3 py-6 h-[7.5rem] border space-y-4 rounded-b-xl shadow-xl">
                <div className="flex gap-2">
                    <svg className="h-5 mt-4 cursor-pointer" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onClose}>
                        <path d="M15.375 5.25L8.625 12L15.375 18.75" stroke="black" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div className="flex gap-2 items-center">
                        <div className="flex w-[3.4rem] h-[3.5rem]">
                            <Avatar className="size-8 ">
                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <Avatar className="size-8 -left-3">
                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <Avatar className="size-8 -left-13 -bottom-5">
                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs">{circle.departure} → {circle.destination}</p>
                            <h3>{circle.name}</h3>
                            {/* <p className="text-xs">2nd July 2025 - 13th July 2025</p> */}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="space-y-4 h-[calc(100%-12.5rem)] pb-6 overflow-y-auto">
                <p className="py-3 px-4 text-sm text-black/60">{circle.description}</p>
                <div className="px-4 space-y-4">
                    <h2 className="font-medium">Members</h2>
                    <div className="flex flex-col px-2 gap-3">
                        {/* Members rendering can be added here */}
                        {/* <div className="flex gap-2 items-center" key={user.id}>
                              <Avatar className="size-5">
                                {user.avatar ? (
                                  <AvatarImage src={user.avatar} alt={user.first_name + ' ' + user.last_name} />
                                ) : null}
                                <AvatarFallback>{initials}</AvatarFallback>
                              </Avatar>
                              <p className="text-xs">{user.first_name} {user.last_name}</p>
                        </div> */}
                    </div>
                </div>
            </div>

            <div className="h-[5rem] absolute w-full justify-center bottom-0">
               <div className="flex justify-center mt-5"><button className="border-0 cursor-pointer text-center w-[90%] bg-black text-white rounded-full py-3">Join</button></div>
            </div>
        </section>
    )
}