export default function Spinner() {
    const spinnerContainerStyles = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
    };

    return (
        <div style={spinnerContainerStyles} className="d-flex justify-content-center align-items-center flex-column">
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
            <span className="text-muted mt-3">
                Loading...
            </span>
        </div>
    )
}
