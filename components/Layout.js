import Head from 'next/head';
import PropTypes from 'prop-types';

export default function Layout({ children }) {
    return (
        <main>
            <Head>
                <title>US Name Explorer</title>
            </Head>
            <div className="container">
                {children}
            </div>
        </main>
    )
}

Layout.propTypes = {
    children: PropTypes.object.isRequired,
};
