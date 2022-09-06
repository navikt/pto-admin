package no.nav.pto_admin.utils

class AzureSystemTokenProvider(private val systemTokenProviders: Map<SystembrukereAzure, () -> String>) {

    fun getSystemToken(system: SystembrukereAzure): (String) {
        return systemTokenProviders[system]!!.invoke()
    }

}