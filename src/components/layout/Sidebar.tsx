'use client';


import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import type { RootState } from '@/store/store';
import { setSidebarOpen } from '@/store/slices/uiSlice';
import { 
  AiOutlineHome, 
  AiOutlineBook, 
  AiOutlineHeart, 
  AiOutlineSearch, 
  AiOutlineSetting,
  AiOutlineQuestionCircle,
  AiOutlineLogout,
  AiOutlineClose
} from 'react-icons/ai';
import { logout } from '@/store/slices/authSlice';

const sidebarItems = [
  { href: '/for-you', icon: AiOutlineHome, label: 'For you' },
  { href: '/library', icon: AiOutlineBook, label: 'My Library' },
  { href: '/highlights', icon: AiOutlineHeart, label: 'Highlights', disabled: true },
  { href: '/search', icon: AiOutlineSearch, label: 'Search', disabled: true },
];

const bottomItems = [
  { href: '/settings', icon: AiOutlineSetting, label: 'Settings' },
  { href: '/help', icon: AiOutlineQuestionCircle, label: 'Help & Support', disabled: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const isSidebarOpen = useAppSelector((state: RootState) => state.ui.isSidebarOpen);
  const isAuthenticated = useAppSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  const closeSidebar = () => {
    dispatch(setSidebarOpen(false));
  };

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-white bg-opacity-40 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-screen w-[200px] bg-[#f7faf9] border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:z-auto
      `}>
        {/* Close button for mobile */}
        <div className="lg:hidden flex justify-end p-4">
          <button onClick={closeSidebar} className="cursor-pointer">
            <AiOutlineClose className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Logo area */}
        <div className="p-6 border-b border-gray-200">
          <Link href="/" onClick={closeSidebar} className="cursor-pointer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo.png" alt="Summarist" className="h-8" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col px-4 py-6">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <li key={item.href}>
                  {item.disabled ? (
                    <div
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 cursor-not-allowed select-none"
                      aria-disabled="true"
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={closeSidebar}
                      className={`
                        flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer
                        ${isActive 
                          ? 'bg-[#2bd97c] text-[#032b41] font-medium' 
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Bottom items */}
          <div className="mt-auto pt-6">
            <ul className="space-y-2">
              {bottomItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <li key={item.href}>
                    {item.disabled ? (
                      <div
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 cursor-not-allowed select-none"
                        aria-disabled="true"
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={closeSidebar}
                        className={`
                          flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer
                          ${isActive 
                            ? 'bg-[#2bd97c] text-[#032b41] font-medium' 
                            : 'text-gray-700 hover:bg-gray-100'
                          }
                        `}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    )}
                  </li>
                );
              })}
              
              {/* Logout */}
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <AiOutlineLogout className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </aside>
    </>
  );
}