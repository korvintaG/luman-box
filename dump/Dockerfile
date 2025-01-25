# вначале создаем контейнер - клиент Postgres
FROM alpine
RUN apk --update add bash postgresql postgresql-client && rm -rf /var/cache/apk/*
COPY fimp.sql /tmp/
COPY wait-for-it.sh /tmp/
RUN chmod 777 /tmp/
RUN chmod 777 /tmp/wait-for-it.sh

#ENTRYPOINT ["tail", "-f", "/dev/null"]
#CMD [ "sh", "-c", "psql -h postgres -p 5432 -f /tmp/fill_after_backend.sql" ]
ENTRYPOINT ["/tmp/wait-for-it.sh","http://backend:3000","--","sh","-c","psql -h postgres -p 5432 -f /tmp/fimp.sql"]



