// Locate a JSON syntax error and build Vietnamese messages for it.

function offsetToLineColumn(text, offset) {
  const clamped = Math.max(0, Math.min(offset, text.length));
  let line = 1;
  let lineStart = 0;
  for (let i = 0; i < clamped; i++) {
    if (text[i] === '\n') {
      line++;
      lineStart = i + 1;
    }
  }
  return { line, column: clamped - lineStart + 1 };
}

export function locateJsonError(text, errorMessage) {
  const message = String(errorMessage ?? '');
  const lc = /line\s+(\d+)\s+column\s+(\d+)/i.exec(message);
  if (lc) return { line: Number(lc[1]), column: Number(lc[2]) };
  const pos = /position\s+(\d+)/i.exec(message);
  if (pos) return offsetToLineColumn(String(text), Number(pos[1]));
  return null;
}

export function parseJson(text) {
  try {
    return { ok: true, data: JSON.parse(text) };
  } catch (err) {
    const loc = locateJsonError(text, err && err.message);
    return { ok: false, line: loc ? loc.line : null, column: loc ? loc.column : null };
  }
}

export function jsonErrorMessageVi(result) {
  if (result && result.line != null && result.column != null) {
    return `File data.json đang bị lỗi ở dòng ${result.line}, cột ${result.column}. Hãy kiểm tra dấu phẩy, dấu ngoặc kép và dấu ngoặc ở quanh vị trí đó.`;
  }
  return 'File data.json đang bị lỗi cú pháp. Hãy kiểm tra dấu phẩy, dấu ngoặc kép và dấu ngoặc.';
}
