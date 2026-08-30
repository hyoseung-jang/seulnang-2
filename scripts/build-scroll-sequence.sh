#!/usr/bin/env bash
# 스크롤 시퀀스 프레임 빌더 — 힉스필드 마스터 영상 → public/sequences/<이름>/
#
#   scripts/build-scroll-sequence.sh <마스터영상> <이름> [소스fps배수]
#   예) scripts/build-scroll-sequence.sh ~/Downloads/hf_kiosk_master.mp4 kiosk 2
#
# 마스터(1920x1080 이상)는 저장소에 넣지 않는다. 산출물만 커밋한다.
#
# 두 개의 렌디션을 굽는다 — 클라이언트는 정확히 하나만 내려받는다.
#   wide/ 1920x1080  가로 뷰포트(데스크톱·노트북)
#   tall/  810x1080  세로 뷰포트(휴대폰·세로 태블릿). 마스터의 중앙을 자른 것이라
#          cover 로 잘려 보이던 그 영역과 화면이 정확히 같고, 높이(1080)는 그대로라
#          선명도는 wide 와 동일하면서 용량만 절반 이하다.
#
# 코덱은 AVIF(SVT-AV1 10bit). 같은 화질에서 WebP 대비 30~40% 가볍고,
# 10bit 라 로비 벽면 그러데이션에 밴딩이 생기지 않는다.
#
# 화질점(crf)은 컷마다 다르게 잡는다 — 소재가 얼마나 무거운지가 컷마다 다르다.
# 달리아웃 같은 매끈한 컷은 crf 31 로 충분하지만, 건물 외관처럼 화면 전체가
# 고주파 텍스처(석재·목재 루버·창틀)인 컷은 같은 crf 에서 프레임당 용량이
# 두 배가 된다. tall 은 폰에서 어차피 1.5배 확대되어 표시되므로 wide 보다
# 몇 단계 높은 crf 를 써도 눈에 띄지 않는다.
#   CRF_WIDE=33 CRF_TALL=36 scripts/build-scroll-sequence.sh <마스터> dawn 2
set -euo pipefail

MASTER="${1:?마스터 영상 경로가 필요하다}"
NAME="${2:?시퀀스 이름이 필요하다 (예: kiosk)}"
STEP="${3:-2}"   # 소스 프레임 몇 개당 하나를 쓸지 — 24fps 소스에 2 면 12fps

CRF_WIDE="${CRF_WIDE:-31}"
CRF_TALL="${CRF_TALL:-31}"
PRESET=3
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/sequences/$NAME"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

echo "▶ 마스터에서 프레임 추출 (매 ${STEP}번째)"
mkdir -p "$WORK/png"
ffmpeg -y -v error -i "$MASTER" \
  -vf "select='not(mod(n\,$STEP))',scale=1920:1080:flags=lanczos,format=rgb24" \
  -fps_mode passthrough "$WORK/png/%03d.png"

COUNT=$(find "$WORK/png" -name '*.png' | wc -l | tr -d ' ')
echo "  프레임 $COUNT 장"

encode() {  # <png> <출력avif> <crf> <추가필터>
  local src="$1" dst="$2" crf="$3" vf="${4:-}"
  local args=(-y -v error -i "$src")
  [ -n "$vf" ] && args+=(-vf "$vf")
  args+=(-c:v libsvtav1 -crf "$crf" -preset "$PRESET" -svtav1-params "tune=0"
         -pix_fmt yuv420p10le -frames:v 1 -f avif "$dst")
  ffmpeg "${args[@]}" 2>/dev/null
}
export -f encode
export PRESET

rm -rf "$OUT/wide" "$OUT/tall"
mkdir -p "$OUT/wide" "$OUT/tall"

echo "▶ wide 1920x1080 AVIF (crf $CRF_WIDE / preset $PRESET)"
find "$WORK/png" -name '*.png' -print0 \
  | xargs -0 -P "$(sysctl -n hw.ncpu)" -I{} bash -c \
    'encode "$1" "'"$OUT"'/wide/$(basename "$1" .png).avif" '"$CRF_WIDE" _ {}

echo "▶ tall 810x1080 AVIF (중앙 크롭, 리샘플 없음, crf $CRF_TALL)"
find "$WORK/png" -name '*.png' -print0 \
  | xargs -0 -P "$(sysctl -n hw.ncpu)" -I{} bash -c \
    'encode "$1" "'"$OUT"'/tall/$(basename "$1" .png).avif" '"$CRF_TALL"' "crop=810:1080:555:0"' _ {}

echo "▶ 포스터(첫 프레임, 1600x900 JPEG)"
ffmpeg -y -v error -i "$WORK/png/001.png" \
  -vf "scale=1600:900:flags=lanczos" -q:v 4 "$OUT/poster.jpg"

echo
echo "✔ $OUT"
echo "  frames: $COUNT"
du -sh "$OUT"/wide "$OUT"/tall "$OUT"/poster.jpg
