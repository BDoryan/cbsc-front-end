import React, {useEffect, useRef, useState} from 'react';
// @ts-ignore
import { Link, RouteComponentProps } from 'react-router-dom';
import {useAppContext} from "../../context/AppContext";
import axios from "axios";
import {useDialog} from "../../context/DialogContext";
import ConfirmDialog from "../dialog/ConfirmDialog";

const Convocations: React.FC<RouteComponentProps<{}>> = () => {

    const { setDialog } = useDialog();
    const { API, addNotification, toResource, imManager, token_session } = useAppContext();
    const [convocations, setConvocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

    const hasRun = useRef(false);

    useEffect(() => {
        if (!hasRun.current) {
            hasRun.current = true;
            loadConvocations();
        }

        return () => {
            hasRun.current = false;
            setConvocations([])
        }
    }, []);

    useEffect(() => {
        setSearchTimeout((prevTimeout) => {
            if (prevTimeout) {
                clearTimeout(prevTimeout);
            }

            if (searchTerm.length === 0) {
                loadConvocations(true);
            } else {
                return setTimeout(() => {
                    searchConvocations(searchTerm);
                }, 1000);
            }
        });
    }, [searchTerm]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchTerm(value);
    };

    const searchConvocations = async (searchQuery: string) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API}convocations/search`, {
                params: { search: searchQuery },
                headers: {
                    Authorization: 'Bearer ' + token_session,
                },
            });

            if (response.status === 200) {
                const convocations = response.data.data;
                setConvocations((prevConvocations) => {
                    const newConvocations = convocations.filter((c: any) => !prevConvocations.some((pc: any) => pc.id === c.id));
                    return [...prevConvocations, ...newConvocations];
                });
                setHasMore(response.data.next_page_url !== null);
            }
        } catch (error) {
            console.error('Error searching convocations:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadConvocations = async (clear?: boolean) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API}convocations` + ((searchTerm && searchTerm.length > 0) ? "/search" : ''), {
                params: {
                    search: searchTerm ?? '',
                    page: clear ? 0 : Math.ceil(convocations.length / 5) + 1
                },
                headers: {
                    Authorization: 'Bearer ' + token_session,
                },
            });

            if (response.status === 200) {
                const data = response.data.data;
                if (!clear) {
                    setConvocations((prevConvocations) => [...prevConvocations, ...data]);
                } else {
                    setConvocations(data)
                }
                console.log(response.data)
                setHasMore(response.data.next_page_url !== null);
            }
        } catch (error) {
            console.error('Error fetching convocations:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteConvocation = async (convocation: any) => {
        setDialog(
            <ConfirmDialog confirm={{
                color: 'red',
                onclick: async () => {
                    // post await /user/login with email and password with axios (wait response to return success or not)
                    try {
                        const response = await axios.delete(`${API}convocations/${convocation.id}`, {
                            headers: {
                                'Authorization': 'Bearer ' + token_session
                            }
                        });

                        if (response.status === 200) {
                            addNotification('Succès', 'La convocation a été supprimée avec succès', 'success');
                            setConvocations((prevConvocations) => prevConvocations.filter((c: any) => c.id !== convocation.id));
                        } else {
                            addNotification('Erreur', 'Une erreur est survenue lors de la confirmation de votre présence', 'error');
                        }
                    } catch (error) {
                        addNotification('Erreur', 'Une erreur est survenue lors de la confirmation de votre présence', 'error');
                    }
                },
                text: 'Je confirme la suppression',
            }}
                           cancel={{
                               color: 'white',
                               text: 'Annuler',
                               onclick: () => {

                               }
                           }}
                           title={"Suppression de : "+convocation.title}
                           content={"Voulez-vous vraiment confirmer la suppression de cette convocation ?"}
            />
        )
    }

    const handleLoadMore = () => {
        loadConvocations();
    };
    return (
        <>
            <h1 className="text-2xl mb-2 font-bold">Liste des convocations</h1>
            <p className="text-sm">
                Retrouvez toutes les convocations à venir pour les événements, réunions et rendez-vous importants.
            </p>
            <div className="pt-3">
                <Link to="/convocations/new" className="flex justify-center w-full mt-auto px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300">
                    + Créer une convocation
                </Link>
            </div>
            <hr className="my-5" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {convocations.map((convocation: any, index: number) => {
                    return (
                        <div key={"convocation" + index} className="w-full bg-white border border-gray-200 rounded-lg shadow">
                            <div className="flex flex-col p-4 pb-0">
                                <h2 className="mb-1 text-lg font-medium text-gray-900">{convocation.title}</h2>
                                <p className="text-sm text-gray-500 leading-[1.3em]">{convocation.content.substring(0, 200)}</p>
                                <div className="py-6 mb-auto">
                                    <p className="text-sm text-gray-600">
                                        <span className="text-indigo-600">{convocation.invitations?.length ?? '0'} membre(s)</span> ont été convié(s) à cet événement.<br />
                                        <span className="text-gray-600">Le <span className="text-indigo-600">{new Date(convocation.datetime).toLocaleString()}</span></span>
                                    </p>
                                </div>
                                <div className="flex justify-between flex-wrap gap-2 mb-5">
                                    <Link to={"/convocations/" + convocation.id} className="py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-indigo-700 focus:z-10 focus:ring-4 focus:ring-gray-100">
                                        <i className="fa-solid fa-eye pe-1 text-sm"></i>
                                        Voir
                                    </Link>
                                    {imManager && (
                                        <div className="flex gap-2">
                                            <Link to={"/convocations/edit/" + convocation.id} className="py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-indigo-700 focus:z-10 focus:ring-4 focus:ring-gray-100">
                                                <i className="fa-solid fa-pen pe-2 text-sm"></i>
                                                Modifier
                                            </Link>
                                            <button onClick={() => deleteConvocation(convocation)} className="py-2 px-4 text-sm font-medium text-red-600 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-red-50 hover:text-red-700 focus:z-10 focus:ring-4 focus:ring-red-100">
                                                <i className="fa-solid fa-trash pe-1 text-sm"></i>
                                                Supprimer
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
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
    );
    }

export default Convocations;
