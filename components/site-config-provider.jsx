'use client';

import { applySiteColors, mergeSiteConfig } from '@/lib/site-config';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect } from 'react';

import { db } from '@/lib/firebase';

export default function SiteConfigProvider({ children }) {
	useEffect(() => {
		let isMounted = true;

		const loadConfig = async () => {
			let config = null;

			try {
				const savedConfig = localStorage.getItem('siteConfig');
				if (savedConfig) {
					config = JSON.parse(savedConfig);
					applySiteColors(mergeSiteConfig(config).colors);
				}
			} catch (error) {
				console.error('Error al cargar configuración local:', error);
			}

			try {
				const docSnap = await getDoc(doc(db, 'config', 'siteConfig'));
				if (!isMounted || !docSnap.exists()) return;

				config = mergeSiteConfig(docSnap.data());
				localStorage.setItem('siteConfig', JSON.stringify(config));
				applySiteColors(config.colors);
			} catch (error) {
				console.error('Error al cargar configuración del sitio:', error);
			}
		};

		const handleConfigUpdate = () => {
			try {
				const savedConfig = localStorage.getItem('siteConfig');
				if (savedConfig) {
					applySiteColors(mergeSiteConfig(JSON.parse(savedConfig)).colors);
				}
			} catch (error) {
				console.error('Error al aplicar configuración actualizada:', error);
			}
		};

		loadConfig();
		window.addEventListener('siteConfigUpdated', handleConfigUpdate);

		return () => {
			isMounted = false;
			window.removeEventListener('siteConfigUpdated', handleConfigUpdate);
		};
	}, []);

	return children;
}
