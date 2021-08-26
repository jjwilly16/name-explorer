import PropTypes from 'prop-types';

export default function LengthMenu({ pageSizeOptions, pageSize, setPageSize }) {
    return (
        <span>
            Show{' '}
            <select
                className="custom-select d-inline w-auto"
                onChange={e => setPageSize(Number(e.target.value))}
                defaultValue={pageSize}
            >
                {pageSizeOptions.map(len => (
                    <option key={len}>
                        {len}
                    </option>
                ))}
            </select>
        </span>
    )
}

LengthMenu.propTypes = {
    pageSizeOptions: PropTypes.arrayOf(PropTypes.number).isRequired,
    pageSize: PropTypes.number.isRequired,
    setPageSize: PropTypes.func.isRequired,
};
