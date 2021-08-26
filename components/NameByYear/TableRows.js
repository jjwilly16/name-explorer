import PropTypes from 'prop-types';
import Spinner from '../Spinner';

export default function TableRows({ data, columns, isLoading, tableBodyHeight }) {
    if (isLoading) {
        return (
            <tr>
                <td colSpan={columns.length} style={{ height: tableBodyHeight, textAlign: 'center' }} className="position-relative">
                    <Spinner />
                </td>
            </tr>
        );
    }
    if (data.length) {
        return (
            data.map(row => (
                <tr key={row.name}>
                    {columns.map(column => (
                        <td key={`row-${column.id}`} style={{ textAlign: 'center' }}>
                            {row[column.id]}
                        </td>
                    ))}
                </tr>
            ))
        );
    }
    return (
        <tr>
            <td colSpan={columns.length} className="py-5" style={{ textAlign: 'center' }}>
                No Results
            </td>
        </tr>
    );
}

TableRows.propTypes = {
    data: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    tableBodyHeight: PropTypes.number.isRequired,
};
