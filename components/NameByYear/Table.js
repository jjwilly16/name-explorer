import { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Pagination from './Pagination';
import PaginationInfo from './PaginationInfo';
import LengthMenu from './LengthMenu';
import ResultCount from './ResultCount';
import TableRows from './TableRows';

export default function Table({ columns, data, isLoading, tableParams, pageCount, totalResults, updateTableParams }) {
    const [tableBodyHeight, setTableBodyHeight] = useState(100);
    const tableBodyRef = useRef(null);

    const updateTableBodyHeight = height => setTableBodyHeight(height);
    const refreshTable = params => {
        updateTableBodyHeight(tableBodyRef.current.offsetHeight);
        updateTableParams(params);
    };
    const handleThClick = ({ orderBy }) => {
        const { sortOrder } = tableParams;
        refreshTable({
            orderBy,
            sortOrder: sortOrder === 'ASC' ? 'DESC' : 'ASC',
        });
    };

    // Keeping track of the tbody height - this is used to preserve the height when paging (looks better)
    useEffect(() => {
        if (tableBodyRef.current) {
            updateTableBodyHeight(tableBodyRef.current.offsetHeight);
        }
    }, [tableBodyRef]);

    return (
        <div className="table-responsive pb-3">
            <ResultCount resultCount={totalResults} isLoading={isLoading} />

            <table className="table table-bordered table-sm">
                <thead className="thead-light">
                    <tr>
                        {columns.map(column => (
                            <th
                                key={`column-${column.id}`}
                                style={{ width: `${100 / columns.length}%`, cursor: 'pointer', textAlign: 'center' }}
                                onClick={() => handleThClick({ orderBy: column.id })}
                            >
                                {column.title}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody ref={tableBodyRef}>
                    <TableRows
                        data={data}
                        columns={columns}
                        isLoading={isLoading}
                        tableBodyHeight={tableBodyHeight}
                    />
                </tbody>
            </table>

            <div className="d-flex align-items-center justify-content-between">
                <LengthMenu
                    pageSizeOptions={[10, 25, 50, 100]}
                    pageSize={tableParams.pageSize}
                    setPageSize={pageSize => refreshTable({ pageSize})}
                />
                <Pagination
                    pageCount={pageCount}
                    pageIndex={tableParams.pageIndex}
                    setPage={pageIndex => refreshTable({ pageIndex })}
                />
                <PaginationInfo
                    pageIndex={tableParams.pageIndex}
                    pageCount={pageCount}
                    isLoading={isLoading}
                />
            </div>
        </div>
    )
}

Table.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
    })).isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    isLoading: PropTypes.bool.isRequired,
    tableParams: PropTypes.shape({
        gender: PropTypes.oneOf(['M', 'F', 'U']).isRequired,
        minLength: PropTypes.number.isRequired,
        maxLength: PropTypes.number.isRequired,
        startsWith: PropTypes.string,
        endsWith: PropTypes.string,
        contains: PropTypes.string,
        minYear: PropTypes.number.isRequired,
        maxYear: PropTypes.number.isRequired,
        minOccurrences: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        maxOccurrences: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        pageSize: PropTypes.number.isRequired,
        pageIndex: PropTypes.number.isRequired,
        sortOrder: PropTypes.oneOf(['ASC', 'DESC']).isRequired,
        orderBy: PropTypes.oneOf(['occurrences', 'name']).isRequired,
    }).isRequired,
    pageCount: PropTypes.number.isRequired,
    totalResults: PropTypes.number.isRequired,
    updateTableParams: PropTypes.func.isRequired,
};
