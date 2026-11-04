import { parseJson, jsonErrorMessageVi } from './json-error.js';

export class DataError extends Error {
  constructor(userMessage) {
    super(userMessage);
    this.name = 'DataError';
    this.userMessage = userMessage;
  }
}

export async function loadData(url = 'data.json', fetchFn) {
  // Resolve the global fetch at call time so it works in browsers and in tests.
  const doFetch = fetchFn || ((...args) => globalThis.fetch(...args));

  let response;
  let text;
  try {
    response = await doFetch(url, { cache: 'no-cache' });
    if (response.ok) text = await response.text();
  } catch {
    throw new DataError('Không tải được file data.json. Kiểm tra kết nối mạng hoặc đường dẫn.');
  }
  if (!response.ok) {
    throw new DataError(`Không tải được file data.json (mã lỗi ${response.status}).`);
  }

  const result = parseJson(text);
  if (!result.ok) throw new DataError(jsonErrorMessageVi(result));
  return result.data;
}
