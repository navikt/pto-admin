package no.nav.pto_admin.controller

import no.nav.common.types.identer.EnhetId
import no.nav.common.types.identer.NorskIdent
import no.nav.pto_admin.service.TilgangOppslagService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController
@RequestMapping("/api/tilgang")
class TilgangOppslagController(private val tilgangOppslagService: TilgangOppslagService) {

    @GetMapping("/enhet")
    fun harTilgangTilEnhet(@RequestParam navAnsattAzureId: UUID, @RequestParam enhetId: EnhetId): HarTilgangResponse {
        return HarTilgangResponse(tilgangOppslagService.harTilgangTilEnhet(navAnsattAzureId, enhetId))
    }

    @GetMapping("/skriv")
    fun harSkrivetilgang(
        @RequestParam navAnsattAzureId: UUID,
        @RequestParam norskIdent: NorskIdent
    ): HarTilgangResponse {
        return HarTilgangResponse(tilgangOppslagService.harSkrivetilgang(navAnsattAzureId, norskIdent))
    }

    @GetMapping("/les")
    fun harLesetilgang(
        @RequestParam navAnsattAzureId: UUID,
        @RequestParam norskIdent: NorskIdent
    ): HarTilgangResponse {
        return HarTilgangResponse(tilgangOppslagService.harLesetilgang(navAnsattAzureId, norskIdent))
    }

    @GetMapping("/kode6")
    fun harTilgangTilKode6(@RequestParam navAnsattAzureId: UUID): HarTilgangResponse {
        return HarTilgangResponse(tilgangOppslagService.harTilgangTilKode6(navAnsattAzureId))
    }

    @GetMapping("/kode7")
    fun harTilgangTilKode7(@RequestParam navAnsattAzureId: UUID): HarTilgangResponse {
        return HarTilgangResponse(tilgangOppslagService.harTilgangTilKode7(navAnsattAzureId))
    }

    @GetMapping("/skjermet")
    fun harTilgangTilSkjermetPerson(@RequestParam navAnsattAzureId: UUID): HarTilgangResponse {
        return HarTilgangResponse(tilgangOppslagService.harTilgangTilSkjermetPerson(navAnsattAzureId))
    }

    data class HarTilgangResponse(val harTilgang: Boolean)

}
