// 401応答をアプリ全体で検知し、"session-expired"イベントを発火する仕組み。
// ログインAPI自体の401(認証失敗)はセッション切れ扱いしないよう除外する。
const EXCLUDED_PATHS = ["/api/v1/login"];

let installed = false;

export function installSessionExpiryHandler() {
  if (installed) return;
  installed = true;

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (...args) => {
    const response = await originalFetch(...args);

    const requestUrl =
      typeof args[0] === "string" ? args[0] : args[0]?.url || "";
    const isExcluded = EXCLUDED_PATHS.some((path) => requestUrl.includes(path));

    if (response.status === 401 && !isExcluded) {
      window.dispatchEvent(new CustomEvent("session-expired"));
    }

    return response;
  };
}
