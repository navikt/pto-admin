package no.nav.pto_admin.service

import no.nav.common.abac.Pep
import no.nav.common.abac.domain.request.ActionId
import no.nav.common.types.identer.EnhetId
import no.nav.common.types.identer.Fnr
import no.nav.common.types.identer.NavIdent
import no.nav.common.types.identer.NorskIdent
import no.nav.poao_tilgang.client.NavAnsattBehandleFortroligBrukerePolicyInput
import no.nav.poao_tilgang.client.NavAnsattBehandleSkjermedePersonerPolicyInput
import no.nav.poao_tilgang.client.NavAnsattBehandleStrengtFortroligBrukerePolicyInput
import no.nav.poao_tilgang.client.NavAnsattTilgangTilEksternBrukerPolicyInput
import no.nav.poao_tilgang.client.NavAnsattTilgangTilNavEnhetPolicyInput
import no.nav.poao_tilgang.client.PoaoTilgangClient
import no.nav.poao_tilgang.client.TilgangType
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import reactor.core.publisher.Mono
import java.util.UUID

@Service
class TilgangOppslagService(val veilarbPep: Pep, val poaoTilgangClient: PoaoTilgangClient, val unleashService: UnleashService, val authService: AuthService) {

    fun harTilgangTilEnhet(navIdent: NavIdent, enhetId: EnhetId): Mono<Boolean> {
		if (unleashService.skalBrukePoaoTilgang()) {
			 return authService.hentInnloggetBrukerAzureId().map {
				 it?.let {
					 val decision =
						 poaoTilgangClient.evaluatePolicy(NavAnsattTilgangTilNavEnhetPolicyInput(it, enhetId.get()))
							 .getOrThrow()
					 decision.isPermit
				 } ?: false
			 }
		}
        return Mono.just(veilarbPep.harVeilederTilgangTilEnhet(navIdent, enhetId))
    }

    fun harLesetilgang(navIdent: NavIdent, norskIdent: NorskIdent): Mono<Boolean> {
		if (unleashService.skalBrukePoaoTilgang()) {
			return authService.hentInnloggetBrukerAzureId().map {
				it?.let {
					val decision = poaoTilgangClient.evaluatePolicy(NavAnsattTilgangTilEksternBrukerPolicyInput(it , TilgangType.LESE, norskIdent.get())).getOrThrow()
					 decision.isPermit
				} ?: false
			}
		}
        return Mono.just(veilarbPep.harVeilederTilgangTilPerson(navIdent, ActionId.READ, Fnr.of(norskIdent.get())))
    }

    fun harSkrivetilgang(navIdent: NavIdent, norskIdent: NorskIdent): Mono<Boolean> {
		if (unleashService.skalBrukePoaoTilgang()) {
			return authService.hentInnloggetBrukerAzureId().map {
				it?.let {
					val decision = poaoTilgangClient.evaluatePolicy(
						NavAnsattTilgangTilEksternBrukerPolicyInput(
							it,
							TilgangType.SKRIVE,
							norskIdent.get()
						)
					).getOrThrow()
					decision.isPermit
				} ?: false
			}
		}
        return Mono.just(veilarbPep.harVeilederTilgangTilPerson(navIdent, ActionId.WRITE, Fnr.of(norskIdent.get())))
    }

    fun harTilgangTilKode6(navIdent: NavIdent): Mono<Boolean> {
		if (unleashService.skalBrukePoaoTilgang()) {
			return authService.hentInnloggetBrukerAzureId().map {
				it?.let {
					val decision = poaoTilgangClient.evaluatePolicy(
						NavAnsattBehandleStrengtFortroligBrukerePolicyInput(
							it
						)
					).getOrThrow()
					decision.isPermit
				} ?: false
			}
		}
        return Mono.just(veilarbPep.harVeilederTilgangTilKode6(navIdent))
    }

    fun harTilgangTilKode7(navIdent: NavIdent): Mono<Boolean> {
		if (unleashService.skalBrukePoaoTilgang()) {
			if (unleashService.skalBrukePoaoTilgang()) {
				return authService.hentInnloggetBrukerAzureId().map {
					it?.let {
						val decision = poaoTilgangClient.evaluatePolicy(
							NavAnsattBehandleFortroligBrukerePolicyInput(
								it
							)
						).getOrThrow()
						decision.isPermit
					} ?: false
				}
			}
		}
        return Mono.just(veilarbPep.harVeilederTilgangTilKode7(navIdent))
    }

    fun harTilgangTilSkjermetPerson(navIdent: NavIdent): Mono<Boolean> {
		if (unleashService.skalBrukePoaoTilgang()) {
			return authService.hentInnloggetBrukerAzureId().map {
				it?.let {
					val decision = poaoTilgangClient.evaluatePolicy(
						NavAnsattBehandleSkjermedePersonerPolicyInput(
							it
						)
					).getOrThrow()
					decision.isPermit
				} ?: false
			}
		}
        return Mono.just(veilarbPep.harVeilederTilgangTilEgenAnsatt(navIdent))
    }
}
