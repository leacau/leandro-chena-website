export const defaultSiteConfig = {
	logo: {
		url: '',
		alt: 'Leandro Chena',
	},
	heroImage:
		'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lea%20%282%29-ohqyC38OWMWc1aOOP7EHh8tm1PIUdd.png',
	colors: {
		primary: '#00905E',
		secondary: '#f3f4f6',
		accent: '#f3f4f6',
		text: '#111827',
		background: '#ffffff',
	},
	content: {
		hero: {
			title: 'Potenciá tus ventas y liderá con propósito',
			subtitle:
				'Soy Leandro Chena, consultor comercial y capacitador especializado en transformar equipos de ventas y desarrollar líderes que inspiran resultados extraordinarios.',
		},
		about: {
			title: 'Sobre Mí',
			content:
				'Con más de 15 años de experiencia en el mundo comercial, he ayudado a equipos a transformar su enfoque de ventas y liderazgo, logrando resultados extraordinarios.\n\nMi metodología combina estrategias probadas con un enfoque humano y sensible, adaptado a las necesidades específicas de cada organización y equipo.',
		},
		services: {
			title: 'Servicios',
			subtitle:
				'Soluciones personalizadas para potenciar tu negocio y equipo comercial',
		},
		cta: {
			title: '¿Listo para transformar tu enfoque comercial?',
			subtitle:
				'Descubrí cómo mis servicios de consultoría y capacitación pueden ayudarte a potenciar tus ventas y desarrollar líderes inspiradores.',
		},
	},
};

export function mergeSiteConfig(config = {}) {
	return {
		...defaultSiteConfig,
		...config,
		logo: { ...defaultSiteConfig.logo, ...(config.logo || {}) },
		colors: { ...defaultSiteConfig.colors, ...(config.colors || {}) },
		content: {
			...defaultSiteConfig.content,
			...(config.content || {}),
			hero: {
				...defaultSiteConfig.content.hero,
				...(config.content?.hero || {}),
			},
			about: {
				...defaultSiteConfig.content.about,
				...(config.content?.about || {}),
			},
			services: {
				...defaultSiteConfig.content.services,
				...(config.content?.services || {}),
			},
			cta: {
				...defaultSiteConfig.content.cta,
				...(config.content?.cta || {}),
			},
		},
	};
}

function hexToHslParts(hex) {
	if (typeof hex !== 'string') return null;

	const normalized = hex.trim().replace('#', '');
	const fullHex =
		normalized.length === 3
			? normalized
					.split('')
					.map((char) => char + char)
					.join('')
			: normalized;

	if (!/^[0-9a-fA-F]{6}$/.test(fullHex)) return null;

	const r = parseInt(fullHex.slice(0, 2), 16) / 255;
	const g = parseInt(fullHex.slice(2, 4), 16) / 255;
	const b = parseInt(fullHex.slice(4, 6), 16) / 255;
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h = 0;
	let s = 0;
	const l = (max + min) / 2;

	if (max !== min) {
		const delta = max - min;
		s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

		switch (max) {
			case r:
				h = (g - b) / delta + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / delta + 2;
				break;
			default:
				h = (r - g) / delta + 4;
		}

		h /= 6;
	}

	return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(
		l * 100
	)}%`;
}

function applyHexVar(root, name, hex) {
	const hsl = hexToHslParts(hex);
	if (hsl) root.style.setProperty(name, hsl);
}

export function applySiteColors(colors = {}) {
	if (typeof document === 'undefined') return;

	const root = document.documentElement;
	applyHexVar(root, '--primary', colors.primary);
	applyHexVar(root, '--ring', colors.primary);
	applyHexVar(root, '--secondary', colors.secondary);
	applyHexVar(root, '--background', colors.background);
	applyHexVar(root, '--foreground', colors.text);
}
