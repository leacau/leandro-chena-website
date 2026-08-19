export default function robots() {
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://leandrochena.com';

	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: ['/admin/', '/descargar/'],
		},
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}
