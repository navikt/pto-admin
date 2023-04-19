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

@Service
class TilgangOppslagService(val veilarbPep: Pep, val poaoTilgangClient: PoaoTilgangClient, val unleashService: UnleashService, val authService: AuthService) {

    fun harTilgangTilEnhet(navIdent: NavIdent, enhetId: EnhetId): Boolean {
    	if (unleashService.skalBrukePoaoTilgang()) {
			val decision = poaoTilgangClient.evaluatePolicy(NavAnsattTilgangTilNavEnhetPolicyInput(hentBrukerAzureId() , enhetId.get())).getOrThrow()
			return decision.isPermit
		}
        return veilarbPep.harVeilederTilgangTilEnhet(navIdent, enhetId)
    }

    fun harLesetilgang(navIdent: NavIdent, norskIdent: NorskIdent): Boolean {
		if (unleashService.skalBrukePoaoTilgang()) {
			val decision = poaoTilgangClient.evaluatePolicy(NavAnsattTilgangTilEksternBrukerPolicyInput(hentBrukerAzureId() , TilgangType.LESE, norskIdent.get())).getOrThrow()
			return decision.isPermit
		}
        return veilarbPep.harVeilederTilgangTilPerson(navIdent, ActionId.READ, Fnr.of(norskIdent.get()))
    }

    fun harSkrivetilgang(navIdent: NavIdent, norskIdent: NorskIdent): Boolean {
		if (unleashService.skalBrukePoaoTilgang()) {
			val decision = poaoTilgangClient.evaluatePolicy(NavAnsattTilgangTilEksternBrukerPolicyInput(hentBrukerAzureId() , TilgangType.SKRIVE, norskIdent.get())).getOrThrow()
			return decision.isPermit
		}
        return veilarbPep.harVeilederTilgangTilPerson(navIdent, ActionId.WRITE, Fnr.of(norskIdent.get()))
    }

    fun harTilgangTilKode6(navIdent: NavIdent): Boolean {
		if (unleashService.skalBrukePoaoTilgang()) {
			val decision = poaoTilgangClient.evaluatePolicy(NavAnsattBehandleStrengtFortroligBrukerePolicyInput(hentBrukerAzureId())).getOrThrow()
			return decision.isPermit
		}
        return veilarbPep.harVeilederTilgangTilKode6(navIdent)
    }

    fun harTilgangTilKode7(navIdent: NavIdent): Boolean {
		if (unleashService.skalBrukePoaoTilgang()) {
			val decision = poaoTilgangClient.evaluatePolicy(NavAnsattBehandleFortroligBrukerePolicyInput(hentBrukerAzureId())).getOrThrow()
			return decision.isPermit
		}
        return veilarbPep.harVeilederTilgangTilKode7(navIdent)
    }

    fun harTilgangTilSkjermetPerson(navIdent: NavIdent): Boolean {
		if (unleashService.skalBrukePoaoTilgang()) {
			val decision = poaoTilgangClient.evaluatePolicy(NavAnsattBehandleSkjermedePersonerPolicyInput(hentBrukerAzureId())).getOrThrow()
			return decision.isPermit
		}
        return veilarbPep.harVeilederTilgangTilEgenAnsatt(navIdent)
    }

	private fun hentBrukerAzureId() = authService.hentInnloggetBrukerAzureId().toFuture().get() ?: throw ResponseStatusException(HttpStatus.FORBIDDEN, "Kan ikke finne brukeren")
}
