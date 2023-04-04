import {
    useRef,
} from 'react';
import {
    Typography,
} from '@mui/material';
import {
    Link,
    useNavigate,
} from 'react-router-dom';
import Grid from '@mui/material/Unstable_Grid2';
import {
    Helmet,
} from 'react-helmet';

import SourcesGroup from '../../components/sources-group';
import SearchField from '../../components/search-field';

const numberOfPopularSearches = 3;

const popularSearches = [
    'lamino',
    'poul henningsen',
    'string',
    'bordslampa',
    'fotogenlampa',
    'höganäs',
    'ittala',
    'iphone',
];

const getRandomItemsFromArray = (array, count) => {
    const result = [];
    const arrayCopy = [...array];

    for (let i = 0; i < count; i = i + 1) {
        const randomIndex = Math.floor(Math.random() * arrayCopy.length);

        result.push(arrayCopy[ randomIndex ]);
        arrayCopy.splice(randomIndex, 1);
    }

    return result;
};

const Main = () => {
    const searchRef = useRef(null);
    const navigate = useNavigate();

    return [
        <Helmet
            key = 'helmet'
        >
            <title>
                {'Fyndmaskinen'}
            </title>
        </Helmet>,
        <form
            autoComplete = 'off'
            className = 'landing-page-search-form'
            key = 'search-form'
            noValidate
            onSubmit = {(event) => {
                event.preventDefault();
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    event: 'view_search_results',
                    value: searchRef.current.value,
                });
                navigate(`/search/${searchRef.current.value}`);
            }}
        >
            <Grid
                alignItems = 'center'
                container
                spacing = {4}
            >
                <Grid
                    md = {12}
                    xs = {12}
                >
                    <SearchField
                        searchRef = {searchRef}
                    />
                </Grid>
                <Grid
                    md = {2}
                    sx = {{
                        color: '#fff',
                        textShadow: '0 0 4px black',
                    }}
                    xs = {12}
                >
                    <Typography
                        variant = 'inherit'
                        variantMapping = {{
                            inherit: 'span',
                        }}
                    >
                        {'Populära sökningar: '}
                    </Typography>
                </Grid>
                {getRandomItemsFromArray(popularSearches, numberOfPopularSearches).map((search) => {
                    return (
                        <Grid
                            key = {`popular-search-${search}`}
                        >
                            <Link
                                // eslint-disable-next-line react/forbid-component-props
                                style = {{
                                    color: '#fff',
                                    textShadow: '0 0 4px black',
                                }}
                                to = {`/search/${search}`}
                            >
                                {search}
                            </Link>
                        </Grid>
                    );
                })}
                <SourcesGroup />
            </Grid>
        </form>,
    ];
};

export default Main;
