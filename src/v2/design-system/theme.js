import {
    createTheme,
} from '@mui/material/styles';

const colors = {
    accent: '#F05A3C',
    background: '#FAF7F0',
    border: '#C9D8D2',
    hero: '#E4EFE9',
    ink: '#123A33',
    muted: '#637872',
    paper: '#FFFFFF',
};

const theme = createTheme({
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    fontWeight: 800,
                    minHeight: 48,
                    textTransform: 'none',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 5px 18px rgba(18, 58, 51, 0.08)',
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    backgroundColor: colors.paper,
                    borderRadius: 12,
                },
            },
        },
    },
    palette: {
        background: {
            default: colors.background,
            paper: colors.paper,
        },
        primary: {
            contrastText: '#FFFFFF',
            main: colors.accent,
        },
        secondary: {
            contrastText: '#FFFFFF',
            main: colors.ink,
        },
        text: {
            primary: colors.ink,
            secondary: colors.muted,
        },
    },
    shape: {
        borderRadius: 12,
    },
    typography: {
        fontFamily: [
            'Inter',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: {
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.08,
        },
        h2: {
            fontSize: 'clamp(1.45rem, 3vw, 2rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
        },
    },
});

export {
    colors,
};
export default theme;
