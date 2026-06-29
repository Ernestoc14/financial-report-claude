const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

async function request<T>(
  path: string,
  options: RequestInit & { jwt?: string } = {}
): Promise<T> {
  const { jwt, ...init } = options;
  const res = await fetch(`${STRAPI_URL}/api${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
      ...init.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err?.error?.message ?? `Strapi ${init.method ?? "GET"} ${path} → ${res.status}`
    );
  }
  return res.json();
}

export function strapiGet<T>(path: string, jwt?: string): Promise<T> {
  return request<T>(path, { jwt, next: { revalidate: 60 } } as RequestInit & { jwt?: string });
}

export function strapiPost<T>(path: string, body: unknown, jwt?: string): Promise<T> {
  return request<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
    jwt,
  });
}

export function strapiPut<T>(path: string, body: unknown, jwt?: string): Promise<T> {
  return request<T>(path, {
    method: "PUT",
    body: JSON.stringify(body),
    jwt,
  });
}

export function strapiDelete(path: string, jwt?: string): Promise<void> {
  return request<void>(path, { method: "DELETE", jwt });
}
