import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Pagination({ pageCount, pageIndex, setPage }) {
    const firstDisabled = pageIndex === 0;
    const lastDisabled = pageIndex >= (pageCount - 1);

    return (
        <nav aria-label="Table Navigation">
            <ul className="pagination mb-0">
                <li className={`page-item${firstDisabled ? ' disabled' : ''}`}>
                    <a
                        className="page-link"
                        href="#"
                        onClick={e => {
                            e.preventDefault();
                            setPage(0);
                        }}
                        disabled={firstDisabled}
                        aria-disabled={firstDisabled}
                        tabIndex={firstDisabled ? '-1' : '1'}
                        aria-label="First Page"
                    >
                        <FontAwesomeIcon icon={['fas', 'angle-double-left']} className="fa-fw" />
                    </a>
                </li>
                <li className={`page-item${firstDisabled ? ' disabled' : ''}`}>
                    <a
                        className="page-link"
                        href="#"
                        onClick={e => {
                            e.preventDefault();
                            setPage(pageIndex - 1);
                        }}
                        disabled={firstDisabled}
                        aria-disabled={firstDisabled}
                        tabIndex={firstDisabled ? '-1' : '2'}
                        aria-label="Previous Page"
                    >
                        <FontAwesomeIcon icon={['fas', 'angle-left']} className="fa-fw" />
                    </a>
                </li>
                <li className={`page-item${lastDisabled ? ' disabled' : ''}`}>
                    <a
                        className="page-link"
                        href="#"
                        onClick={e => {
                            e.preventDefault();
                            setPage(pageIndex + 1);
                        }}
                        disabled={lastDisabled}
                        aria-disabled={lastDisabled}
                        tabIndex={lastDisabled ? '-1' : '3'}
                        aria-label="Next Page"
                    >
                        <FontAwesomeIcon icon={['fas', 'angle-right']} className="fa-fw" />
                    </a>
                </li>
                <li className={`page-item${lastDisabled ? ' disabled' : ''}`}>
                    <a
                        className="page-link"
                        href="#"
                        onClick={e => {
                            e.preventDefault();
                            setPage(pageCount - 1);
                        }}
                        disabled={lastDisabled}
                        aria-disabled={lastDisabled}
                        tabIndex={lastDisabled ? '-1' : '4'}
                        aria-label="Last Page"
                    >
                        <FontAwesomeIcon icon={['fas', 'angle-double-right']} className="fa-fw" />
                    </a>
                </li>
            </ul>
        </nav>
    );
}

Pagination.propTypes = {
    pageCount: PropTypes.number.isRequired,
    pageIndex: PropTypes.number.isRequired,
    setPage: PropTypes.func.isRequired,
};
