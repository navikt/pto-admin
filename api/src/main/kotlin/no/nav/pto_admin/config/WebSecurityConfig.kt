package no.nav.pto_admin.config

import org.springframework.context.annotation.Bean
import org.springframework.http.HttpMethod.GET
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity
import org.springframework.security.config.web.server.ServerHttpSecurity
import org.springframework.security.config.web.server.ServerHttpSecurity.AuthorizeExchangeSpec
import org.springframework.security.web.server.SecurityWebFilterChain
import org.springframework.security.web.server.util.matcher.PathPatternParserServerWebExchangeMatcher


@EnableWebFluxSecurity
@Configuration
class WebSecurityConfig {
    @Bean
    fun securityWebFilterChain(http: ServerHttpSecurity): SecurityWebFilterChain? {
        http
            .authorizeExchange { authorize: AuthorizeExchangeSpec ->
                authorize
                    .pathMatchers(GET, "/internal/**").permitAll()
                    .pathMatchers(GET, "/oauth2/**").permitAll()
                    .anyExchange().authenticated()
            }
            .oauth2Login().authenticationMatcher(PathPatternParserServerWebExchangeMatcher("/oauth2/callback"))
            .and()
            .csrf().disable() // session cookie er SameSite lax
        return http.build()
    }
}
