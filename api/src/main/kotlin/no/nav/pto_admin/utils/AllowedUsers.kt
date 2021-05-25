package no.nav.pto_admin.utils

import java.util.*
import java.util.stream.Collectors

data class AllowedUsers(val users: List<String>)

fun parseAllowedUsersStr(allowedUsersStr: String?): AllowedUsers {
    if (allowedUsersStr.isNullOrBlank()) {
        return AllowedUsers(Collections.emptyList())
    }

    val users = allowedUsersStr.split("\n", ",")
            .stream()
            .filter { !it.isBlank() }
            .collect(Collectors.toList())

    return AllowedUsers(users)
}