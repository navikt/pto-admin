FROM docker.pkg.github.com/navikt/pus-nais-java-app/pus-nais-java-app:java11
COPY /api/target/pto-admin.jar app.jar
COPY /web-app/build /app/public