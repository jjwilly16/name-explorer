import PropTypes from 'prop-types';

export default function ResultCount({ resultCount, isLoading }) {
    return (
        <span>
            {isLoading && 'Loading...'}
            {!isLoading && `${resultCount} results`}
        </span>
    )
}

ResultCount.propTypes = {
    resultCount: PropTypes.number.isRequired,
    isLoading: PropTypes.bool.isRequired,
};
