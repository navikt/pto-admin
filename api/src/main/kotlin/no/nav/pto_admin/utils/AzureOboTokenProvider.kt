package no.nav.pto_admin.utils

class AzureOboTokenProvider(private val oboTokenProviders: Map<AppName, (token: String) -> String>) {

    fun getOboToken(system: AppName, token: String): (String) {
        return oboTokenProviders[system]!!.invoke(token)
    }
}
