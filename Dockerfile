FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/jre:openjdk-21

ENV TZ="Europe/Oslo"
WORKDIR /app
COPY api/build/libs/api-1.0.0.jar ./app.jar
CMD ["-jar", "app.jar"]
