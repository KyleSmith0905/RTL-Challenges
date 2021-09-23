// Framework
import { useState } from 'react';
// Local Code
import Eye from '../Graphics/Eye';

interface Input {
  name: string;
  defaultValue: string;
  censored: boolean;
  value: [string, React.Dispatch<React.SetStateAction<string>>];
}

const InputField: React.FC<Input> = ({name, defaultValue, censored, value}: Input): JSX.Element => {
	const [eyeValue, setEyeValue] = useState(!censored);
	return (
		<div className='InputGroup'>
			<div className='TextAndIcon'>
				<p>{name}</p>
				<div style={{marginBottom: '0.6em'}}>
					<Eye active={eyeValue} onClick={() => setEyeValue(!eyeValue)} />
				</div>
			</div>
			<input
				type={eyeValue ? 'text' : 'password'}
				value={value[0]}
				autoFocus={name === 'Email'}
				maxLength={512}
				placeholder={censorText(!eyeValue, defaultValue)}
				onChange={(e) => value[1](e.target.value)}
			/>
		</div>
	);
};

const censorText = (active: boolean, text: string): string => {
	return active ? text.replaceAll(/./g, '•') : text;
};

export default InputField;