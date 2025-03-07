package no.nav.pto_admin.utils

class AzureSystemTokenProvider(private val systemTokenProviders: Map<SystembrukereAzure, (token: String) -> String>) {

    fun getSystemToken(system: SystembrukereAzure): (String) {
        return systemTokenProviders[system]!!.invoke("unused")
    }

    fun getOboToken(system: SystembrukereAzure, token: String): (String) {
        return systemTokenProviders[system]!!.invoke(token)
    }
}
