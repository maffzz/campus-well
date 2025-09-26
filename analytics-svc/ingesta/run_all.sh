#!/usr/bin/env bash
set -euo pipefail

# Variables requeridas
: "${AWS_REGION:?export AWS_REGION}"
: "${S3_BUCKET:?export S3_BUCKET}"
: "${BASE_PSY:?export BASE_PSY (e.g. http://host:8081)}"
: "${BASE_SPO:?export BASE_SPO (e.g. http://host:8082)}"
: "${BASE_HAB:?export BASE_HAB (e.g. http://host:8083)}"

IMAGE=cw-ingest:latest

echo "[1/3] Build image $IMAGE"
docker build -t $IMAGE .

echo "[2/3] Ingest sports"
docker run --rm \
  -e BASE_URL="$BASE_SPO" -e ENDPOINT="/events" \
  -e S3_BUCKET="$S3_BUCKET" -e S3_PREFIX="sports" -e AWS_REGION="$AWS_REGION" \
  $IMAGE

echo "[2b] Ingest habits (studentId=1)"
docker run --rm \
  -e BASE_URL="$BASE_HAB" -e ENDPOINT="/habits/1" \
  -e S3_BUCKET="$S3_BUCKET" -e S3_PREFIX="habits" -e AWS_REGION="$AWS_REGION" \
  $IMAGE

echo "[2c] Ingest psych (studentId=1 history)"
docker run --rm \
  -e BASE_URL="$BASE_PSY" -e ENDPOINT="/api/students/1/history" \
  -e S3_BUCKET="$S3_BUCKET" -e S3_PREFIX="psych" -e AWS_REGION="$AWS_REGION" \
  $IMAGE

echo "[3/3] Done. Check s3://$S3_BUCKET/{sports,habits,psych}/"


