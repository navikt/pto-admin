package no.nav.pto_admin.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.client.reactive.ReactorClientHttpConnector
import org.springframework.http.client.reactive.ReactorResourceFactory

@Configuration
class ClientHttpConnectorConfig {

    @Bean
    fun clientHttpConnector(reactorResourceFactory: ReactorResourceFactory): ReactorClientHttpConnector {
        return ReactorClientHttpConnector(reactorResourceFactory) { mapper -> mapper.proxyWithSystemProperties() }
    }

}
