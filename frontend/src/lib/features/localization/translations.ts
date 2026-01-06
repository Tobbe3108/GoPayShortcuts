/**
 * Type-safe translation object containing all UI strings for Danish and English.
 * Organized hierarchically by feature/domain for maintainability.
 */

export const translations = {
	da: {
		// Authentication feature
		auth: {
			email: 'Email adresse',
			emailPlaceholder: 'Indtast din email',
			emailLabel: 'Email',
			verificationCode: 'Verifikationskode',
			verificationPlaceholder: 'Indtast verifikationskode',
			verificationCodeLabel: 'Verifikationskode',
			continue: 'Fortsæt',
			login: 'Log ind',
			logout: 'Log ud',
			back: 'Tilbage',
			sending: 'Sender...',
			verifying: 'Verificerer...',
			invalidEmail: 'Venligst indtast en gyldig email adresse',
			emailRequired: 'Email er påkrævet',
			codeRequired: 'Verifikationskode er påkrævet',
			loginFailed: 'Login mislykkedes, prøv igen',
			loginSuccess: 'Du er logget ind',
		},

		// Orders feature
		orders: {
			title: 'Ordrer',
			orderNumber: 'Ordre nummer',
			date: 'Dato',
			total: 'I alt',
			status: 'Status',
			actions: 'Handlinger',
			view: 'Se detaljer',
			delete: 'Slet',
			edit: 'Rediger',
			create: 'Opret ordre',
			createdAt: 'Oprettet',
			updatedAt: 'Opdateret',
			noOrders: 'Ingen ordrer',
			empty: 'Der er ingen ordrer endnu',
			save: 'Gem ordre',
			cancel: 'Annuller',
			confirmDelete: 'Er du sikker på at du vil slette denne ordre?',
			deleteSuccess: 'Ordre blev slettet',
			savingOrder: 'Gemmer ordre...',
			loadingOrders: 'Indlæser ordrer...',
		},

		// Products feature
		products: {
			title: 'Produkter',
			productName: 'Produktnavn',
			price: 'Pris',
			quantity: 'Mængde',
			description: 'Beskrivelse',
			addProduct: 'Tilføj produkt',
			removeProduct: 'Fjern produkt',
			save: 'Gem',
			cancel: 'Annuller',
			noProducts: 'Ingen produkter',
			empty: 'Der er ingen produkter endnu',
		},

		// Locations feature
		locations: {
			title: 'Lokationer',
			name: 'Navn',
			address: 'Adresse',
			city: 'By',
			zipCode: 'Postnummer',
			phone: 'Telefon',
			addLocation: 'Tilføj lokation',
			editLocation: 'Rediger lokation',
			deleteLocation: 'Slet lokation',
			save: 'Gem',
			cancel: 'Annuller',
			noLocations: 'Ingen lokationer',
			empty: 'Der er ingen lokationer endnu',
		},

		// Menu feature
		menu: {
			home: 'Forside',
			orders: 'Ordrer',
			products: 'Produkter',
			locations: 'Lokationer',
			settings: 'Indstillinger',
			profile: 'Profil',
			help: 'Hjælp',
			aboutUs: 'Om os',
		},

		// Common UI elements
		common: {
			loading: 'Indlæser...',
			error: 'Der opstod en fejl',
			success: 'Succes',
			warning: 'Advarsel',
			info: 'Information',
			yes: 'Ja',
			no: 'Nej',
			ok: 'OK',
			close: 'Luk',
			confirm: 'Bekræft',
			cancel: 'Annuller',
			save: 'Gem',
			delete: 'Slet',
			edit: 'Rediger',
			add: 'Tilføj',
			remove: 'Fjern',
			search: 'Søg',
			filter: 'Filtrer',
			sort: 'Sorter',
			export: 'Eksporter',
			import: 'Importer',
			refresh: 'Opdater',
			back: 'Tilbage',
			next: 'Næste',
			previous: 'Forrige',
			of: 'af',
			empty: 'Tom',
			notFound: 'Ikke fundet',
			tryAgain: 'Prøv igen',
			loading404: 'Side ikke fundet',
			loading500: 'Serverfejl',
			noResults: 'Ingen resultater',
			noData: 'Ingen data',
		},

		// Date and time formats (used with formatDate)
		dateTime: {
			formatDate: 'dd. MMM yyyy',
			formatDateTime: 'dd. MMM yyyy HH:mm',
			formatTime: 'HH:mm',
			today: 'I dag',
			yesterday: 'I går',
			tomorrow: 'I morgen',
			thisWeek: 'Denne uge',
			lastWeek: 'Sidste uge',
			thisMonth: 'Denne måned',
			lastMonth: 'Sidste måned',
		},

		// Validation messages
		validation: {
			required: 'Dette felt er påkrævet',
			email: 'Venligst indtast en gyldig email adresse',
			minLength: 'Skal være mindst {0} tegn',
			maxLength: 'Kan være maksimalt {0} tegn',
			pattern: 'Ugyldigt format',
			number: 'Skal være et tal',
			positive: 'Skal være et positivt tal',
			url: 'Skal være en gyldig URL',
			phone: 'Skal være et gyldigt telefonnummer',
		},
	},

	en: {
		// Authentication feature
		auth: {
			email: 'Email address',
			emailPlaceholder: 'Enter your email',
			emailLabel: 'Email',
			verificationCode: 'Verification code',
			verificationPlaceholder: 'Enter verification code',
			verificationCodeLabel: 'Verification code',
			continue: 'Continue',
			login: 'Sign in',
			logout: 'Sign out',
			back: 'Back',
			sending: 'Sending...',
			verifying: 'Verifying...',
			invalidEmail: 'Please enter a valid email address',
			emailRequired: 'Email is required',
			codeRequired: 'Verification code is required',
			loginFailed: 'Login failed, please try again',
			loginSuccess: 'You are signed in',
		},

		// Orders feature
		orders: {
			title: 'Orders',
			orderNumber: 'Order number',
			date: 'Date',
			total: 'Total',
			status: 'Status',
			actions: 'Actions',
			view: 'View details',
			delete: 'Delete',
			edit: 'Edit',
			create: 'Create order',
			createdAt: 'Created',
			updatedAt: 'Updated',
			noOrders: 'No orders',
			empty: 'No orders yet',
			save: 'Save order',
			cancel: 'Cancel',
			confirmDelete: 'Are you sure you want to delete this order?',
			deleteSuccess: 'Order was deleted',
			savingOrder: 'Saving order...',
			loadingOrders: 'Loading orders...',
		},

		// Products feature
		products: {
			title: 'Products',
			productName: 'Product name',
			price: 'Price',
			quantity: 'Quantity',
			description: 'Description',
			addProduct: 'Add product',
			removeProduct: 'Remove product',
			save: 'Save',
			cancel: 'Cancel',
			noProducts: 'No products',
			empty: 'No products yet',
		},

		// Locations feature
		locations: {
			title: 'Locations',
			name: 'Name',
			address: 'Address',
			city: 'City',
			zipCode: 'Zip code',
			phone: 'Phone',
			addLocation: 'Add location',
			editLocation: 'Edit location',
			deleteLocation: 'Delete location',
			save: 'Save',
			cancel: 'Cancel',
			noLocations: 'No locations',
			empty: 'No locations yet',
		},

		// Menu feature
		menu: {
			home: 'Home',
			orders: 'Orders',
			products: 'Products',
			locations: 'Locations',
			settings: 'Settings',
			profile: 'Profile',
			help: 'Help',
			aboutUs: 'About us',
		},

		// Common UI elements
		common: {
			loading: 'Loading...',
			error: 'An error occurred',
			success: 'Success',
			warning: 'Warning',
			info: 'Information',
			yes: 'Yes',
			no: 'No',
			ok: 'OK',
			close: 'Close',
			confirm: 'Confirm',
			cancel: 'Cancel',
			save: 'Save',
			delete: 'Delete',
			edit: 'Edit',
			add: 'Add',
			remove: 'Remove',
			search: 'Search',
			filter: 'Filter',
			sort: 'Sort',
			export: 'Export',
			import: 'Import',
			refresh: 'Refresh',
			back: 'Back',
			next: 'Next',
			previous: 'Previous',
			of: 'of',
			empty: 'Empty',
			notFound: 'Not found',
			tryAgain: 'Try again',
			loading404: 'Page not found',
			loading500: 'Server error',
			noResults: 'No results',
			noData: 'No data',
		},

		// Date and time formats (used with formatDate)
		dateTime: {
			formatDate: 'MMM dd, yyyy',
			formatDateTime: 'MMM dd, yyyy HH:mm',
			formatTime: 'HH:mm',
			today: 'Today',
			yesterday: 'Yesterday',
			tomorrow: 'Tomorrow',
			thisWeek: 'This week',
			lastWeek: 'Last week',
			thisMonth: 'This month',
			lastMonth: 'Last month',
		},

		// Validation messages
		validation: {
			required: 'This field is required',
			email: 'Please enter a valid email address',
			minLength: 'Must be at least {0} characters',
			maxLength: 'Can be at most {0} characters',
			pattern: 'Invalid format',
			number: 'Must be a number',
			positive: 'Must be a positive number',
			url: 'Must be a valid URL',
			phone: 'Must be a valid phone number',
		},
	},
} as const;

/**
 * Type-safe language type derived from translations object
 */
export type Language = keyof typeof translations;

/**
 * Type-safe translation key type - nested keyof structure
 */
export type TranslationKey = {
	[L in Language]: {
		[K in keyof (typeof translations)[L]]: {
			[SK in keyof (typeof translations)[L][K]]: unknown;
		};
	};
}[Language];
