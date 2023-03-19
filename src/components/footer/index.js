import {
    useState,
    useMemo,
} from 'react';
import {
    Box,
    Typography,
    Container,
    Skeleton,
} from '@mui/material';

// import Link from '@mui/material/Link';

const StickyFooter = () => {
    const [
        totalItems, setTotalItems,
    ] = useState(0);

    const updateData = () => {
        try {
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
                });
        } catch (error) {
            console.error(error);
        }
        // .catch((fetchError) => {
        //     console.error(fetchError);
        // });
    };

    useMemo(() => {
        updateData();
    }, []);

    return (
        <Box
            component = 'footer'
            sx = {{
                backgroundColor: '#26828B',
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
                    sx = {{
                        color: '#fff',
                        
                        fontFamily: 'Urbanis',
                        fontSize: 18,
                        fontWeight: 500,
                    }}
                    variant = 'body1'
                >
                    { 'Fynda bland '}
                    { totalItems > 0 && (
                        new Intl.NumberFormat('sv-SE').format(totalItems)
                    )}
                    {!totalItems && (
                        <Skeleton
                            sx = {{
                                display: 'inline-block',
                                fontSize: '1rem',
                            }}
                            width = {60}
                        />
                    )}
                    {' objekt'}
                </Typography>
            </Container>
        </Box>
    );
};

export default StickyFooter;
