export const BASE_IMAGE_URL = "/base.webp";
export const BASE_ASPECT_RATIO = 1143 / 2000;

export const FONT_FAMILY = "Figtree";
export const FONT_WEIGHT = 400;
export const FONT_SAMPLE = "Aa ąćęłńóśźż ĄĆĘŁŃÓŚŹŻ";

export const DEFAULT_TEXT = "Don't push to main on a Friday";
export const MAX_CHARS = 100;
export const MAX_LINES = 3;

const TEXT_X = 140;
const FIRST_BASELINE = 734;
const LINE_HEIGHT = 130;
const MAX_LINE_WIDTH = 1690;
const BASE_LINE_COUNT = 2;
const PANEL_SPLIT_Y = 905;
const STRETCH_STRIP_HEIGHT = 4;

const FIRST_LINE_SLOPE = -0.011;
const SLOPE_PER_PX = -5.9e-5;

const REFERENCE_TEXT = "Go back to using Inter like you";
const REFERENCE_WIDTH = 1324;

const TEXT_COLOR = "rgb(226, 228, 234)";
const TEXT_SHADOW = "rgba(0, 0, 0, 0.4)";
const TEXT_SHADOW_BLUR = 8;
const TEXT_BLUR = "blur(0.8px)";

let measureContext: CanvasRenderingContext2D | null = null;

export function countChars(text: string) {
  return [...text].length;
}

export function countLines(text: string) {
  measureContext ??= document.createElement("canvas").getContext("2d");
  if (!measureContext) return 1;
  measureContext.font = fontAt(calibratedFontSize(measureContext));
  return wrapText(measureContext, text).length;
}

export function fitText(text: string) {
  let result = [...text].slice(0, MAX_CHARS).join("");
  while (result && countLines(result) > MAX_LINES) {
    const withoutLastWord = result.replace(/\s*\S+\s*$/, "");
    result = withoutLastWord === result ? result.slice(0, -1) : withoutLastWord;
  }
  return result;
}

export function renderMessage(canvas: HTMLCanvasElement, base: HTMLImageElement, text: string) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const fontSize = calibratedFontSize(ctx);
  ctx.font = fontAt(fontSize);
  const lines = wrapText(ctx, text);

  const width = base.naturalWidth;
  const height = base.naturalHeight;
  const extraHeight = (Math.max(lines.length, 1) - BASE_LINE_COUNT) * LINE_HEIGHT;

  canvas.width = width;
  canvas.height = height + extraHeight;

  drawBackground(ctx, base, extraHeight);
  drawLines(ctx, lines, fontSize);
}

function fontAt(size: number) {
  return `${FONT_WEIGHT} ${size}px "${FONT_FAMILY}"`;
}

function calibratedFontSize(ctx: CanvasRenderingContext2D) {
  ctx.font = fontAt(100);
  return (100 * REFERENCE_WIDTH) / ctx.measureText(REFERENCE_TEXT).width;
}

function wrapText(ctx: CanvasRenderingContext2D, text: string) {
  const lines: string[] = [];

  for (const paragraph of text.split("\n")) {
    const words = splitOverlongWords(ctx, paragraph.split(/\s+/).filter(Boolean));
    let line = "";

    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (line && ctx.measureText(candidate).width > MAX_LINE_WIDTH) {
        lines.push(line);
        line = word;
      } else {
        line = candidate;
      }
    }
    lines.push(line);
  }

  while (lines.length > 1 && lines.at(-1) === "") lines.pop();
  return lines;
}

function splitOverlongWords(ctx: CanvasRenderingContext2D, words: string[]) {
  return words.flatMap((word) => {
    if (ctx.measureText(word).width <= MAX_LINE_WIDTH) return [word];

    const chunks: string[] = [];
    let chunk = "";
    for (const char of word) {
      if (chunk && ctx.measureText(chunk + char).width > MAX_LINE_WIDTH) {
        chunks.push(chunk);
        chunk = char;
      } else {
        chunk += char;
      }
    }
    if (chunk) chunks.push(chunk);
    return chunks;
  });
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  base: HTMLImageElement,
  extraHeight: number,
) {
  const width = base.naturalWidth;
  const bottomHeight = base.naturalHeight - PANEL_SPLIT_Y;
  const topHeight = PANEL_SPLIT_Y + Math.min(extraHeight, 0);

  ctx.drawImage(base, 0, 0, width, topHeight, 0, 0, width, topHeight);

  if (extraHeight > 0) {
    const stripY = PANEL_SPLIT_Y - STRETCH_STRIP_HEIGHT;
    ctx.drawImage(
      base,
      0,
      stripY,
      width,
      STRETCH_STRIP_HEIGHT,
      0,
      PANEL_SPLIT_Y,
      width,
      extraHeight,
    );
  }

  const bottomY = PANEL_SPLIT_Y + extraHeight;
  ctx.drawImage(base, 0, PANEL_SPLIT_Y, width, bottomHeight, 0, bottomY, width, bottomHeight);
}

function drawLines(ctx: CanvasRenderingContext2D, lines: string[], fontSize: number) {
  ctx.font = fontAt(fontSize);
  ctx.fillStyle = TEXT_COLOR;
  ctx.textBaseline = "alphabetic";
  ctx.shadowColor = TEXT_SHADOW;
  ctx.shadowBlur = TEXT_SHADOW_BLUR;
  ctx.filter = TEXT_BLUR;

  lines.forEach((line, index) => {
    const offsetY = index * LINE_HEIGHT;
    const slope = FIRST_LINE_SLOPE + offsetY * SLOPE_PER_PX;
    ctx.save();
    ctx.translate(TEXT_X, FIRST_BASELINE + offsetY);
    ctx.rotate(Math.atan(slope));
    ctx.fillText(line, 0, 0);
    ctx.restore();
  });

  ctx.filter = "none";
  ctx.shadowBlur = 0;
}
