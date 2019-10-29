import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Checkbox } from 'nav-frontend-skjema';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';

import { SEARCH } from '../searchReducer';
import {
    TOGGLE_TILRETTELEGGINGSBEHOV,
    TOGGLE_TILRETTELEGGINGSBEHOV_PANEL_OPEN
} from './tilretteleggingsbehovReducer';

class TilretteleggingsbehovSearch extends React.Component {
    onTilretteleggingsbehovChange = (e) => {
        this.props.toggleTilretteleggingsbehov(e.target.checked);
        this.props.search();
    };

    render() {
        const { togglePanelOpen, panelOpen, harTilretteleggingsbehov } = this.props;

        return (
            <Ekspanderbartpanel
                className="panel--sokekriterier"
                tittel="Tilretteleggingsbehov"
                tittelProps="undertittel"
                onClick={togglePanelOpen}
                apen={panelOpen}
            >
                <Checkbox
                    className="skjemaelement-pink"
                    id="tilretteleggingsbehov-checkbox"
                    label="Vis kandidater med tilretteleggingsbehov"
                    key="HAR_TILRETTELEGGINGSBEHOV"
                    value="HAR_TILRETTELEGGINGSBEHOV"
                    checked={harTilretteleggingsbehov}
                    onChange={this.onTilretteleggingsbehovChange}
                />
            </Ekspanderbartpanel>
        );
    }
}

TilretteleggingsbehovSearch.propTypes = {
    search: PropTypes.func.isRequired,
    harTilretteleggingsbehov: PropTypes.bool.isRequired,
    toggleTilretteleggingsbehov: PropTypes.func.isRequired,
    panelOpen: PropTypes.bool.isRequired,
    togglePanelOpen: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    harTilretteleggingsbehov: state.tilretteleggingsbehov.harTilretteleggingsbehov,
    panelOpen: state.tilretteleggingsbehov.tilretteleggingsbehovPanelOpen
});

const mapDispatchToProps = (dispatch) => ({
    search: () => dispatch({ type: SEARCH }),
    toggleTilretteleggingsbehov: (harTilretteleggingsbehov) =>
        dispatch({ type: TOGGLE_TILRETTELEGGINGSBEHOV, harTilretteleggingsbehov }),
    togglePanelOpen: () => dispatch({ type: TOGGLE_TILRETTELEGGINGSBEHOV_PANEL_OPEN })
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TilretteleggingsbehovSearch);
