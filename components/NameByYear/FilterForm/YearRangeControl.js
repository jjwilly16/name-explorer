import { useState } from 'react';
import PropTypes from 'prop-types';
import generateNumberRange from '../../../lib/util/generateNumberRange';

export default function YearRangeControl({ nameStats: { minYear, maxYear }, tableParams, updateTableParams }) {
    const [minYearOptions, setMinYearOptions] = useState(generateNumberRange(minYear, Math.min(maxYear, tableParams.maxYear)));
    const [maxYearOptions, setMaxYearOptions] = useState(generateNumberRange(Math.max(minYear, tableParams.minYear), maxYear));

    return (
        <div className="form-group">
            <label>Year Range</label>
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text">
                        From
                    </span>
                </div>
                <select
                    className="custom-select"
                    value={tableParams.minYear}
                    onChange={e => {
                        const newMinYear = Number(e.target.value);
                        updateTableParams({ minYear: newMinYear, pageIndex: 0 });
                        setMaxYearOptions(generateNumberRange(newMinYear, maxYear));
                    }}
                >
                    {minYearOptions.map(year => (
                        <option key={year}>
                            {year}
                        </option>
                    ))}
                </select>
                <div className="input-group-prepend">
                    <span className="input-group-text">
                        to
                    </span>
                </div>
                <select
                    className="custom-select"
                    value={tableParams.maxYear}
                    onChange={e => {
                        const newMaxYear = Number(e.target.value);
                        updateTableParams({ maxYear: newMaxYear, pageIndex: 0 });
                        setMinYearOptions(generateNumberRange(minYear, newMaxYear));
                    }}
                >
                    {maxYearOptions.map(year => (
                        <option key={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}

YearRangeControl.propTypes = {
    nameStats: PropTypes.shape({
        minYear: PropTypes.number.isRequired,
        maxYear: PropTypes.number.isRequired,
    }).isRequired,
    tableParams: PropTypes.shape({
        minYear: PropTypes.number.isRequired,
        maxYear: PropTypes.number.isRequired,
    }).isRequired,
    updateTableParams: PropTypes.func.isRequired,
};
