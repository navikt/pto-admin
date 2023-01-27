package no.nav.pto_admin.service

import no.nav.poao_tilgang.client.*
import no.nav.common.types.identer.EnhetId
import no.nav.common.types.identer.NorskIdent
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import java.util.UUID

@Service
class TilgangOppslagService(val poaoTilgangClient: PoaoTilgangClient) {

    fun sjekkAnsattTilgangTilEnhet(navAnsattAzureId: UUID, enhetId: EnhetId?): Boolean {
                var tilgang = true
                val tilgangResult = poaoTilgangClient.evaluatePolicy(
                    NavAnsattTilgangTilNavEnhetPolicyInput(navAnsattAzureId, enhetId.toString())
                ).getOrThrow()

                if (tilgangResult.isDeny) {
                    tilgang = false
                    throw ResponseStatusException(HttpStatus.FORBIDDEN, "Ikke tilgang til enhet")
                }
                return tilgang
            }

    fun sjekkAnsattTilgangTilEksternBruker(navAnsattAzureId: UUID, norskIdent: NorskIdent, tilgangType: TilgangType): Boolean {
        var tilgang = true
        val tilgangResult = poaoTilgangClient.evaluatePolicy(
            NavAnsattTilgangTilEksternBrukerPolicyInput(navAnsattAzureId, tilgangType, norskIdent.toString())
        ).getOrThrow()

        if (tilgangResult.isDeny) {
            tilgang = false
            throw ResponseStatusException(HttpStatus.FORBIDDEN, "Ikke tilgang til enhet")
        }
        return tilgang
    }
    fun harTilgangTilEnhet(navAnsattAzureId: UUID, enhetId: EnhetId): Boolean {
        return sjekkAnsattTilgangTilEnhet(navAnsattAzureId, enhetId)
    }

    fun harLesetilgang(navAnsattAzureId: UUID, norskIdent: NorskIdent): Boolean {
        return sjekkAnsattTilgangTilEksternBruker(navAnsattAzureId, norskIdent, TilgangType.LESE)
    }

    fun harSkrivetilgang(navAnsattAzureId: UUID, norskIdent: NorskIdent): Boolean {
        return sjekkAnsattTilgangTilEksternBruker(navAnsattAzureId, norskIdent, TilgangType.SKRIVE)
    }

    fun harTilgangTilKode6(navAnsattAzureId: UUID): Boolean {
        val tilgangResult = poaoTilgangClient.evaluatePolicy(
            NavAnsattBehandleStrengtFortroligBrukerePolicyInput(navAnsattAzureId)
        ).getOrThrow()

        return tilgangResult.isPermit
    }

    fun harTilgangTilKode7(navAnsattAzureId: UUID): Boolean {
        val tilgangResult = poaoTilgangClient.evaluatePolicy(
            NavAnsattBehandleFortroligBrukerePolicyInput(navAnsattAzureId)
        ).getOrThrow()

        return tilgangResult.isPermit
    }
//TODO mangler!!
    fun harTilgangTilSkjermetPerson(navAnsattAzureId: UUID): Boolean {
        return false
    }

}