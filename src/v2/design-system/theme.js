import {
    alpha,
    createTheme,
} from '@mui/material/styles';

/* eslint-disable no-magic-numbers */

const colors = {
    accent: '#F05A3C',
    background: '#FAF7F0',
    border: '#C9D8D2',
    hero: '#E4EFE9',
    imagePlaceholder: '#E9E1D4',
    ink: '#123A33',
    muted: '#637872',
    paper: '#FFFFFF',
};

const sourceColors = {
    auction2000: '#8B6330',
    auctionet: '#CC1647',
    blocket: '#0071EB',
    bukowskis: '#302D2A',
    fallback: '#58716B',
    tradera: '#003B29',
    'uppsala-auktionskammare': '#7A263A',
};

// Quality-tier dots for the ISBN scan breakdown. Ordered best -> worst; the
// unknown tier uses the neutral border tone so it stays visually recessive.
const conditionColors = {
    acceptabelt: '#D9803B',
    'ej-angivet': '#C9D8D2',
    gott: '#E0A93B',
    'mycket-gott': '#4FB07E',
    nyskick: '#2E9E6B',
};

const borders = {
    strong: alpha(colors.ink, 0.12),
    subtle: alpha(colors.ink, 0.08),
};

const shadows = {
    card: `0 5px 18px ${alpha(colors.ink, 0.08)}`,
};

const density = {
    resultCard: {
        contentPadding: 1.5,
        imageHeight: {
            sm: 150,
            xs: 124,
        },
        titleMinHeight: 42,
    },
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
                    boxShadow: shadows.card,
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
        border: borders,
        primary: {
            contrastText: colors.paper,
            main: colors.accent,
        },
        secondary: {
            contrastText: colors.paper,
            main: colors.ink,
        },
        surface: {
            hero: colors.hero,
            image: colors.imagePlaceholder,
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
    borders,
    colors,
    conditionColors,
    density,
    shadows,
    sourceColors,
};
export default theme;
