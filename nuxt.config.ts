export default defineNuxtConfig({
	telemetry: false,
	ssr: true,

	css: ['~/assets/css/main.css'],

	runtimeConfig: {
		public: {
			directusUrl: process.env.DIRECTUS_URL as string,
			tvUrl: process.env.DIRECTUS_TV_URL as string,
			baseUrl: process.env.NUXT_PUBLIC_SITE_URL as string,
			gtm: {
				id: process.env.GOOGLE_TAG_MANAGER_ID!,
				defer: true,
			},
		},
	},

	site: {
		url: 'https://directus.io',
	},

	app: {
		head: {
			link: [
				{
					rel: 'alternate',
					type: 'application/atom+xml',
					title: 'Directus RSS Feed',
					href: '/rss.xml',
				},
			],
		},
	},

	typescript: {
		typeCheck: true,
	},

	experimental: {
		sharedPrerenderData: true,
	},

	nitro: {
		prerender: {
			crawlLinks: false,
			concurrency: 3,
		},
	},

	routeRules: {
		// Posthog proxy to get around adblockers
		'/ingest/static/**': { proxy: 'https://us-assets.i.posthog.com/static/**' },
		'/ingest/**': { proxy: 'https://us.i.posthog.com/**' },
	},

	modules: [
		'@vueuse/nuxt',
		'@nuxt/image',
		'@nuxtjs/sitemap', // https://sitemap.nuxtjs.org/usage/sitemap
		'nuxt-og-image',
		'floating-vue/nuxt',
		'@zadigetvoltaire/nuxt-gtm',
		'nuxt-schema-org',
		'@nuxtjs/fontaine',
		'@formkit/auto-animate/nuxt',
	],

	// OG Image Configuration - https://nuxtseo.com/og-image/getting-started/installation
	ogImage: {
		defaults: {
			component: 'OgImageDefault',
			width: 1200,
			height: 630,
		},
		fonts: ['Inter:400', 'Inter:700', 'Poppins:400', 'Poppins:600', 'Poppins:700'],
	},

	// Posthog configuration
	posthog: {
		capturePageViews: true,
	},

	// Nuxt Image Configuration - https://image.nuxt.com/get-started/installation
	image: {
		providers: {
			directus: {
				provider: 'directus',
				options: {
					baseURL: `${process.env.DIRECTUS_URL}/assets/`,
				},
			},
			directusTv: {
				provider: 'directus',
				options: {
					baseURL: `${process.env.DIRECTUS_TV_URL}/assets/`,
				},
			},
		},
	},

	// This is some jank to exit the nuxt build because the build hangs at the very end when using nuxt generate 🤦‍♂️
	// @see https://github.com/nuxt/cli/issues/169#issuecomment-1729300497
	// Workaround for https://github.com/nuxt/cli/issues/169
	hooks: {
		close: () => {
			process.exit();
		},
	},

	vue: {
		compilerOptions: {
			isCustomElement: (tag) => tag === 'iconify-icon',
		},
	},
});
