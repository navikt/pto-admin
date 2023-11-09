package no.nav.pto_admin.service

import no.nav.common.types.identer.EnhetId
import no.nav.common.types.identer.NavIdent
import no.nav.common.types.identer.NorskIdent
import no.nav.poao_tilgang.client.*
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono

@Service
class TilgangOppslagService(
    val poaoTilgangClient: PoaoTilgangClient,
) {

    fun harTilgangTilEnhet(navIdent: NavIdent, enhetId: EnhetId): Mono<Boolean> {
        val decision =
            poaoTilgangClient.evaluatePolicy(
                NavAnsattNavIdentTilgangTilNavEnhetPolicyInput(
                    navIdent.get(),
                    enhetId.get()
                )
            )
                .getOrThrow()
        return Mono.just(decision.isPermit)
    }

    fun harLesetilgang(navIdent: NavIdent, norskIdent: NorskIdent): Mono<Boolean> {
        val decision = poaoTilgangClient.evaluatePolicy(
            NavAnsattNavIdentLesetilgangTilEksternBrukerPolicyInput(
                navIdent.get(),
                norskIdent.get()
            )
        ).getOrThrow()
        return Mono.just(decision.isPermit)
    }

    fun harSkrivetilgang(navIdent: NavIdent, norskIdent: NorskIdent): Mono<Boolean> {
        val decision = poaoTilgangClient.evaluatePolicy(
            NavAnsattNavIdentSkrivetilgangTilEksternBrukerPolicyInput(
                navIdent.get(),
                norskIdent.get()
            )
        ).getOrThrow()
        return Mono.just(decision.isPermit)
    }

    fun harTilgangTilKode6(navIdent: NavIdent): Mono<Boolean> {
        val decision = poaoTilgangClient.evaluatePolicy(
            NavAnsattNavIdentBehandleStrengtFortroligBrukerePolicyInput(
                navIdent.get()
            )
        ).getOrThrow()
        return Mono.just(decision.isPermit)
    }

    fun harTilgangTilKode7(navIdent: NavIdent): Mono<Boolean> {
        val decision = poaoTilgangClient.evaluatePolicy(
            NavAnsattNavIdentBehandleFortroligBrukerePolicyInput(
                navIdent.get()
            )
        ).getOrThrow()
        return Mono.just(decision.isPermit)
    }

    fun harTilgangTilSkjermetPerson(navIdent: NavIdent): Mono<Boolean> {
        val decision = poaoTilgangClient.evaluatePolicy(
            NavAnsattNavIdentBehandleSkjermedePersonerPolicyInput(
                navIdent.get()
            )
        ).getOrThrow()
        return Mono.just(decision.isPermit)
    }
}
