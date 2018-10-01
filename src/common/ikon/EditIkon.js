import React from 'react';
import PropTypes from 'prop-types';

const EditIkon = ({ className }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" className={className}>
        <g stroke="#0067C5" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" fill="none">
            <path d="M7.31 21.675l-6.466 1.517 1.517-6.465 15.6-15.602c.781-.781 2.049-.781 2.829 0l2.122 2.122c.78.781.78 2.046 0 2.829l-15.602 15.599zM22.207 6.784l-4.954-4.952M20.78 8.211l-4.941-4.965M7.562 21.425l-4.95-4.951" />
        </g>
    </svg>
);

EditIkon.defaultProps = {
    className: undefined
};

EditIkon.propTypes = {
    className: PropTypes.string
};

export default EditIkon;
