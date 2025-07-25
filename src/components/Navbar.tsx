import Search from "./search";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from "./ui/menubar";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth";
import { useState } from "react";
import ProfileDetail from "./ProfileDetail";

export default function Navbar() {
    const navigate = useNavigate();
    const [showProfile, setShowProfile] = useState(false);
    const isLoggedIn = authService.isAuthenticated();

    // Get user info from localStorage
    let avatarUrl = undefined;
    let initials = 'U';
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('odyss_user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          avatarUrl = user.profile_pic || user.avatar || undefined;
          const first = user.first_name?.[0] || '';
          const last = user.last_name?.[0] || '';
          initials = (first + last).toUpperCase() || 'U';
        } catch {}
      }
    }

    const handleLogout = () => {
        authService.clearTokens();
        navigate("/login");
    };

    return(
        <nav className="flex justify-between items-center lg:items-start sticky bg-white top-0 border-b px-8 lg:px-10 py-4 lg:py-8 ">
            <svg className="h-7 w-max cursor-pointer" width="165" height="51" viewBox="0 0 165 51" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => navigate("/")}>
                <path d="M163.56 18.1648L156.103 18.6237C155.976 17.9863 155.702 17.4127 155.281 16.9028C154.86 16.3801 154.306 15.9658 153.617 15.6599C152.942 15.3412 152.132 15.1819 151.189 15.1819C149.927 15.1819 148.863 15.4496 147.996 15.985C147.129 16.5076 146.696 17.2087 146.696 18.0883C146.696 18.7894 146.976 19.3822 147.537 19.8666C148.098 20.351 149.06 20.7398 150.424 21.033L155.74 22.1038C158.595 22.6902 160.724 23.6335 162.126 24.9337C163.529 26.234 164.23 27.9422 164.23 30.0583C164.23 31.9831 163.662 33.6722 162.528 35.1254C161.406 36.5786 159.864 37.7132 157.901 38.529C155.95 39.3321 153.7 39.7337 151.151 39.7337C147.263 39.7337 144.165 38.9242 141.858 37.3052C139.563 35.6736 138.218 33.4555 137.823 30.651L145.835 30.2304C146.077 31.4159 146.664 32.321 147.594 32.9456C148.525 33.5575 149.717 33.8634 151.17 33.8634C152.598 33.8634 153.745 33.5893 154.612 33.0412C155.491 32.4803 155.937 31.7601 155.95 30.8805C155.937 30.1411 155.625 29.5356 155.013 29.064C154.401 28.5795 153.458 28.2099 152.183 27.9549L147.097 26.9415C144.229 26.3678 142.094 25.3735 140.691 23.9586C139.302 22.5436 138.607 20.7398 138.607 18.5472C138.607 16.6606 139.117 15.0353 140.137 13.6713C141.169 12.3073 142.616 11.2556 144.477 10.5163C146.351 9.77691 148.544 9.40723 151.055 9.40723C154.765 9.40723 157.684 10.1912 159.813 11.7591C161.954 13.3271 163.204 15.4623 163.56 18.1648Z" fill="black"/>
                <path d="M133.594 18.1648L126.136 18.6237C126.009 17.9863 125.735 17.4127 125.314 16.9028C124.894 16.3801 124.339 15.9658 123.651 15.6599C122.975 15.3412 122.166 15.1819 121.222 15.1819C119.96 15.1819 118.896 15.4496 118.029 15.985C117.162 16.5076 116.729 17.2087 116.729 18.0883C116.729 18.7894 117.009 19.3822 117.57 19.8666C118.131 20.351 119.093 20.7398 120.457 21.033L125.773 22.1038C128.629 22.6902 130.757 23.6335 132.16 24.9337C133.562 26.234 134.263 27.9422 134.263 30.0583C134.263 31.9831 133.696 33.6722 132.561 35.1254C131.439 36.5786 129.897 37.7132 127.934 38.529C125.983 39.3321 123.733 39.7337 121.184 39.7337C117.296 39.7337 114.198 38.9242 111.891 37.3052C109.596 35.6736 108.252 33.4555 107.856 30.651L115.868 30.2304C116.11 31.4159 116.697 32.321 117.627 32.9456C118.558 33.5575 119.75 33.8634 121.203 33.8634C122.631 33.8634 123.778 33.5893 124.645 33.0412C125.525 32.4803 125.971 31.7601 125.983 30.8805C125.971 30.1411 125.658 29.5356 125.046 29.064C124.435 28.5795 123.491 28.2099 122.217 27.9549L117.13 26.9415C114.262 26.3678 112.127 25.3735 110.725 23.9586C109.335 22.5436 108.64 20.7398 108.64 18.5472C108.64 16.6606 109.15 15.0353 110.17 13.6713C111.203 12.3073 112.65 11.2556 114.511 10.5163C116.385 9.77691 118.577 9.40723 121.088 9.40723C124.798 9.40723 127.717 10.1912 129.846 11.7591C131.987 13.3271 133.237 15.4623 133.594 18.1648Z" fill="black"/>
                <path d="M82.9047 50.1753C81.8721 50.1753 80.9033 50.0924 79.9982 49.9267C79.1059 49.7737 78.3665 49.5761 77.7802 49.3339L79.6158 43.2533C80.5719 43.5465 81.4323 43.7059 82.1972 43.7314C82.9748 43.7569 83.644 43.5784 84.2049 43.196C84.7785 42.8136 85.2438 42.1634 85.6008 41.2456L86.0788 40.0027L75.543 9.79102H84.1093L90.1899 31.3599H90.4958L96.6337 9.79102H105.257L93.842 42.3355C93.2939 43.9162 92.5482 45.2929 91.6048 46.4657C90.6743 47.6512 89.4951 48.5627 88.0674 49.2001C86.6397 49.8502 84.9188 50.1753 82.9047 50.1753Z" fill="black"/>
                <path d="M54.7353 39.6385C52.5045 39.6385 50.484 39.0649 48.6739 37.9176C46.8765 36.7576 45.4487 35.0558 44.3907 32.8122C43.3454 30.5559 42.8228 27.7897 42.8228 24.5135C42.8228 21.1482 43.3645 18.3501 44.4481 16.1193C45.5316 13.8757 46.9721 12.1994 48.7695 11.0904C50.5796 9.96859 52.5619 9.40769 54.7162 9.40769C56.3606 9.40769 57.731 9.68814 58.8273 10.249C59.9363 10.7972 60.8286 11.4855 61.5042 12.3141C62.1926 13.13 62.7153 13.9331 63.0722 14.7234H63.3208V0H71.4473V39.1605H63.4164V34.4566H63.0722C62.6898 35.2725 62.148 36.0819 61.4469 36.885C60.7585 37.6754 59.8598 38.3319 58.7508 38.8545C57.6545 39.3772 56.316 39.6385 54.7353 39.6385ZM57.3167 33.1564C58.6297 33.1564 59.7387 32.7994 60.6438 32.0856C61.5616 31.359 62.2627 30.3456 62.7471 29.0453C63.2443 27.745 63.4929 26.2217 63.4929 24.4753C63.4929 22.7289 63.2507 21.2119 62.7662 19.9244C62.2818 18.6369 61.5807 17.6426 60.6629 16.9415C59.7451 16.2404 58.6297 15.8898 57.3167 15.8898C55.9782 15.8898 54.85 16.2531 53.9322 16.9797C53.0144 17.7064 52.3197 18.7134 51.848 20.0009C51.3763 21.2884 51.1405 22.7799 51.1405 24.4753C51.1405 26.1835 51.3763 27.6941 51.848 29.0071C52.3324 30.3073 53.0271 31.3271 53.9322 32.0665C54.85 32.7931 55.9782 33.1564 57.3167 33.1564Z" fill="black"/>
                <path d="M1.84967 28.3973C0.617092 25.8114 0.000126154 22.8273 9.55963e-05 19.4442C9.55559e-05 16.0608 0.617005 13.07 1.84967 10.4716L1.84967 28.3973Z" fill="black"/>
                <path d="M6.47392 34.2838C5.9868 33.8876 5.52408 33.4671 5.08629 33.0215L5.08629 5.85857C5.52415 5.41477 5.98671 4.99544 6.47392 4.6004L6.47392 34.2838Z" fill="black"/>
                <path d="M40.2295 19.4442C40.2295 23.387 39.3842 26.7885 37.6932 29.6484C36.019 32.5251 33.6684 34.7419 30.6415 36.2987C27.6315 37.8556 24.1141 38.6338 20.0895 38.6338C18.0447 38.6338 16.1265 38.4287 14.3348 38.02L14.3348 32.6225L11.0976 32.6225L11.0976 37.0037C10.6247 36.8107 10.1622 36.6008 9.71054 36.3735L9.71054 23.7618C9.76926 23.8382 9.82979 23.9137 9.89238 23.9878C10.9239 25.1892 12.3275 26.0944 14.1029 26.7036C15.8785 27.3297 17.8994 27.6428 20.1654 27.6428C22.4314 27.6428 24.4523 27.3297 26.2279 26.7036C28.0034 26.0944 29.4069 25.1892 30.4384 23.9878C31.4699 22.7863 31.9855 21.2885 31.9855 19.4948C31.9855 17.6841 31.4699 16.1611 30.4384 14.9258C29.4069 13.7074 28.0034 12.7849 26.2279 12.1588C24.4523 11.5496 22.4314 11.2449 20.1654 11.2449C17.8994 11.2449 15.8785 11.5496 14.1029 12.1588C12.3274 12.7849 10.9239 13.7075 9.89238 14.9258C9.82981 15.002 9.76924 15.0793 9.71054 15.1577L9.71054 2.51425C10.1622 2.28688 10.6247 2.07705 11.0976 1.88399L11.0976 8.11479L14.3348 8.11479L14.3348 0.867689C16.1265 0.458982 18.0447 0.253906 20.0895 0.253906C24.1141 0.253924 27.6315 1.03215 30.6415 2.58899C33.6684 4.14583 36.019 6.35423 37.6932 9.21406C39.3842 12.0909 40.2295 15.5012 40.2295 19.4442Z" fill="black"/>
            </svg>

            <div className="">
                <Search />
            </div>

            <div className="flex gap-4 items-center h-max">        
                {isLoggedIn && (
                  <>
                    <Avatar className="size-10 cursor-pointer" onClick={() => setShowProfile(true)}>
                        <AvatarImage src={avatarUrl} alt={initials} />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <Menubar className="!rounded-full size-10 flex justify-center items-center">
                        <MenubarMenu>
                            <MenubarTrigger className="cursor-pointer !rounded-full size-10">
                                <svg className="h-5" xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="M4 18h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1m0-5h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1M3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1"/></svg>
                            </MenubarTrigger>
                            <MenubarContent>
                            <MenubarItem onClick={() => navigate("/rides")}>Rides</MenubarItem>
                            <MenubarItem onClick={() => navigate("/circles")}>Circles</MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem className="text-xs font-semibold !uppercase" disabled>User</MenubarItem>
                            <MenubarItem onClick={() => setShowProfile(true)}>Profile</MenubarItem>
                            <MenubarSeparator />
                              <MenubarItem className="text-xs font-semibold !uppercase" disabled>Support</MenubarItem>
                              <MenubarSub>
                                <MenubarSubTrigger>Contact Us</MenubarSubTrigger>
                                <MenubarSubContent>
                                  <MenubarItem>
                                    <a
                                      href="mailto:odyss.travels@gmail.com?subject=ALERT:%20SUPPORT%20NEEDED"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="w-full h-full block"
                                    >
                                      Email
                                    </a>
                                  </MenubarItem>
                                  <MenubarItem>
                                    <a
                                      href="https://chat.whatsapp.com/IvFuqtdm37tE79cIvWqHXZ"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="w-full h-full block"
                                    >
                                      Community
                                    </a>
                                  </MenubarItem>
                                </MenubarSubContent>
                              </MenubarSub>
                            <MenubarSeparator />
                            <MenubarItem className="text-xs font-semibold !uppercase" disabled>Auth</MenubarItem>
                            <MenubarItem onClick={handleLogout}>Logout</MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>
                  </>
                )}
                {!isLoggedIn && (
                  <Menubar className="!rounded-full size-10 flex justify-center items-center">
                      <MenubarMenu>
                          <MenubarTrigger className="cursor-pointer !rounded-full size-10">
                              <svg className="h-5" xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" d="M4 18h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1m0-5h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1M3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1"/></svg>
                          </MenubarTrigger>
                          <MenubarContent>
                            <MenubarItem onClick={() => navigate("/login")}>Login</MenubarItem>
                            <MenubarItem onClick={() => navigate("/signup")}>Signup</MenubarItem>
                          </MenubarContent>
                      </MenubarMenu>
                  </Menubar>
                )}
            </div>
            {showProfile && <ProfileDetail onClose={() => setShowProfile(false)} />}
        </nav>
    );
}