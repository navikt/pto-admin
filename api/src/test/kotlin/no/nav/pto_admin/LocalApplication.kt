package no.nav.pto_admin

import no.nav.pto_admin.config.ApplicationTestConfig
import no.nav.pto_admin.config.SetupLocalEnvironment
import org.springframework.boot.autoconfigure.EnableAutoConfiguration
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Import

@EnableAutoConfiguration(excludeName = ["org.springframework.boot.autoconfigure.security.reactive.ReactiveUserDetailsServiceAutoConfiguration"])
@Import(value = [ApplicationTestConfig::class])
class LocalApplication

fun main(args: Array<String>) {
    SetupLocalEnvironment.setup()
    runApplication<LocalApplication>(*args)
}
