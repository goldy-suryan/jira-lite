import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const params = await context.params;
  return proxyRequest(request, params.path, 'POST');
}

async function proxyRequest(
  request: NextRequest,
  path: string[],
  method: string,
) {
  const apiBaseUrl = 'http://localhost:5000';
  const targetUrl = `${apiBaseUrl}/${path.join('/')}${request.nextUrl.search}`;
  const headers = new Headers(request.headers);

  headers.delete('host');

  const fetchOptions: RequestInit = {
    method,
    headers,
    credentials: 'include',
  };

  if (method !== 'GET' && method !== 'HEAD') {
    fetchOptions.body = await request.text();
  }

  try {
    const response = await fetch(targetUrl, fetchOptions);
    const responseHeaders = new Headers(response.headers);
    const body = await response.text();

    return new NextResponse(body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: 'Proxy request failed',
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
