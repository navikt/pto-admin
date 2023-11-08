package no.nav.pto_admin.service

import no.nav.common.abac.Pep
import no.nav.common.abac.domain.request.ActionId
import no.nav.common.types.identer.EnhetId
import no.nav.common.types.identer.Fnr
import no.nav.common.types.identer.NavIdent
import no.nav.common.types.identer.NorskIdent
import no.nav.poao_tilgang.client.*
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono

@Service
class TilgangOppslagService(
    val veilarbPep: Pep,
    val poaoTilgangClient: PoaoTilgangClient,
    val unleashService: UnleashService,
) {

    fun harTilgangTilEnhet(navIdent: NavIdent, enhetId: EnhetId): Mono<Boolean> {
        if (unleashService.skalBrukePoaoTilgang()) {
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
        return Mono.just(veilarbPep.harVeilederTilgangTilEnhet(navIdent, enhetId))
    }

    fun harLesetilgang(navIdent: NavIdent, norskIdent: NorskIdent): Mono<Boolean> {
        if (unleashService.skalBrukePoaoTilgang()) {
            val decision = poaoTilgangClient.evaluatePolicy(
                NavAnsattNavIdentLesetilgangTilEksternBrukerPolicyInput(
                    navIdent.get(),
                    norskIdent.get()
                )
            ).getOrThrow()
            return Mono.just(decision.isPermit)
        }
        return Mono.just(veilarbPep.harVeilederTilgangTilPerson(navIdent, ActionId.READ, Fnr.of(norskIdent.get())))
    }

    fun harSkrivetilgang(navIdent: NavIdent, norskIdent: NorskIdent): Mono<Boolean> {
        if (unleashService.skalBrukePoaoTilgang()) {
            val decision = poaoTilgangClient.evaluatePolicy(
                NavAnsattNavIdentSkrivetilgangTilEksternBrukerPolicyInput(
                    navIdent.get(),
                    norskIdent.get()
                )
            ).getOrThrow()
            return Mono.just(decision.isPermit)
        }
        return Mono.just(veilarbPep.harVeilederTilgangTilPerson(navIdent, ActionId.WRITE, Fnr.of(norskIdent.get())))
    }

    fun harTilgangTilKode6(navIdent: NavIdent): Mono<Boolean> {
        if (unleashService.skalBrukePoaoTilgang()) {
            val decision = poaoTilgangClient.evaluatePolicy(
                NavAnsattNavIdentBehandleStrengtFortroligBrukerePolicyInput(
                    navIdent.get()
                )
            ).getOrThrow()
            return Mono.just(decision.isPermit)
        }
        return Mono.just(veilarbPep.harVeilederTilgangTilKode6(navIdent))
    }

    fun harTilgangTilKode7(navIdent: NavIdent): Mono<Boolean> {
        if (unleashService.skalBrukePoaoTilgang()) {
            if (unleashService.skalBrukePoaoTilgang()) {
                val decision = poaoTilgangClient.evaluatePolicy(
                    NavAnsattNavIdentBehandleFortroligBrukerePolicyInput(
                        navIdent.get()
                    )
                ).getOrThrow()
                return Mono.just(decision.isPermit)
            }
        }
        return Mono.just(veilarbPep.harVeilederTilgangTilKode7(navIdent))
    }

    fun harTilgangTilSkjermetPerson(navIdent: NavIdent): Mono<Boolean> {
        if (unleashService.skalBrukePoaoTilgang()) {
            val decision = poaoTilgangClient.evaluatePolicy(
                NavAnsattNavIdentBehandleSkjermedePersonerPolicyInput(
                    navIdent.get()
                )
            ).getOrThrow()
            return Mono.just(decision.isPermit)
        }
        return Mono.just(veilarbPep.harVeilederTilgangTilEgenAnsatt(navIdent))
    }
}
