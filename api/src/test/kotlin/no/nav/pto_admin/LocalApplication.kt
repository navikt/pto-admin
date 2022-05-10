package no.nav.pto_admin

import no.nav.pto_admin.config.ApplicationTestConfig
import no.nav.security.mock.oauth2.MockOAuth2Server
import no.nav.security.mock.oauth2.token.DefaultOAuth2TokenCallback
import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.EnableAutoConfiguration
import org.springframework.boot.autoconfigure.security.reactive.ReactiveUserDetailsServiceAutoConfiguration
import org.springframework.context.annotation.Import

@EnableAutoConfiguration(exclude = [ReactiveUserDetailsServiceAutoConfiguration::class])
@Import(ApplicationTestConfig::class)
class LocalApplication

fun main(args: Array<String>) {

    startOAuth2MockServier()

    val application = SpringApplication(LocalApplication::class.java)

    application.setAdditionalProfiles("local")
    application.run(*args)
}

fun startOAuth2MockServier() {
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
