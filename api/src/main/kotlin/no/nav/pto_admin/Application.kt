package no.nav.pto_admin;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.reactive.ReactiveUserDetailsServiceAutoConfiguration
import org.springframework.boot.runApplication

@SpringBootApplication(exclude = [ReactiveUserDetailsServiceAutoConfiguration::class])
class Application

fun main(args: Array<String>) {
    runApplication<Application>(*args)
}
