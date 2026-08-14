import IsbnDeals from '../pages/isbn-deals';
import ToolPageShell from '../design-system/ToolPageShell';

const V2IsbnDeals = () => {
    return (
        <ToolPageShell
            description = 'Jämför annonser med Bokbörsen och hitta felprissatta böcker.'
            title = 'ISBN-fyndkollen'
        >
            <IsbnDeals />
        </ToolPageShell>
    );
};

export default V2IsbnDeals;
