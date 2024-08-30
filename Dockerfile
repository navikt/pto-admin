FROM ghcr.io/navikt/baseimages/temurin:21
COPY /api/target/pto-admin.jar app.jar
