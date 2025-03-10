/*
 * This file was generated by the Gradle 'init' task.
 *
 * This project uses @Incubating APIs which are subject to change.
 */

plugins {
    kotlin("jvm") version "2.0.20"
    kotlin("plugin.spring") version "2.1.20-RC2"
    id("org.springframework.boot") version "3.4.3"
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(21))
    }
}

kotlin {
    jvmToolchain(21)
}

repositories {
    mavenLocal()
    maven {
        url = uri("https://github-package-registry-mirror.gc.nav.no/cached/maven-release")
    }

    maven {
        url = uri("https://repo.maven.apache.org/maven2/")
    }
}

dependencies {
    api(libs.org.springframework.boot.spring.boot.starter.webflux)
    api(libs.org.springframework.boot.spring.boot.starter.cache)
    api(libs.org.springframework.boot.spring.boot.starter.actuator)
    api(libs.org.springframework.boot.spring.boot.starter.logging)
    api(libs.org.springframework.boot.spring.boot.starter.security)
    api(libs.org.springframework.boot.spring.boot.starter.oauth2.client)
    api(libs.org.springframework.cloud.spring.cloud.starter.gateway)
    api(libs.no.nav.poao.tilgang.client)
    api(libs.org.jetbrains.kotlin.kotlin.reflect)
    api(libs.com.fasterxml.jackson.module.jackson.module.kotlin)
    api(libs.org.jetbrains.kotlin.kotlin.stdlib.jdk8)
    api(libs.com.github.ben.manes.caffeine.caffeine)
    api(libs.io.micrometer.micrometer.registry.prometheus)
    api(libs.no.nav.common.log)
    api(libs.no.nav.common.util)
    api(libs.no.nav.common.types)
    api(libs.no.nav.common.client)
    api(libs.no.nav.common.token.client)
    api(libs.no.nav.common.auth)
    api(libs.no.nav.common.health)
    api(libs.no.nav.common.kafka)
    api(libs.no.nav.common.sts)
    api(libs.com.squareup.okhttp3.okhttp)
    api(libs.org.springframework.boot.spring.boot.configuration.processor)
    testImplementation(libs.org.springframework.security.spring.security.test)
    testImplementation(libs.no.nav.security.mock.oauth2.server)
    testImplementation(libs.org.mockito.kotlin.mockito.kotlin)
    testImplementation(libs.org.springframework.boot.spring.boot.starter.test)
    testImplementation(libs.com.squareup.okhttp3.mockwebserver)
}

group = "no.nav.pto-admin"
version = "1.0.0"
description = "pto-admin"
java.sourceCompatibility = JavaVersion.VERSION_21
