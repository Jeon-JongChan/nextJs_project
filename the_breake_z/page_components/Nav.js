/* next Module */
import Script from "next/script";

// * react
export default function Nav() {
    return (
        <>
            <nav className="bg-gray-800">
                <div className="mx-auto max-w-7xl px-2">
                    <div className="relative flex h-16 items-center justify-between">
                        <div className="flex items-center justify-center sm:items-stretch sm:justify-start">
                            <div className="flex space-x-4">
                                <a href="/admin" className="apply-nav-item" aria-current="page">
                                    포켓몬 관리자
                                </a>
                                <a href="/admin/boilerplate" className="apply-nav-item" aria-current="page">
                                    상용구 관리자
                                </a>
                                <a href="/" className="apply-nav-item">
                                    배틀
                                </a>
                            </div>
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            <button type="button" className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white">
                                <span className="sr-only">View notifications</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
