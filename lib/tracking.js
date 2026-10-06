'use client';

/**
 * Normaliza y hashea un string usando SHA-256 en el navegador (Web Crypto API)
 */
export async function sha256(text) {
	if (!text) return '';
	const cleanText = text.trim().toLowerCase();
	try {
		const msgBuffer = new TextEncoder().encode(cleanText);
		const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
	} catch (e) {
		console.warn('Crypto API SHA-256 no disponible:', e);
		return '';
	}
}

/**
 * Normaliza número de teléfono al formato internacional (ej: +5493424790708)
 */
export function normalizePhone(rawPhone) {
	if (!rawPhone) return '';
	let clean = rawPhone.replace(/[^\d+]/g, '');
	if (!clean.startsWith('+')) {
		if (clean.startsWith('54')) {
			clean = '+' + clean;
		} else {
			clean = '+54' + clean;
		}
	}
	return clean;
}

/**
 * Almacena y recupera parámetros de campaña (UTMs, gclid, fbclid, etc.)
 */
const TRACKING_STORAGE_KEY = 'lc_attribution_params';

export function captureUrlParams() {
	if (typeof window === 'undefined') return {};

	try {
		const searchParams = new URLSearchParams(window.location.search);
		const existing = getStoredAttribution();

		const paramsToTrack = [
			'utm_source',
			'utm_medium',
			'utm_campaign',
			'utm_content',
			'utm_term',
			'gclid',
			'wbraid',
			'gbraid',
			'fbclid',
		];

		const captured = { ...existing };
		let hasNew = false;

		paramsToTrack.forEach((key) => {
			const val = searchParams.get(key);
			if (val) {
				captured[key] = val;
				hasNew = true;
			}
		});

		if (window.location.pathname && !captured.first_landing_page) {
			captured.first_landing_page = window.location.pathname;
			hasNew = true;
		}

		if (document.referrer && !captured.referrer) {
			captured.referrer = document.referrer;
			hasNew = true;
		}

		if (hasNew) {
			sessionStorage.setItem(TRACKING_STORAGE_KEY, JSON.stringify(captured));
		}

		return captured;
	} catch (e) {
		console.warn('Error capturando parámetros de atribución:', e);
		return {};
	}
}

export function getStoredAttribution() {
	if (typeof window === 'undefined') return {};
	try {
		const raw = sessionStorage.getItem(TRACKING_STORAGE_KEY);
		return raw ? JSON.parse(raw) : {};
	} catch {
		return {};
	}
}

/**
 * Obtiene cookies de Meta (_fbp, _fbc)
 */
export function getMetaCookies() {
	if (typeof document === 'undefined') return {};
	const cookies = document.cookie.split(';').reduce((acc, cookie) => {
		const [name, val] = cookie.trim().split('=');
		acc[name] = val;
		return acc;
	}, {});

	return {
		fbp: cookies['_fbp'] || '',
		fbc: cookies['_fbc'] || '',
	};
}

/**
 * Disparador unificado de eventos a DataLayer (Google Tag Manager / GA4 / Ads)
 */
export function trackEvent(eventName, eventParams = {}) {
	if (typeof window === 'undefined') return;

	try {
		window.dataLayer = window.dataLayer || [];
		window.dataLayer.push({
			event: eventName,
			...eventParams,
			timestamp: new Date().toISOString(),
		});
	} catch (e) {
		console.warn('Error disparando evento al dataLayer:', eventName, e);
	}
}
