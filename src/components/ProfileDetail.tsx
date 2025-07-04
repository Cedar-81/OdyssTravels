import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useEffect, useState } from "react";
import { usersService, type UserProfile } from "@/services/users";

interface ProfileDetailProps {
  onClose: () => void;
}

export default function ProfileDetail({ onClose }: ProfileDetailProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [_loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    usersService.getMyProfile()
      .then((data) => { if (isMounted) { console.log("user: ",  data); setProfile(data); setLoading(false); } })
      .catch(() => {
        // fallback to localStorage if API fails
        if (typeof window !== 'undefined') {
          const userStr = localStorage.getItem('odyss_user');
          if (userStr) {
            try {
              const user = JSON.parse(userStr);
              
              setProfile({
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                nickname: user.nickname || user.name || user.first_name || '',
                avatar: user.profile_pic || user.avatar || undefined,
              } as UserProfile);
            } catch(err) {
              console.error("profile detail err: ", err)
            }
          }
        }
        setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  let avatarUrl = profile?.avatar || undefined;
  let initials = 'U';
  let displayName = profile?.nickname || profile?.first_name || 'User';
  let fullName = `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim();
  if (profile) {
    const first = profile.first_name?.[0] || '';
    const last = profile.last_name?.[0] || '';
    initials = (first + last).toUpperCase() || 'U';
  }

  return (
    <section className="shadow-2xl space-y-6 fixed w-[22rem] top-0 right-0 h-screen z-50 bg-white">
      <div className="px-4 py-6 h-[7.5rem] border-b space-y-4 rounded-b-xl border-black/60 flex items-start justify-between">
        <div className="flex gap-3 items-start">
          <Avatar className="size-16">
            <AvatarImage src={avatarUrl} alt={initials} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="">
            <h3 className="text-lg font-semibold">{displayName}</h3>
            <p className="text-xs text-gray-500">{fullName}</p>
            <div className="flex mt-2 gap-1">
              <svg className="h-4" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.6002 5.82C15.9167 5.03953 15.5401 4.0374 15.5402 3H12.4502V15.4C12.4268 16.0712 12.1437 16.7071 11.6605 17.1735C11.1773 17.6399 10.5318 17.9004 9.86016 17.9C8.44016 17.9 7.26016 16.74 7.26016 15.3C7.26016 13.58 8.92016 12.29 10.6302 12.82V9.66C7.18016 9.2 4.16016 11.88 4.16016 15.3C4.16016 18.63 6.92016 21 9.85016 21C12.9902 21 15.5402 18.45 15.5402 15.3V9.01C16.7932 9.90985 18.2975 10.3926 19.8402 10.39V7.3C19.8402 7.3 17.9602 7.39 16.6002 5.82Z" fill="black"/>
              </svg>
              <svg className="h-4" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.0281 2C14.1531 2.003 14.7241 2.009 15.2171 2.023L15.4111 2.03C15.6351 2.038 15.8561 2.048 16.1231 2.06C17.1871 2.11 17.9131 2.278 18.5501 2.525C19.2101 2.779 19.7661 3.123 20.3221 3.678C20.8308 4.17773 21.2243 4.78247 21.4751 5.45C21.7221 6.087 21.8901 6.813 21.9401 7.878C21.9521 8.144 21.9621 8.365 21.9701 8.59L21.9761 8.784C21.9911 9.276 21.9971 9.847 21.9991 10.972L22.0001 11.718V13.028C22.0025 13.7574 21.9948 14.4868 21.9771 15.216L21.9711 15.41C21.9631 15.635 21.9531 15.856 21.9411 16.122C21.8911 17.187 21.7211 17.912 21.4751 18.55C21.2243 19.2175 20.8308 19.8223 20.3221 20.322C19.8223 20.8307 19.2176 21.2242 18.5501 21.475C17.9131 21.722 17.1871 21.89 16.1231 21.94L15.4111 21.97L15.2171 21.976C14.7241 21.99 14.1531 21.997 13.0281 21.999L12.2821 22H10.9731C10.2433 22.0026 9.5136 21.9949 8.78408 21.977L8.59008 21.971C8.35269 21.962 8.11535 21.9517 7.87808 21.94C6.81408 21.89 6.08808 21.722 5.45008 21.475C4.78291 21.2241 4.17852 20.8306 3.67908 20.322C3.17003 19.8224 2.77619 19.2176 2.52508 18.55C2.27808 17.913 2.11008 17.187 2.06008 16.122L2.03008 15.41L2.02508 15.216C2.00665 14.4868 1.99831 13.7574 2.00008 13.028V10.972C1.99731 10.2426 2.00465 9.5132 2.02208 8.784L2.02908 8.59C2.03708 8.365 2.04708 8.144 2.05908 7.878C2.10908 6.813 2.27708 6.088 2.52408 5.45C2.77577 4.7822 3.1703 4.17744 3.68008 3.678C4.17923 3.16955 4.78327 2.77607 5.45008 2.525C6.08808 2.278 6.81308 2.11 7.87808 2.06C8.14408 2.048 8.36608 2.038 8.59008 2.03L8.78408 2.024C9.51327 2.00623 10.2427 1.99857 10.9721 2.001L13.0281 2ZM12.0001 7C10.674 7 9.40223 7.52678 8.46455 8.46447C7.52687 9.40215 7.00008 10.6739 7.00008 12C7.00008 13.3261 7.52687 14.5979 8.46455 15.5355C9.40223 16.4732 10.674 17 12.0001 17C13.3262 17 14.5979 16.4732 15.5356 15.5355C16.4733 14.5979 17.0001 13.3261 17.0001 12C17.0001 10.6739 16.4733 9.40215 15.5356 8.46447C14.5979 7.52678 13.3262 7 12.0001 7ZM12.0001 9C12.394 8.99993 12.7842 9.07747 13.1482 9.22817C13.5122 9.37887 13.8429 9.5998 14.1215 9.87833C14.4002 10.1569 14.6212 10.4875 14.772 10.8515C14.9229 11.2154 15.0005 11.6055 15.0006 11.9995C15.0006 12.3935 14.9231 12.7836 14.7724 13.1476C14.6217 13.5116 14.4008 13.8423 14.1223 14.121C13.8437 14.3996 13.513 14.6206 13.1491 14.7714C12.7851 14.9223 12.395 14.9999 12.0011 15C11.2054 15 10.4424 14.6839 9.87976 14.1213C9.31715 13.5587 9.00108 12.7956 9.00108 12C9.00108 11.2044 9.31715 10.4413 9.87976 9.87868C10.4424 9.31607 11.2054 9 12.0011 9M17.2511 5.5C16.9196 5.5 16.6016 5.6317 16.3672 5.86612C16.1328 6.10054 16.0011 6.41848 16.0011 6.75C16.0011 7.08152 16.1328 7.39946 16.3672 7.63388C16.6016 7.8683 16.9196 8 17.2511 8C17.5826 8 17.9005 7.8683 18.135 7.63388C18.3694 7.39946 18.5011 7.08152 18.5011 6.75C18.5011 6.41848 18.3694 6.10054 18.135 5.86612C17.9005 5.6317 17.5826 5.5 17.2511 5.5Z" fill="black"/>
              </svg>
              <svg className="h-4" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.46 6C21.69 6.35 20.86 6.58 20 6.69C20.88 6.16 21.56 5.32 21.88 4.31C21.05 4.81 20.13 5.16 19.16 5.36C18.37 4.5 17.26 4 16 4C13.65 4 11.73 5.92 11.73 8.29C11.73 8.63 11.77 8.96 11.84 9.27C8.28004 9.09 5.11004 7.38 3.00004 4.79C2.63004 5.42 2.42004 6.16 2.42004 6.94C2.42004 8.43 3.17004 9.75 4.33004 10.5C3.62004 10.5 2.96004 10.3 2.38004 10V10.03C2.38004 12.11 3.86004 13.85 5.82004 14.24C5.19088 14.4129 4.53008 14.4369 3.89004 14.31C4.16165 15.1625 4.69358 15.9084 5.41106 16.4429C6.12854 16.9775 6.99549 17.2737 7.89004 17.29C6.37371 18.4905 4.49405 19.1394 2.56004 19.13C2.22004 19.13 1.88004 19.11 1.54004 19.07C3.44004 20.29 5.70004 21 8.12004 21C16 21 20.33 14.46 20.33 8.79C20.33 8.6 20.33 8.42 20.32 8.23C21.16 7.63 21.88 6.87 22.46 6Z" fill="black"/>
              </svg>
              <svg className="h-4" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 16.84 5.44 20.87 10 21.8V15H8V12H10V9.5C10 7.57 11.57 6 13.5 6H16V9H14C13.45 9 13 9.45 13 10V12H16V15H13V21.95C18.05 21.45 22 17.19 22 12Z" fill="black"/>
              </svg>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <button onClick={onClose} className="text-xl cursor-pointer font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5" width="2em" height="2em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 15l6-6m-4-3l.463-.536a5 5 0 0 1 7.071 7.072L18 13m-5 5l-.397.534a5.07 5.07 0 0 1-7.127 0a4.97 4.97 0 0 1 0-7.071L6 11"/></svg>
          </button>
          <button onClick={onClose} className="text-xl cursor-pointer font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5" width="2em" height="2em" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="m12 14.122l5.303 5.303a1.5 1.5 0 0 0 2.122-2.122L14.12 12l5.304-5.303a1.5 1.5 0 1 0-2.122-2.121L12 9.879L6.697 4.576a1.5 1.5 0 1 0-2.122 2.12L9.88 12l-5.304 5.304a1.5 1.5 0 1 0 2.122 2.12z"/></g></svg>
          </button>
        </div>

      </div>
      {/* Add more profile info here as needed */}
      <div className="space-y-10">
        <div>
          <div className="px-4 space-y-2">
            <h2 className="font-medium">Tickets</h2>
            <h4 className="text-xs font-medium text-black/40">Active</h4>
          </div>
          
          
          
        </div>

        <div>
          <div className="px-4 space-y-2">
            <h2 className="font-medium">Trips</h2>
            <h4 className="text-xs font-medium text-black/40">Active</h4>
          </div>
          

        </div>
      </div>
    </section>
  );
} 