import { useState, useRef } from 'react';

const RightClickMenu = ({ options, x, y }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <button onClick={() => {
        console.log('')
        setIsOpen(!isOpen)}}>Open Menu</button>
      {isOpen && (
        <div
          ref={popupRef}
          style={{
            position: 'absolute',
            top: y + 'px',
            left: x + 'px',
            backgroundColor: 'white',
            border: '1px solid black',
            padding: '5px',
            zIndex: 1000,
          }}
        >
          {options.map((option, index) => (
            <div
              key={index}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                option.callback();
                setIsOpen(false);
              }}
            >
              {option.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RightClickMenu;