export const AvsluttOppfLging = () => {

    return <div className="view kafka-admin">
        <form>
            <h1>Avslutt oppfølging for mange brukere</h1>
            <label htmlFor="brukere" >Liste over brukere som skal avsluttes:</label>
            <textarea id="brukere" />
            <label htmlFor="begrunnelse">Begrunnelse for avsluttning av oppfølging:</label>
            <input id="begrunnelse" type="text" />
            <input type="submit" />
        </form>
    </div>
}