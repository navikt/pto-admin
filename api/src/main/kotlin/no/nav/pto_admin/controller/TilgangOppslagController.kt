package no.nav.pto_admin.controller

import no.nav.common.types.identer.EnhetId
import no.nav.common.types.identer.NavIdent
import no.nav.common.types.identer.NorskIdent
import no.nav.pto_admin.service.TilgangOppslagService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/tilgang")
class TilgangOppslagController(private val tilgangOppslagService: TilgangOppslagService) {

    @GetMapping("/enhet")
    fun harTilgangTilEnhet(@RequestParam navIdent: NavIdent, @RequestParam enhetId: EnhetId): HarTilgangResponse {
        return HarTilgangResponse(tilgangOppslagService.harTilgangTilEnhet(navIdent, enhetId))
    }

    @GetMapping("/skriv")
    fun harSkrivetilgang(
        @RequestParam navIdent: NavIdent,
        @RequestParam norskIdent: NorskIdent
    ): HarTilgangResponse {
        return HarTilgangResponse(tilgangOppslagService.harSkrivetilgang(navIdent, norskIdent))
    }

    @GetMapping("/les")
    fun harLesetilgang(
        @RequestParam navIdent: NavIdent,
        @RequestParam norskIdent: NorskIdent
    ): HarTilgangResponse {
        return HarTilgangResponse(tilgangOppslagService.harLesetilgang(navIdent, norskIdent))
    }

    @GetMapping("/kode6")
    fun harTilgangTilKode6(@RequestParam navIdent: NavIdent): HarTilgangResponse {
        return HarTilgangResponse(tilgangOppslagService.harTilgangTilKode6(navIdent))
    }

    @GetMapping("/kode7")
    fun harTilgangTilKode7(@RequestParam navIdent: NavIdent): HarTilgangResponse {
        return HarTilgangResponse(tilgangOppslagService.harTilgangTilKode7(navIdent))
    }

    @GetMapping("/skjermet")
    fun harTilgangTilSkjermetPerson(@RequestParam navIdent: NavIdent): HarTilgangResponse {
        return HarTilgangResponse(tilgangOppslagService.harTilgangTilSkjermetPerson(navIdent))
    }

    data class HarTilgangResponse(val harTilgang: Boolean)

}
