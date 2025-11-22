import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, name, type }) => {
    // Create full title
    const fullTitle = title === 'Talk2Me - AI Communication Coach'
        ? title
        : `${title} | Talk2Me`;

    return (
        <Helmet>
            { /* Standard metadata tags */}
            <title>{fullTitle}</title>
            <meta name='description' content={description} />
            { /* End standard metadata tags */}

            { /* Facebook tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            { /* End Facebook tags */}

            { /* Twitter tags */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            { /* End Twitter tags */}
        </Helmet>
    )
}

SEO.defaultProps = {
    title: 'Talk2Me - AI Communication Coach',
    description: 'Improve your public speaking and communication skills with Talk2Me. Get instant AI feedback on your speech pace, clarity, and tone.',
    name: 'Talk2Me',
    type: 'website'
};

export default SEO;
