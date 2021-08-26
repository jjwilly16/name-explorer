import PropTypes from 'prop-types';

export default function GenderControl({ tableParams, updateTableParams }) {
    return (
        <div className="form-group">
            <label>Gender</label>
            <select
                className="custom-select"
                value={tableParams.gender}
                onChange={e => updateTableParams({ gender: e.target.value, pageIndex: 0 })}
            >
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="U">Unisex</option>
            </select>
        </div>
    )
}

GenderControl.propTypes = {
    tableParams: PropTypes.shape({
        gender: PropTypes.string.isRequired,
    }).isRequired,
    updateTableParams: PropTypes.func.isRequired,
};
