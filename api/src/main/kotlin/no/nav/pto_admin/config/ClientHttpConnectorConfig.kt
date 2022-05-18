package no.nav.pto_admin.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.client.reactive.ReactorClientHttpConnector
import org.springframework.http.client.reactive.ReactorResourceFactory
import org.springframework.security.oauth2.client.endpoint.WebClientReactiveAuthorizationCodeTokenResponseClient
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder
import org.springframework.web.reactive.function.client.WebClient

@Configuration
class ClientHttpConnectorConfig {

    @Bean
    fun clientHttpConnector(reactorResourceFactory: ReactorResourceFactory): ReactorClientHttpConnector {
        return ReactorClientHttpConnector(reactorResourceFactory) { mapper -> mapper.proxyWithSystemProperties() }
    }

    @Bean
    fun webClient(reactorClientHttpConnector: ReactorClientHttpConnector): WebClient {
        return WebClient.builder().clientConnector(reactorClientHttpConnector).build()
    }

    @Bean
    fun webClientReactiveAuthorizationCodeTokenResponseClient(
        webClient: WebClient
    ): WebClientReactiveAuthorizationCodeTokenResponseClient {
        val client = WebClientReactiveAuthorizationCodeTokenResponseClient()
        client.setWebClient(webClient)
        return client
    }

    @Bean
    fun reactiveJwtDecoder(
        webClient: WebClient,
        @Value("\${spring.security.oauth2.client.provider.azure.jwk-set-uri}") jwkSetUri: String
    ): ReactiveJwtDecoder {
        return NimbusReactiveJwtDecoder.withJwkSetUri(jwkSetUri).webClient(webClient).build()
    }
}
