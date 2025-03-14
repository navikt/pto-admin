package no.nav.pto_admin.pdl_pip

import no.nav.common.json.JsonUtils
import no.nav.common.rest.client.RestClient
import okhttp3.OkHttpClient
import okhttp3.Request
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType

open class PdlPipClientImpl(
	private val baseUrl: String,
	private val tokenProvider: () -> String,
	private val httpClient: OkHttpClient = RestClient.baseClient(),
): PdlPipClient {

	private val IDENT_PARAM_NAME: String = "ident"

	override fun hentBrukerInfo(
		brukerIdent: String,
	): BrukerInfo {

		val request = Request.Builder()
			.url("$baseUrl/api/v1/person")
			.header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
			.header(HttpHeaders.AUTHORIZATION, "Bearer " + tokenProvider.invoke())
			.header(IDENT_PARAM_NAME, brukerIdent)
			.build()

		httpClient.newCall(request).execute().use { response ->
			if (!response.isSuccessful) {
				throw RuntimeException("Klarte ikke å hente personinfo fra pdl-pip. Status: ${response.code}")
			}
			val body = response.body?.string() ?: throw RuntimeException("Body is missing")
			val brukerInfoResponse = JsonUtils.fromJson(body, BrukerInfo::class.java)
			return brukerInfoResponse
		}
	}
}
