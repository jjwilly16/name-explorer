import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Table from '../components/NameByYear/Table';
import FilterContainer from '../components/NameByYear/FilterForm/FilterContainer';
import { NameService } from '../services/';
import cleanQueryParams from '../lib/util/cleanQueryParams';
import fetcher from '../lib/util/fetcher';
import useDebounce from '../hooks/useDebounce';


export default function Home({ nameStats, query }) {
    const router = useRouter();

    // Cache the default values (the reset button will need this)
    const defaultQueryParams = useMemo(() => ({
        gender: 'M',
        minLength: nameStats.minLength,
        maxLength: nameStats.maxLength,
        startsWith: '',
        endsWith: '',
        contains: '',
        minYear: nameStats.maxYear - 5,
        maxYear: nameStats.maxYear,
        minOccurrences: '',
        maxOccurrences: '',
        pageSize: 10,
        pageIndex: 0,
        sortOrder: 'DESC',
        orderBy: 'occurrences',
    }), [nameStats.maxLength, nameStats.minLength, nameStats.maxYear]);

    // Persist the query string parameters
    const initialQueryParams = cleanQueryParams({
        gender: query.gender || null,
        minLength: query.minLength ? parseInt(query.minLength) : null,
        maxLength: query.maxLength ? parseInt(query.maxLength) : null,
        startsWith: query.startsWith || null,
        endsWith: query.endsWith || null,
        contains: query.contains || null,
        minYear: query.minYear ? parseInt(query.minYear) : null,
        maxYear: query.maxYear ? parseInt(query.maxYear) : null,
        minOccurrences: query.minOccurrences ? parseInt(query.minOccurrences) : null,
        maxOccurrences: query.maxOccurrences ? parseInt(query.maxOccurrences) : null,
        pageSize: query.pageSize ? parseInt(query.pageSize) : null,
        pageIndex: query.pageIndex ? parseInt(query.pageIndex) : null,
        sortOrder: query.sortOrder || null,
        orderBy: query.orderBy || null,
    });

    // Merge the defaults and query string params to create the initial state
    const [queryParams, setQueryParams] = useState({ ...defaultQueryParams, ...initialQueryParams });
    // Let's debounce the queryParams variable
    const debouncedQueryParams = useDebounce(queryParams, 300);

    const updateQueryParams = updatedParams => {
        const updatedQueryParams = {
            ...queryParams,
            ...updatedParams,
        };

        setQueryParams(updatedQueryParams);

        router.push({
            pathname: '/',
            query: cleanQueryParams(updatedQueryParams),
        }, undefined, {
            shallow: true,
        });
    };

    const resetFilters = () => {
        setQueryParams({ ...defaultQueryParams });
        router.push({
            pathname: '/',
            query: {},
        }, undefined, {
            shallow: true,
        });
    };

    const columns = useMemo(
        () => [
            {
                title: 'Name',
                id: 'name',
            },
            {
                title: '# Of Occurrences',
                id: 'occurrences',
            },
        ],
        []
    );

    // If the queryParams equal the debouncedQueryParams, that means that the debounced value
    // has caught up to the actual value and we can now call the API
    const { data, error } = useSWR(queryParams === debouncedQueryParams ? ['/api/getNamesByYear', queryParams] : null, fetcher);

    const getTable = (data, error, columns) => {
        if (error) return <div className="text-center"><p>An error has occurred</p></div>
        if (!data) return (
            <Table
                columns={columns}
                data={[]}
                isLoading={true}
                tableParams={queryParams}
                pageCount={0}
                totalResults={0}
                updateTableParams={() => { }}
            />
        )
        const { pagedResults, paginationInfo } = data;
        const { pageCount, totalResults } = paginationInfo;
        return (
            <Table
                columns={columns}
                data={pagedResults}
                isLoading={false}
                tableParams={queryParams}
                pageCount={pageCount}
                totalResults={totalResults}
                updateTableParams={updateQueryParams}
            />
        )
    }


    return (
        <div className="py-5">
            <h1 className="text-center">
                US Name Statistics
            </h1>
            <p className="lead text-center mb-5 mt-2">
                This table displays the number of times each name has been used for the selected date range in the United States.
            </p>
            <div className="row">
                <div className="col">
                    <FilterContainer
                        nameStats={nameStats}
                        tableParams={queryParams}
                        updateTableParams={updateQueryParams}
                        resetFilters={resetFilters}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    {getTable(data, error, columns)}
                    <div className="text-muted pt-3 d-flex align-items-center justify-content-between">
                        <small>
                            Data from the US Census Bureau
                        </small>
                        <small>
                            <a href="https://jjwilly.com/contact" target="_blank" rel="noreferrer">
                                <FontAwesomeIcon icon={['fas', 'envelope']} />
                                {' '}
                                Contact
                            </a>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps({ query }) {
    const nameStats = await NameService.getStats();

    if (!nameStats) {
        return {
            notFound: true,
        }
    }

    return {
        props: {
            nameStats,
            query,
        }
    }
}
