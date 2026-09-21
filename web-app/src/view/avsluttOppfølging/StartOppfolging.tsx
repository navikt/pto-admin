import React, {useState} from "react";
import {syncArenaKontorForBruker} from "../../api/ao-oppfolgingskontor";


export const StartOppfolging = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const postStartOppfolging = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const identer = formData.get('identer') as string;
        setIsLoading(true);
        await syncArenaKontorForBruker({ identer });
        setIsLoading(false);
    };

    return (
        <div className="p-4 bg-gray-white"></div>
    )

}