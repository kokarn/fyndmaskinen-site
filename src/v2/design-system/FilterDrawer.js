import PropTypes from 'prop-types';
import {
    useCallback,
    useState,
} from 'react';
import {
    Box,
    Button,
    Drawer,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

import FilterPanel from './FilterPanel';

const FilterDrawer = ({
    buttonSx,
    filterProps,
    fullWidth,
    label,
}) => {
    const [
        open, setOpen,
    ] = useState(false);
    const handleOpen = useCallback(() => {
        setOpen(true);
    }, []);
    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    return (
        <>
            <Button
                fullWidth = {fullWidth}
                onClick = {handleOpen}
                startIcon = {<FilterListIcon />}
                sx = {buttonSx}
                variant = 'outlined'
            >
                {label}
            </Button>
            <Drawer
                anchor = 'bottom'
                onClose = {handleClose}
                open = {open}
            >
                <Box
                    sx = {{
                        padding: 2,
                    }}
                >
                    <FilterPanel
                        {...filterProps}
                        onApply = {handleClose}
                    />
                </Box>
            </Drawer>
        </>
    );
};

FilterDrawer.defaultProps = {
    buttonSx: {},
    fullWidth: false,
    label: 'Filter',
};

FilterDrawer.propTypes = {
    buttonSx: PropTypes.shape({}),
    filterProps: PropTypes.shape({
        maxPrice: PropTypes.string.isRequired,
        onMaxPriceChange: PropTypes.func.isRequired,
        onReset: PropTypes.func.isRequired,
        onSortChange: PropTypes.func.isRequired,
        onSourceChange: PropTypes.func.isRequired,
        sort: PropTypes.string.isRequired,
        sources: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
        sourceState: PropTypes.shape({}).isRequired,
    }).isRequired,
    fullWidth: PropTypes.bool,
    label: PropTypes.string,
};

export default FilterDrawer;
