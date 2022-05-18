package no.nav.pto_admin.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.client.reactive.ReactorClientHttpConnector
import org.springframework.http.client.reactive.ReactorResourceFactory
import org.springframework.security.oauth2.client.endpoint.WebClientReactiveAuthorizationCodeTokenResponseClient
import org.springframework.web.reactive.function.client.WebClient

@Configuration
class ClientHttpConnectorConfig {

    @Bean
    fun clientHttpConnector(reactorResourceFactory: ReactorResourceFactory): ReactorClientHttpConnector {
        return ReactorClientHttpConnector(reactorResourceFactory) { mapper -> mapper.proxyWithSystemProperties() }
    }

    @Bean
    fun webClientReactiveAuthorizationCodeTokenResponseClient(
        reactorClientHttpConnector: ReactorClientHttpConnector
    ): WebClientReactiveAuthorizationCodeTokenResponseClient {
        val client = WebClientReactiveAuthorizationCodeTokenResponseClient()
        client.setWebClient(
            WebClient.builder().clientConnector(reactorClientHttpConnector).build()
        )
        return client
    }
}
