package no.nav.pto_admin.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.client.reactive.ReactorClientHttpConnector
import org.springframework.http.client.reactive.ReactorResourceFactory
import org.springframework.security.oauth2.client.endpoint.WebClientReactiveAuthorizationCodeTokenResponseClient
import org.springframework.security.oauth2.client.oidc.userinfo.OidcReactiveOAuth2UserService
import org.springframework.security.oauth2.client.registration.ClientRegistration
import org.springframework.security.oauth2.client.userinfo.DefaultReactiveOAuth2UserService
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoderFactory
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

    @Bean
    fun reactiveJwtDecoderFactory(reactiveJwtDecoder: ReactiveJwtDecoder): ReactiveJwtDecoderFactory<ClientRegistration> {
        return ReactiveJwtDecoderFactory { reactiveJwtDecoder }
    }

    @Bean
    fun defaultReactiveOAuth2UserService(webClient: WebClient): DefaultReactiveOAuth2UserService {
        val userService = DefaultReactiveOAuth2UserService()
        userService.setWebClient(webClient)
        return userService
    }

    @Bean
    fun oidcReactiveOAuth2UserService(
        defaultReactiveOAuth2UserService: DefaultReactiveOAuth2UserService
    ): OidcReactiveOAuth2UserService {
        val userService = OidcReactiveOAuth2UserService()
        userService.setOauth2UserService(defaultReactiveOAuth2UserService)
        return userService
    }
}
