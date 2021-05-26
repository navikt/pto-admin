package no.nav.pto_admin.controller

import no.nav.common.types.identer.AktorId
import no.nav.common.types.identer.Fnr
import no.nav.pto_admin.service.AuthService
import no.nav.pto_admin.service.IdentOppslagService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/ident")
class IdentOppslagController(
    val identOppslagService: IdentOppslagService,
    val authService: AuthService
) {

    @GetMapping("/aktorId")
    fun fnrTilAktorId(@RequestParam fnr: Fnr): AktorIdResponse {
        authService.sjekkTilgangTilPtoAdmin()
        return AktorIdResponse(identOppslagService.fnrTilAktorId(fnr))
    }

    @GetMapping("/fnr")
    fun aktorIdTilFnr(@RequestParam aktorId: AktorId): FnrResponse {
        authService.sjekkTilgangTilPtoAdmin()
        return FnrResponse(identOppslagService.aktorIdTilFnr(aktorId))
    }

    data class AktorIdResponse(val aktorId: AktorId)

    data class FnrResponse(val fnr: Fnr)

}