FROM busybox:1.36.1-uclibc AS busybox

FROM gcr.io/distroless/java21

COPY --from=busybox /bin/sh /bin/sh
COPY --from=busybox /bin/printenv /bin/printenv

ENV TZ="Europe/Oslo"
WORKDIR /app
COPY api/build/libs/api-1.0.0.jar ./app.jar
EXPOSE 8080
USER nonroot
CMD ["app.jar"]
