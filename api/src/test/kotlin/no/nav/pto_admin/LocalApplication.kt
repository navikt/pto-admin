package no.nav.pto_admin

import no.nav.pto_admin.config.ApplicationTestConfig
import no.nav.pto_admin.config.SetupLocalEnvironment
import org.springframework.boot.autoconfigure.EnableAutoConfiguration
import org.springframework.boot.autoconfigure.security.reactive.ReactiveUserDetailsServiceAutoConfiguration
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Import

@EnableAutoConfiguration(exclude = [ReactiveUserDetailsServiceAutoConfiguration::class])
@Import(ApplicationTestConfig::class)
class LocalApplication

fun main(args: Array<String>) {
    SetupLocalEnvironment.setup()
    runApplication<LocalApplication>(*args)
}
