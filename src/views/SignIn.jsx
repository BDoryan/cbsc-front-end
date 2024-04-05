import React, {useState} from "react";
import {QrReader} from "react-qr-reader";
import {useAppContext} from "./context/AppContext";

const SignIn = () => {

    const {login, logged, loginWithToken} = useAppContext();
    const [useQrCode, setUseQrCode] = useState(false);
    const [qrCodeStatus, setQrCodeStatus] = useState();
    const [cameraFacingMode, setCameraFacingMode] = useState("environment"); // Par défaut sur la caméra arrière

    const detectQrCode = async (data) => {
        if (logged) return;

        setQrCodeStatus('Tentative de capture de donnée.')
        console.log('try')
        if (data) {
            setQrCodeStatus('La caméra à capturer des données.')

            const token = data.text;
            if (!await loginWithToken(token)) {
                setErrorMessage("La connexion n'est pas possible, vérifiez votre QrCode.")
                setQrCodeStatus('');
                return;
            }
            setErrorMessage(null)
        } else {
            setQrCodeStatus('La caméra ne détecte rien pour le moment...')
        }
    }

    const [errorMessage, setErrorMessage] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        const r = await login(email, password);
        if (!r) {
            setErrorMessage("Adresse e-mail ou mot de passe incorrect");
            return;
        }
        setErrorMessage(null);
        console.log(r);
    }

    const toggleCameraFacingMode = () => {
        setCameraFacingMode(prevMode => prevMode === "environment" ? "user" : "environment");
    }

// @ts-ignore
    return (
        <>
            {useQrCode ? (
                <>
                    <div className="h-[100vh] flex flex-col justify-center">
                        <p className={"text-center mb-3"}>Scanner votre QRCode</p>
                        <div className={"mx-auto h-[250px] w-[250px] border-stone-300 bg-stone-100 border-[1px]"}>
                            <QrReader
                                scanDelay={1000}
                                style={{width: '100%'}}
                                onError={(err) => console.error(err)}
                                onResult={detectQrCode}
                                constraints={ {facingMode: cameraFacingMode}} // Utilise la valeur de la caméra sélectionnée
                            />
                        </div>
                        <p className="text-gray-500 text-sm pt-5 text-center">{!errorMessage ? qrCodeStatus : ''}</p>
                        <p className="text-red-700 text-sm pt-1 text-center">{errorMessage}</p>
                        <p className="mt-10 text-center text-sm text-gray-500">
                            Connexion avec identifiants ?
                            <button onClick={() => setUseQrCode((qrcode) => !qrcode)}
                                    className="ps-1 font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                                Utiliser votre adresse e-mail
                            </button>
                        </p>
                        {/* Ajouter le bouton de commutation entre les caméras */}
                        {/*<button onClick={toggleCameraFacingMode}*/}
                        {/*        className="mt-3 px-4 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-500">*/}
                        {/*    Basculer caméra ({cameraFacingMode === 'environment' ? 'Avant' : 'Arrière'})*/}
                        {/*</button>*/}
                    </div>
                </>
            ) : (
                <div className="flex min-h-[100vh] flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <img className="mx-auto h-[80px] w-auto" src="logo192.png" alt="Your Company"/>
                        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Connexion
                            à votre compte</h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form onSubmit={submit} className="space-y-6" action="#" method="POST">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Votre
                                    adresse e-mail</label>
                                <div className="mt-2">
                                    <input onChange={(text) => setEmail(text.target.value)} value={email} id="email"
                                           name="email" type="email" autoComplete="email" required
                                           className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password"
                                           className="block text-sm font-medium leading-6 text-gray-900">Mot
                                        de passe</label>
                                </div>
                                <div className="mt-2">
                                    <input onChange={
                                        (text) => setPassword(text.target.value)
                                    } value={password}
                                           id="password" name="password" type="password" autoComplete="current-password"
                                           required
                                           className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                                </div>
                                <p className="text-red-700 text-sm pt-3 pb-1">{errorMessage}</p>
                            </div>

                            <div>
                                <button type="submit"
                                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Se
                                    connecter
                                </button>
                            </div>
                        </form>

                        <p className="mt-10 text-center text-sm text-gray-500">
                            Connexion rapide ?
                            <button onClick={() => setUseQrCode((qrcode) => !qrcode)}
                                    className="ps-1 font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                                Scanner votre QR Code
                            </button>
                        </p>
                    </div>
                </div>
            )}
        </>
    )
}

export default SignIn;
