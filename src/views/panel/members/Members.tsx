import React, {useEffect, useRef, useState} from 'react';
// @ts-ignore
import {Link, RouteComponentProps} from 'react-router-dom';
import {useAppContext} from "../../context/AppContext";
import axios from "axios";

const Members: React.FC<RouteComponentProps<{}>> = () => {


    const {API, toResource, imManager, token_session} = useAppContext();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

    const hasRun = useRef(false);

    useEffect(() => {
        if (!hasRun.current) {
            // Exécuter l'événement une seule fois
            hasRun.current = true;
            loadMembers();
        }

        return () => {
            hasRun.current = false;
            setMembers([])
        }
    }, []); // Reload members when search term changes

    useEffect(() => {
        setSearchTimeout((prevTimeout) => {
            if (prevTimeout) {
                clearTimeout(prevTimeout);
            }

            if (searchTerm.length === 0) {
                loadMembers(true);
            } else {
                return setTimeout(() => {
                    searchMembers(searchTerm);
                }, 1000);
            }
        });
    }, [searchTerm]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setSearchTerm(value);
    };

    const searchMembers = async (searchQuery: string) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API}users/search`, {
                params: {search: searchQuery},
                headers: {
                    Authorization: 'Bearer ' + token_session,
                },
            });

            if (response.status === 200) {
                setMembers(response.data.data);
                setHasMore(response.data.next_page_url !== null);
            }
        } catch (error) {
            console.error('Error searching members:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMembers = async (clear?: boolean) => {

        setLoading(true);
        try {
            const response = await axios.get(`${API}users` + ((searchTerm && searchTerm.length > 0) ? "/search" : ''), {
                params: {
                    search: searchTerm ?? '',
                    page: clear ? 0 : Math.ceil(members.length / 5) + 1
                },
                headers: {
                    Authorization: 'Bearer ' + token_session,
                },
            });

            if (response.status === 200) {
                const data = response.data.data;
                if (!clear) {
                    setMembers((prevMembers) => [...prevMembers, ...data]);
                } else {
                    setMembers(data)
                }
                setHasMore(response.data.next_page_url !== null);
            }
        } catch (error) {
            console.error('Error fetching members:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = () => {
        loadMembers();
    };

    return (
        <>
            <h1 className="text-2xl mb-2 font-bold">Liste des membres</h1>
            <p className="text-sm">Retrouvez tous les membres de votre club et faciliter leurs gestions et la
                communication avec eux.</p>
            <div className="pt-3">
                <Link to="/members/new"
                      className="flex justify-center w-full mt-auto px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300">
                    + Nouveau membre
                </Link>
            </div>
            <hr className="my-5"/>
            <div className="flex flex-col gap-3">
                <div className="mt-2 w-full">
                    <label htmlFor="search" className="mb-2 block text-sm font-medium leading-6 text-gray-900">Rechercher
                        un membre</label>
                    <input
                        id="search"
                        name="search"
                        type="text"
                        autoComplete="search"
                        required
                        className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        onChange={handleSearchChange}
                        value={searchTerm}
                    />
                </div>
            </div>
            <p className="text-gray-400 text-xs py-2 mb-2">Nous avons trouvée {members.length} membre(s) dans votre
                club</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {
                    members.map((member: any, index: number) => {
                        return (
                            <div key={"member" + index}
                                 className="w-full bg-white border border-gray-200 rounded-lg shadow">
                                <div className="flex flex-col items-center p-10 pb-0">
                                    <img className="w-24 h-24 mb-3 rounded-full shadow-lg object-cover"
                                         src={toResource(member.picture)}
                                         alt="Bonnie image"/>
                                    <h5 className="mb-1 text-xl font-medium text-gray-900">{member.firstname + ' ' + member.lastname}</h5>
                                    <span
                                        className="text-sm text-gray-500">{member.managing?.role ?? (member.licensed ? 'Joueur' : 'Membre')}</span>
                                </div>
                                <div className="flex justify-center flex-wrap mt-4 md:mt-6 gap-2 pb-10 px-4">
                                    <a href={"tel:" + member.phone}
                                       className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-indigo-700 rounded-lg hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300">
                                        <i className="fa-solid fa-phone pe-1 text-sm"></i>
                                        Téléphoner
                                    </a>
                                    <a href={"sms:" + member.phone}
                                       className="py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-indigo-700 focus:z-10 focus:ring-4 focus:ring-gray-100">
                                        <i className="fa-solid fa-envelope pe-1 text-sm"></i>
                                        Message
                                    </a>
                                    {
                                        imManager() && (
                                            <Link to={"/members/edit/" + member.id}
                                                  className="py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-indigo-700 focus:z-10 focus:ring-4 focus:ring-gray-100">
                                                <i className="fa-solid fa-pen pe-1 text-sm"></i>
                                                Gérer
                                            </Link>
                                        )
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            {hasMore && (
                <div className="flex justify-center my-4">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleLoadMore}
                        disabled={loading}
                    >
                        {loading ? 'Chargement...' : 'Voir plus'}
                    </button>
                </div>
            )}
        </>
    )
}

export default Members;
