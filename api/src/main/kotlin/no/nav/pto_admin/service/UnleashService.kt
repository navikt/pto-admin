package no.nav.pto_admin.service

import no.nav.common.featuretoggle.UnleashClient
import org.springframework.stereotype.Service

@Service
class UnleashService(val unleashClient: UnleashClient) {
	private val UNLEASH_POAO_TILGANG_ENABLED = "pto-admin.poao-tilgang-enabled"

	fun skalBrukePoaoTilgang(): Boolean {
		return unleashClient.isEnabled(UNLEASH_POAO_TILGANG_ENABLED)
	}
}
