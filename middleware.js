import { NextResponse } from 'next/server';

export async function middleware(request) {
	const { pathname } = request.nextUrl;

	// Solo interceptar rutas que comiencen con /go/
	if (pathname.startsWith('/go/')) {
		// Dejar que la página maneje la redirección
		return NextResponse.next();
	}

	// Para todas las demás rutas, continuar normalmente
	return NextResponse.next();
}

export const config = {
	matcher: ['/go/:path*'],
};
