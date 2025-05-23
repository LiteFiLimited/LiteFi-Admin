import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

// Single handler for all HTTP methods
export function GET(req: NextRequest) {
  return proxyRequest(req);
}

export function POST(req: NextRequest) {
  return proxyRequest(req);
}

export function PUT(req: NextRequest) {
  return proxyRequest(req);
}

export function DELETE(req: NextRequest) {
  return proxyRequest(req);
}

// Helper function to proxy requests to the backend
async function proxyRequest(req: NextRequest) {
  try {
    // Extract the path from the URL
    const pathParts = req.nextUrl.pathname.split('/api/admin/');
    if (pathParts.length < 2) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }
    
    const path = pathParts[1];
    const url = new URL(`${BACKEND_URL}/api/${path}`);
    
    // Copy query parameters
    req.nextUrl.searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });
    
    // Forward the request to the backend
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        // Forward auth cookies if present
        ...(req.headers.get('cookie')
          ? { cookie: req.headers.get('cookie') || '' }
          : {}),
      },
      body: req.method !== 'GET' && req.method !== 'HEAD'
        ? await req.text()
        : undefined,
      redirect: 'manual',
    });
    
    // Create the response with the same status and headers
    const responseData = await response.text();
    
    const headers = new Headers();
    response.headers.forEach((value, key) => {
      headers.set(key, value);
    });
    
    // Return the response
    return new NextResponse(responseData, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 