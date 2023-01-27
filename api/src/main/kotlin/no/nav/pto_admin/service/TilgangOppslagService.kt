package no.nav.pto_admin.service

import no.nav.poao_tilgang.client.*
import no.nav.common.types.identer.EnhetId
import no.nav.common.types.identer.NorskIdent
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import java.util.UUID

@Service
class TilgangOppslagService(val poaoTilgangClient: PoaoTilgangClient, val authService: AuthService, val auditLogService: AuditLogService) {

    fun sjekkAnsattTilgangTilEnhet(enhetId: EnhetId?): Boolean {
                var tilgang = true
                val tilgangResult = poaoTilgangClient.evaluatePolicy(
                    NavAnsattTilgangTilNavEnhetPolicyInput(authService.getInnloggetAnsattUUID(), enhetId.toString())
                ).getOrThrow()

                auditLogService.auditLogWithMessageAndDestinationUserId("Bedt om tilgang til enhet ", enhetId.toString(), authService.getInnloggetAnsattUUID().toString() )
                if (tilgangResult.isDeny) {
                    tilgang = false
                    throw ResponseStatusException(HttpStatus.FORBIDDEN, "Ikke tilgang til enhet")
                }
                return tilgang
            }

    fun sjekkAnsattTilgangTilEksternBruker(norskIdent: NorskIdent, tilgangType: TilgangType): Boolean {
        var tilgang = true
        val tilgangResult = poaoTilgangClient.evaluatePolicy(
            NavAnsattTilgangTilEksternBrukerPolicyInput(authService.getInnloggetAnsattUUID(), tilgangType, norskIdent.toString())
        ).getOrThrow()
        auditLogService.auditLogWithMessageAndDestinationUserId("Bedt om tilgang til bruker ", norskIdent.toString(), authService.getInnloggetAnsattUUID().toString() )
        if (tilgangResult.isDeny) {
            tilgang = false
            throw ResponseStatusException(HttpStatus.FORBIDDEN, "Ikke tilgang til enhet")
        }
        return tilgang
    }
    fun harTilgangTilEnhet(enhetId: EnhetId): Boolean {
        return sjekkAnsattTilgangTilEnhet(enhetId)
    }

    fun harLesetilgang(norskIdent: NorskIdent): Boolean {
        return sjekkAnsattTilgangTilEksternBruker(norskIdent, TilgangType.LESE)
    }

    fun harSkrivetilgang(norskIdent: NorskIdent): Boolean {
        return sjekkAnsattTilgangTilEksternBruker(norskIdent, TilgangType.SKRIVE)
    }

    fun harTilgangTilKode6(navAnsattAzureId: UUID): Boolean {
        var tilgang = false
        val tilgangResult = poaoTilgangClient.evaluatePolicy(
            NavAnsattBehandleStrengtFortroligBrukerePolicyInput(navAnsattAzureId)
        ).getOrThrow()
        auditLogService.auditLogWithMessageAndDestinationUserId("Sjekk om tilgang til kode 6","kode 6 brukere", navAnsattAzureId.toString())
        if (tilgangResult.isPermit) {
            tilgang = true }
        return tilgang
    }

    fun harTilgangTilKode7(navAnsattAzureId: UUID): Boolean {
        var tilgang = false
        val tilgangResult = poaoTilgangClient.evaluatePolicy(
            NavAnsattBehandleFortroligBrukerePolicyInput(navAnsattAzureId)
        ).getOrThrow()
        auditLogService.auditLogWithMessageAndDestinationUserId("Sjekk om tilgang til kode 7","kode 7 brukere", navAnsattAzureId.toString())
        if (tilgangResult.isPermit) {
            tilgang = true }
        return tilgang
    }
//TODO mangler!!
    fun harTilgangTilSkjermetPerson(navAnsattAzureId: UUID): Boolean {
        return false
    }

}