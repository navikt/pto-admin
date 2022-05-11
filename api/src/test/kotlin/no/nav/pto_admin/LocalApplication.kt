package no.nav.pto_admin

import no.nav.common.utils.EnvironmentUtils.*
import no.nav.pto_admin.config.ApplicationTestConfig
import no.nav.security.mock.oauth2.MockOAuth2Server
import no.nav.security.mock.oauth2.token.DefaultOAuth2TokenCallback
import okhttp3.mockwebserver.Dispatcher
import okhttp3.mockwebserver.MockResponse
import okhttp3.mockwebserver.MockWebServer
import okhttp3.mockwebserver.RecordedRequest
import org.springframework.boot.autoconfigure.EnableAutoConfiguration
import org.springframework.boot.autoconfigure.security.reactive.ReactiveUserDetailsServiceAutoConfiguration
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Import

@EnableAutoConfiguration(exclude = [ReactiveUserDetailsServiceAutoConfiguration::class])
@Import(ApplicationTestConfig::class)
class LocalApplication

fun main(args: Array<String>) {

    setupNaisProperties()
    startOAuth2MockServer()
    startTargetProxyApps()

    runApplication<LocalApplication>(*args)
}

fun setupNaisProperties() {
    System.setProperty(NAIS_APP_NAME_PROPERTY_NAME, "pto-admin")
    System.setProperty(NAIS_CLUSTER_NAME_PROPERTY_NAME, DEV_CLUSTERS.firstOrNull())
}

fun startOAuth2MockServer() {
    val issuerId = "default"

    val server = MockOAuth2Server()
    server.enqueueCallback(
        DefaultOAuth2TokenCallback(
            issuerId = issuerId,
            subject = "foo",
            claims = mapOf(Pair("name", "Bruker Navn"))
        )
    )

    server.start()

    System.setProperty("AZURE_APP_CLIENT_ID", "pto-admin")
    System.setProperty("AZURE_OPENID_CONFIG_ISSUER", server.issuerUrl(issuerId).toString())
}

fun startTargetProxyApps() {
    val server = MockWebServer()

    server.dispatcher = object: Dispatcher() {
        override fun dispatch(request: RecordedRequest): MockResponse {
            return MockResponse()
                .setResponseCode(200)
                .setBody("""{"path": "${request.path}"}""")
        }
    }

    server.start()

    val appUrl = "http://localhost:${server.port}"

    System.setProperty("VEILARBVEDTAKSSTOTTE_ADMIN_API_URL", appUrl)
    System.setProperty("VEILARBOPPFOLGING_ADMIN_API_URL", appUrl)
    System.setProperty("VEILARBARENA_ADMIN_API_URL", appUrl)
    System.setProperty("VEILARBDIALOG_ADMIN_API_URL", appUrl)
}
