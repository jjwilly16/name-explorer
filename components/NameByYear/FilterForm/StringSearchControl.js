import PropTypes from 'prop-types';

export default function StringSearchControl({ tableParams: { startsWith, contains, endsWith }, updateTableParams }) {
    return (
        <div className="form-group">
            <label>Name Search</label>
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text">
                        Starts with
                    </span>
                </div>
                <input
                    type="text"
                    className="form-control"
                    value={startsWith}
                    onInput={({ target }) => updateTableParams({ startsWith: target.value || '', pageIndex: 0 })}
                />
                <div className="input-group-prepend">
                    <span className="input-group-text">
                        Contains
                    </span>
                </div>
                <input
                    type="text"
                    className="form-control"
                    value={contains}
                    onInput={({ target }) => updateTableParams({ contains: target.value || '', pageIndex: 0 })}
                />
                <div className="input-group-prepend">
                    <span className="input-group-text">
                        Ends with
                    </span>
                </div>
                <input
                    type="text"
                    className="form-control"
                    value={endsWith}
                    onInput={({ target }) => updateTableParams({ endsWith: target.value || '', pageIndex: 0 })}
                />
            </div>
        </div>
    )
}

StringSearchControl.propTypes = {
    tableParams: PropTypes.shape({
        startsWith: PropTypes.string.isRequired,
        endsWith: PropTypes.string.isRequired,
        contains: PropTypes.string.isRequired,
    }).isRequired,
    updateTableParams: PropTypes.func.isRequired,
};
