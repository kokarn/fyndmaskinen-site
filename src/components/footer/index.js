import {
    useState,
    useMemo,
} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
// import Link from '@mui/material/Link';

const StickyFooter = () => {
    const [
        totalItems, setTotalItems,
    ] = useState('?');

    const updateData = () => {
        fetch(
            `${ window.API_HOSTNAME }/graphql`,
            {
                body: JSON.stringify({
                    query: `{
                        getItemCount
                    }`,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
            }
        )
            .then((response) => {
                return response.json();
            })
            .then((response) => {
                setTotalItems(response.data.getItemCount);
            })
            .catch((fetchError) => {
                console.error(fetchError);
            });
    };

    useMemo(() => {
        updateData();
    }, []);

    return (
        <Box
            component = 'footer'
            sx = {{
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                flexShrink: 0,
                paddingBottom: '1em',
                paddingTop: '1em',
            }}
        >
            <Container
                maxWidth = 'sm'
            >
                <Typography
                    align = 'center'
                    color = 'inherit'
                    variant = 'body2'
                >
                    { `Fynda bland ${ totalItems > 0 ?
                        new Intl.NumberFormat('sv-SE').format(totalItems) :
                        '?'
                    } objekt` }
                </Typography>
            </Container>
        </Box>
    );
};

export default StickyFooter;
