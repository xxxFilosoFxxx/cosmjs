#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck > /dev/null && shellcheck "$0"

TENDERMINT_PORT_GUEST="26657"
TENDERMINT_PORT_HOST="26657"

SCRIPT_DIR="$(realpath "$(dirname "$0")")"
# shellcheck source=./env
# shellcheck disable=SC1091
source "$SCRIPT_DIR"/env

echo "$CONTAINER_NAME"

TMP_DIR=$(mktemp -d "${TMPDIR:-/tmp}/simapp.XXXXXXXXX")
chmod 777 "$TMP_DIR"
echo "Using temporary dir $TMP_DIR"
SIMD_LOGFILE="$TMP_DIR/simd.log"

# Use a fresh volume for every start
docker volume rm -f simapp_data

docker run --rm \
  --name "$CONTAINER_NAME" \
  -p "$TENDERMINT_PORT_HOST":"$TENDERMINT_PORT_GUEST" \
  --mount type=bind,source="$SCRIPT_DIR/template",target=/template \
  --mount type=volume,source=simapp_data,target=/root \
  "$REPOSITORY:$VERSION" \
  /template/run_simd.sh \
  > "$SIMD_LOGFILE" &

echo "simd running on http://localhost:$TENDERMINT_PORT_HOST and logging into $SIMD_LOGFILE"

if [ -n "${CI:-}" ]; then
  # Follow the logs in CI's background job
  tail -f "$SIMD_LOGFILE"
fi
