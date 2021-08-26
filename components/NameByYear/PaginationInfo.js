import PropTypes from 'prop-types';

export default function TableInfo({ pageIndex, pageCount, isLoading }) {
    return (
        <span>
            {isLoading && 'Loading...'}
            {!isLoading && `Page ${pageIndex + 1} of ${pageCount}`}
        </span>
    )
}

TableInfo.propTypes = {
    pageIndex: PropTypes.number.isRequired,
    pageCount: PropTypes.number.isRequired,
    isLoading: PropTypes.bool.isRequired,
};
