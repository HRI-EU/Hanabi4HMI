FROM python:3.11-slim@sha256:cfd7ed5c11a88ce533d69a1da2fd932d647f9eb6791c5b4ddce081aedf7f7876 as builder

WORKDIR /build

RUN rm -f /etc/apt/apt.conf.d/docker-clean; echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' > /etc/apt/apt.conf.d/keep-cache
RUN --mount=type=cache,target=/var/lib/apt \
    --mount=type=cache,target=/var/cache/apt \
    apt-get update && apt-get install -y --no-install-recommends \
    git=1:2.39.2-1.1 \
    cmake=3.25.1-1 \
    npm=9.2.0~ds1-1 \
    gcc=4:12.2.0-3 \
    g++=4:12.2.0-3


RUN --mount=type=bind,rw,target=. \
    --mount=type=cache,target=/root/.cache/pip \
    pip install .

FROM python:3.11-slim@sha256:cfd7ed5c11a88ce533d69a1da2fd932d647f9eb6791c5b4ddce081aedf7f7876

COPY --from=builder /usr/local /usr/local

EXPOSE 8000
ENTRYPOINT [ "/usr/local/bin/hanabi" ]
