package no.nav.pto_admin.config

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "app.env")
data class EnvironmentProperties (
    var allowedAdminUsers: String = "",
    var onPremKafkaBrokersUrl: String = "",
	var poaoTilgangUrl: String = "",
	var poaoTilgangScope: String = "",
    var pdlApiUrl: String = "",
    var pdlApiScope: String = "",
    var veilarbportefoljeScope: String = "",
    var veilarbvedtaksstotteScope: String = "",
    var veilarboppfolgingScope: String = "",
    var veilarbarenaScope: String = "",
    var veilarbdialogScope: String = "",
)
