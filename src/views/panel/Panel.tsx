import React, {ReactNode, useState} from 'react';
// @ts-ignore
import {Link, RouteComponentProps} from 'react-router-dom';
import {Outlet} from '../../../node_modules/react-router-dom/dist/index';
import {useAppContext} from "../context/AppContext";

interface PanelProps extends RouteComponentProps {
    children: ReactNode;
}

const Panel: React.FC<PanelProps> = ({}) => {

    const {user, imManager, toResource, logout} = useAppContext();
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            <div className="flex h-[100vh] relative">
                <div onClick={toggleSidebar} className="fixed inset-0 z-50 bg-gray-800 bg-opacity-75 hidden"></div>
                <div
                    className={`shadow-lg bg-gray-100 fixed inset-y-0 left-0 z-10 w-64 overflow-y-auto transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } ease-in transition-transform sm:translate-x-0 sm:static sm:inset-0`}
                >
                    <div className="p-4 h-full flex flex-col">
                        <h1 className="text-xl font-semibold text-gray-800">Tableau de bord</h1>
                        <div className="mt-5 flex flex-col gap-2">
                            {
                                imManager() ? (
                                    <>
                                        <details
                                            className="group transition-all duration-150 h-10 open:h-auto overflow-hidden w-56">
                                            <summary
                                                className="transition-all duration-500 flex cursor-pointer items-center rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                                <i className="w-4 fa-solid fa-user-group"></i>
                                                <span className="ml-3 text-sm font-medium">Membres</span>

                                                <span
                                                    className="ml-auto shrink-0 transition duration-300 group-open:-rotate-180">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
                                             fill="currentColor">
                                            <path fill-rule="evenodd"
                                                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                  clip-rule="evenodd"/>
                                        </svg>
                                    </span>
                                            </summary>

                                            <nav className="mt-1.5 ml-3 flex flex-col transition-all duration-500">
                                                <Link onClick={() => toggleSidebar()} to="/members"
                                                      className="flex items-center rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                                    <i className="w-4 fa-solid fa-users"></i>
                                                    <span className="ml-3 text-sm font-medium">Liste des membres</span>
                                                </Link>

                                                {
                                                    imManager() && (
                                                        <Link onClick={() => toggleSidebar()} to="/members/new"
                                                              className="flex items-center rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                                            <i className="w-4 fa-solid fa-user-plus"></i>
                                                            <span className="ml-3 text-sm font-medium">Nouveau membre</span>
                                                        </Link>
                                                    )
                                                }
                                            </nav>
                                        </details>
                                        <details
                                            className="group transition-all duration-150 h-10 open:h-auto overflow-hidden w-56">
                                            <summary
                                                className="transition-all duration-500 flex cursor-pointer items-center rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                                <i className="w-4 fa-solid fa-sitemap"></i>
                                                <span className="ml-3 text-sm font-medium">Organisations</span>

                                                <span
                                                    className="ml-auto shrink-0 transition duration-300 group-open:-rotate-180">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
                                             fill="currentColor">
                                            <path fill-rule="evenodd"
                                                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                  clip-rule="evenodd"/>
                                        </svg>
                                    </span>
                                            </summary>

                                            <nav className="mt-1.5 ml-3 flex flex-col transition-all duration-500">
                                                <Link onClick={() => toggleSidebar()} to="/convocations"
                                                      className="flex items-center rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                                    <i className="w-4 fa-solid fa-list"></i>
                                                    <span className="ml-3 text-sm font-medium">Les convocations</span>
                                                </Link>

                                                <Link onClick={() => toggleSidebar()} to="/convocations/new"
                                                      className="flex items-center rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                                    <i className="w-4 fa-solid fa-plus-circle"></i>
                                                    <span
                                                        className="ml-3 text-sm font-medium">Créer une convocation</span>
                                                </Link>
                                            </nav>
                                        </details>
                                    </>
                                ) : (
                                    <>

                                        <Link onClick={() => toggleSidebar()} to="/members"
                                              className="flex items-center rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                            <i className="w-4 fa-solid fa-users"></i>
                                            <span className="ml-3 text-sm font-medium">Liste des membres</span>
                                        </Link>
                                        <Link onClick={() => toggleSidebar()} to="/convocations"
                                              className="flex items-center rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                            <i className="w-4 fa-solid fa-list"></i>
                                            <span className="ml-3 text-sm font-medium">Mes convocations</span>
                                        </Link>
                                    </>
                                )
                            }
                        </div>
                        <div className="mt-auto flex gap-2 overflow-hidden items-center">
                            <img src={toResource(user.picture) ?? ''}
                                 className="object-cover w-[40px] h-[40px] rounded-[50%]" alt=""/>
                            <div className="flex flex-col justify-center gap-1">
                                <span
                                    className="font-bold whitespace-nowrap leading-4">{user.firstname + " " + user.lastname}</span>
                                <span
                                    className="text-gray-400 text-sm leading-4">{user.managing?.role ?? (user.licensed ? 'Joueur' : 'Membre')}</span>
                            </div>
                        </div>
                        <button onClick={logout}
                                className="rounded-lg py-2 mt-3 text-gray-200 hover:bg-red-800 bg-red-700 text-sm font-bold">
                            Déconnexion
                        </button>
                    </div>
                </div>
                <div className="block w-full relative">
                    <div
                        className="w-full  bg-indigo-700 p-3 z-50 flex items-end pr-4 sm:hidden sticky top-0 left-0 right-0">
                        <button onClick={() => {
                            window.history.back()
                        }} className="text-gray-200 me-2 focus:outline-none">
                            <i className="w-4 fa-solid fa-arrow-left"/>
                        </button>
                        <span className="text-gray-200 text-lg font-bold leading-6">Club Bouliste Saint Couatais</span>
                        <button
                            onClick={toggleSidebar} className="text-gray-200 ms-auto focus:outline-none">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M4 6h16M4 12h16m-7 6h7"></path>
                            </svg>
                        </button>
                    </div>
                    <div className="flex-1 p-8">
                        <Outlet/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Panel;
