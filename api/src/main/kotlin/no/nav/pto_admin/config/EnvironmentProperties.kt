package no.nav.pto_admin.config

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "app.env")
data class EnvironmentProperties (
    var allowedAdminUsers: String = "",
	var poaoTilgangUrl: String = "",
	var poaoTilgangScope: String = "",
    var naisAadDiscoveryUrl: String = "",
    var naisAadClientId: String = ""
)
