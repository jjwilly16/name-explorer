import { useState } from 'react';
import PropTypes from 'prop-types';
import generateNumberRange from '../../../lib/util/generateNumberRange';

export default function CharacterLimitControl({ nameStats, tableParams, updateTableParams }) {
    const { minLength, maxLength } = nameStats;
    const [minLengthOptions, setMinLengthOptions] = useState(generateNumberRange(minLength, Math.min(maxLength, tableParams.maxLength)));
    const [maxLengthOptions, setMaxLengthOptions] = useState(generateNumberRange(Math.max(minLength, tableParams.minLength), maxLength));

    return (
        <div className="form-group">
            <label>Character Length</label>
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text">
                        Between
                    </span>
                </div>
                <select
                    className="custom-select"
                    value={tableParams.minLength}
                    onChange={e => {
                        const newMinLength = Number(e.target.value);
                        updateTableParams({ minLength: newMinLength, pageIndex: 0 });
                        setMaxLengthOptions(generateNumberRange(newMinLength, maxLength));
                    }}
                >
                    {minLengthOptions.map(len => (
                        <option key={len}>
                            {len}
                        </option>
                    ))}
                </select>
                <div className="input-group-prepend">
                    <span className="input-group-text">
                        and
                    </span>
                </div>
                <select
                    className="custom-select"
                    value={tableParams.maxLength}
                    onChange={e => {
                        const newMaxLength = Number(e.target.value);
                        updateTableParams({ maxLength: newMaxLength, pageIndex: 0 });
                        setMinLengthOptions(generateNumberRange(minLength, newMaxLength));
                    }}
                >
                    {maxLengthOptions.map(len => (
                        <option key={len}>
                            {len}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}

CharacterLimitControl.propTypes = {
    nameStats: PropTypes.shape({
        minLength: PropTypes.number.isRequired,
        maxLength: PropTypes.number.isRequired,
    }).isRequired,
    tableParams: PropTypes.shape({
        minLength: PropTypes.number.isRequired,
        maxLength: PropTypes.number.isRequired,
    }).isRequired,
    updateTableParams: PropTypes.func.isRequired,
};
