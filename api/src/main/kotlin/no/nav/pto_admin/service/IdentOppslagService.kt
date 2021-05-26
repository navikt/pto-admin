package no.nav.pto_admin.service

import no.nav.common.client.aktoroppslag.AktorOppslagClient
import no.nav.common.types.identer.AktorId
import no.nav.common.types.identer.Fnr
import org.springframework.stereotype.Service

@Service
class IdentOppslagService(val aktorOppslagClient: AktorOppslagClient) {

    fun aktorIdTilFnr(aktorId: AktorId): Fnr {
        return aktorOppslagClient.hentFnr(aktorId)
    }

    fun fnrTilAktorId(fnr: Fnr): AktorId {
        return aktorOppslagClient.hentAktorId(fnr)
    }

}