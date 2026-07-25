const getSourceChipStyle = (isActive) => {
    const stateStyle = isActive
        ? {
            backgroundColor: '#ffffff',
            border: '2px solid #087f88',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.22)',
            color: '#073c40',
            fontWeight: 700,
        }
        : {
            backgroundColor: '#e7ecef',
            border: '2px solid #66757d',
            boxShadow: 'none',
            color: '#263238',
            fontWeight: 500,
            opacity: 1,
        };

    return {
        borderRadius: '8px',
        minHeight: '40px',
        padding: '8px 2px',
        transition: 'background-color 150ms, border-color 150ms, box-shadow 150ms',
        ...stateStyle,
    };
};

export default getSourceChipStyle;
