import PropTypes from 'prop-types';

export default function OccurrenceRangeControl({ tableParams, updateTableParams }) {
    return (
        <div className="form-group">
            <label># Of Occurrences</label>
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text">
                        Between
                    </span>
                </div>
                <input
                    type="number"
                    className="form-control"
                    value={tableParams.minOccurrences}
                    step="100"
                    onInput={({ target }) =>
                        updateTableParams({ minOccurrences: target.value ? Number(target.value) : '', pageIndex: 0 })
                    }
                />
                <div className="input-group-prepend">
                    <span className="input-group-text">
                        and
                    </span>
                </div>
                <input
                    type="number"
                    className="form-control"
                    value={tableParams.maxOccurrences}
                    step="100"
                    onInput={({ target }) =>
                        updateTableParams({ maxOccurrences: target.value ? Number(target.value) : '', pageIndex: 0 })
                    }
                />
            </div>
        </div>
    )
}

OccurrenceRangeControl.propTypes = {
    tableParams: PropTypes.shape({
        minOccurrences: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        maxOccurrences: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }).isRequired,
    updateTableParams: PropTypes.func.isRequired,
};
