'use client';

import { useState } from 'react';
import { useAutocomplete } from '@szhsin/react-autocomplete';

const US_STATES = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming'
];

export default function Home() {
  const [items] = useState(US_STATES);
  const [input, setInput] = useState('');
  const [isOpen, setOpen] = useState(false);
  const { inputProps, focusIndex } = useAutocomplete({
    input,
    onInputChange: setInput,
    isOpen,
    onOpenChange: setOpen,
    items
  });
  return (
    <div>
      <div>{input}</div>
      <button onClick={() => setInput('hey')}>Reset</button>
      <input type="text" {...inputProps} />
      <ul style={{ position: 'absolute', display: isOpen ? 'block' : 'none' }}>
        {items.map((item, index) => (
          <li key={item} style={{ background: focusIndex === index ? '#ccc' : 'none' }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
