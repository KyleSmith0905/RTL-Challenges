// Framework
import { useEffect } from 'react';

interface Input {
  adUnit: string;
  adFormat?: string;
  adLayout?: string;
}

// OUT OF USE, until Adsense is online.

const AdBanner: React.FC<Input> = ({adUnit, adFormat, adLayout}: Input): JSX.Element => {
	useEffect(() => {
		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
		} catch (err) {
			null;
		}
	}, []);

	return (
		<ins
			className='adsbygoogle'
			style={{display: 'block'}}
			data-ad-client='ca-pub-4139671047695554'
			data-ad-slot={adUnit}
			data-ad-format={adFormat ?? 'auto'}
			data-full-width-responsive='true'
			data-ad-layout-key={adLayout ?? ''}
		/>
	);
};

export default AdBanner;