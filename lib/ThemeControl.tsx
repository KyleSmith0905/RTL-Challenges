// Local Code
import { getCookie } from '../lib/Helpers';

const ThemeControl = (): void => {
	const theme = getCookie('colorMode');
	if (theme !== 'dark') setColors(theme || 'dark');
};

const setColors = (colorMode: string): void => {
	if (typeof window !== 'object') return;
	switch (colorMode) {
		case 'light': {
			document.documentElement.style.setProperty('--color-background', 'hsl(226, 25%, 90%)');
			document.documentElement.style.setProperty('--color-primary', 'hsl(222, 30%, 80%)');
			document.documentElement.style.setProperty('--color-secondary', 'hsl(220, 35%, 70%)');
			document.documentElement.style.setProperty('--color-text', 'hsl(210, 75%, 20%)');
			document.documentElement.style.setProperty('--color-hyperlink-hover', 'hsl(225, 65%, 10%)');
			document.documentElement.style.setProperty('--color-outline', ' hsl(225, 100%, 50%)');
			document.documentElement.style.setProperty('--color-box-shadow', 'hsl(210, 25%, 60%)');
			break;
		}
		case 'dark': {
			document.documentElement.style.setProperty('--color-background', 'hsl(227, 18%, 10%)');
			document.documentElement.style.setProperty('--color-primary', 'hsl(226, 22%, 15%)');
			document.documentElement.style.setProperty('--color-secondary', 'hsl(220, 27%, 20%)');
			document.documentElement.style.setProperty('--color-text', 'hsl(210, 75%,72.5%)');
			document.documentElement.style.setProperty('--color-hyperlink-hover', 'hsl(210, 100%, 90%)');
			document.documentElement.style.setProperty('--color-outline', ' hsl(225, 65%, 50%)');
			document.documentElement.style.setProperty('--color-box-shadow', 'hsl(0, 0%, 0%)');
			break;
		}
	}
	setTimeout(() => { // This is a quick fix and should not be kept for long
		document.body.style.setProperty('transition-duration', '300ms');
	}, 3000);
};

export default ThemeControl;
export { setColors };