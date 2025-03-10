FROM ghcr.io/navikt/baseimages/temurin:21
COPY /api/build/libs/api-1.0.0.jar app.jar
