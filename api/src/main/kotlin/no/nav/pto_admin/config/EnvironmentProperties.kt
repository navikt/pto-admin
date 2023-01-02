package no.nav.pto_admin.config

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "app.env")
data class EnvironmentProperties (
    var stsDiscoveryUrl: String = "",
    var abacUrl: String = "",
    var allowedAdminUsers: String = "",
    var onPremKafkaBrokersUrl: String = ""
)
