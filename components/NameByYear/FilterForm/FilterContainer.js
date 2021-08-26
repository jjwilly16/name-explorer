import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GenderControl from './GenderControl';
import YearRangeControl from './YearRangeControl';
import CharacterLimitControl from './CharacterLimitControl';
import OccurrenceRangeControl from './OccurrenceRangeControl';
import StringSearchControl from './StringSearchControl';
import generateNumberRange from '../../../lib/util/generateNumberRange';

export default function FilterContainer({ nameStats, tableParams, updateTableParams, resetFilters }) {
    return (
        <div className="card bg-light text-dark mb-3">
            <h4 className="card-header">
                Filters
            </h4>

            <div className="card-body">

                <div className="row">

                    {/* Gender */}
                    <div className="col-md-4">
                        <GenderControl
                            tableParams={tableParams}
                            updateTableParams={updateTableParams}
                        />
                    </div>

                    {/* Year Range */}
                    <div className="col-md-8">
                        <YearRangeControl
                            nameStats={nameStats}
                            tableParams={tableParams}
                            updateTableParams={updateTableParams}
                            generateNumberRange={generateNumberRange}
                        />
                    </div>
                </div>

                <div className="row">

                    {/* Character Limits */}
                    <div className="col-md-6">
                        <CharacterLimitControl
                            nameStats={nameStats}
                            tableParams={tableParams}
                            updateTableParams={updateTableParams}
                            generateNumberRange={generateNumberRange}
                        />
                    </div>

                    {/* # of Occurrences */}
                    <div className="col-md-6">
                        <OccurrenceRangeControl
                            tableParams={tableParams}
                            updateTableParams={updateTableParams}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col">

                        {/* String search */}
                        <StringSearchControl
                            tableParams={tableParams}
                            updateTableParams={updateTableParams}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <div className="form-group">
                            <button
                                type="reset"
                                className="btn btn-danger"
                                onClick={() => resetFilters()}
                            >
                                <FontAwesomeIcon icon={['fas', 'redo']} className="fa-fw" />
                                {' '}
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

FilterContainer.propTypes = {
    nameStats: PropTypes.object.isRequired,
    tableParams: PropTypes.object.isRequired,
    updateTableParams: PropTypes.func.isRequired,
    resetFilters: PropTypes.func.isRequired,
};
