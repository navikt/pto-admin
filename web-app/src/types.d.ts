declare module '*.css';
declare module '*.less';

interface ImportMeta {
	env: {
		DEV: boolean;
		MODE: 'development' | 'production';
		BASE_URL: string;
		PROD: boolean;
	};
}
