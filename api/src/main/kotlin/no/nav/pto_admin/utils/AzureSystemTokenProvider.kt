package no.nav.pto_admin.utils

import org.slf4j.Logger
import org.slf4j.LoggerFactory


class AzureSystemTokenProvider(private val systemTokenProviders: Map<SystembrukereAzure, (token: String) -> String>) {
    val log: Logger = LoggerFactory.getLogger(AzureSystemTokenProvider::class.java)

    fun getSystemToken(system: SystembrukereAzure): (String) {
        return systemTokenProviders[system]!!.invoke("unused")
    }

    fun getOboToken(system: SystembrukereAzure, token: String): (String) {
        try {
            val token = systemTokenProviders[system]!!.invoke(token)
            log.info("obo exchange ok - $system")
            return token
        } catch (e: Exception) {
            log.error("Feilet å gjøre obo exchage - $system", e)
            throw RuntimeException("Feil ved henting av system token", e)
        }
    }
}
