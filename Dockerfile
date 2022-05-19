FROM ghcr.io/navikt/poao-baseimages/java:17
COPY /api/target/pto-admin.jar app.jar
