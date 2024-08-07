import { batchAvsluttOppfolging } from '../../api';
export const AvsluttOppfolging = () => {

    function handleSubmit(e: any) {
        e.preventDefault();
        const {aktorIds: aktorIdStrings, begrunnelse} = Object.fromEntries(new FormData(e.target)) as unknown as {aktorIds: string, begrunnelse: string}
        const aktorIds = aktorIdStrings.split(',').map(aktorId => aktorId.trim())
        // tslint:disable-next-line:no-console
        batchAvsluttOppfolging({aktorIds, begrunnelse})
    }
    return <div className="view kafka-admin">
        <form onSubmit={
            handleSubmit
        }>
            <h1>Avslutt oppfølging for mange brukere</h1>
            <label htmlFor="brukere" >Liste over brukere som skal avsluttes:</label>
            <textarea id="brukere" name="aktorIds" />
            <label htmlFor="begrunnelse">Begrunnelse for avsluttning av oppfølging:</label>
            <input id="begrunnelse" type="text" name="begrunnelse"/>
            <input type="submit" />
        </form>
    </div>
}