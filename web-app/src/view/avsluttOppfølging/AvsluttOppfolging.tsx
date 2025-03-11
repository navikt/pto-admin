import { batchAvsluttOppfolging } from '../../api';
import React, { useState } from 'react';

export const AvsluttOppfolging = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(undefined)

    async function handleSubmit(e: any) {
        e.preventDefault();
        const {aktorIds: aktorIdStrings, begrunnelse} = Object.fromEntries(new FormData(e.target)) as unknown as {aktorIds: string, begrunnelse: string}
        const aktorIds = aktorIdStrings.split(',').map(aktorId => aktorId.trim())
        try {
            setError(undefined)
            setIsLoading(true)
            await batchAvsluttOppfolging({aktorIds, begrunnelse})
        } catch (e: any) {
            setError(e?.toString)
        } finally {
            setIsLoading(false)
        }
    }

    return <div className="view kafka-admin">
        <form onSubmit={
            handleSubmit
        } className="large-card card__content space-y-4" style={{ display: 'flex' }}>
            <h1>Avslutt oppfølging for mange brukere</h1>
            <label htmlFor="brukere" >Liste over brukere som skal avsluttes:</label>
            <textarea id="brukere" name="aktorIds" disabled={isLoading} />
            <label htmlFor="begrunnelse">Begrunnelse for avsluttning av oppfølging:</label>
            <input id="begrunnelse" type="text" name="begrunnelse" disabled={isLoading}/>
            <input type="submit" disabled={isLoading} />
            { error || '' }
        </form>
    </div>
}