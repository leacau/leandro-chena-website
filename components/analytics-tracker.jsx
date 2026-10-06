'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { captureUrlParams, trackEvent } from '@/lib/tracking';

export default function AnalyticsTracker() {
	const pathname = usePathname();
	const scrollTriggeredRef = useRef(false);

	// Capturar UTMs y registrar vista de página
	useEffect(() => {
		const attribution = captureUrlParams();
		trackEvent('landing_view', {
			page_path: pathname,
			page_title: typeof document !== 'undefined' ? document.title : '',
			...attribution,
		});
		scrollTriggeredRef.current = false;
	}, [pathname]);

	// Medir evento scroll_50 (50% de scroll de la página)
	useEffect(() => {
		const handleScroll = () => {
			if (scrollTriggeredRef.current) return;

			const docHeight = document.documentElement.scrollHeight - window.innerHeight;
			if (docHeight <= 0) return;

			const scrollPercentage = (window.scrollY / docHeight) * 100;
			if (scrollPercentage >= 50) {
				scrollTriggeredRef.current = true;
				trackEvent('scroll_50', {
					page_path: pathname,
				});
			}
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, [pathname]);

	return null;
}
