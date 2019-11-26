import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { compose, withProps } from 'recompose';
 
import { G_API_URL } from "../utility/constants";
import DirectionRender from "./DirectionRender";

export class Map extends Component {
    static propTypes = {
        centerPos: PropTypes.object,
        fromPos: PropTypes.object,
        toPos: PropTypes.object
    };

    render() {
        const { centerPos, defaultZoom, fromPos, toPos, markers, errors } = this.props;

        return (
            <React.Fragment>
                <GoogleMap
                    className="mapContainer"
                    defaultZoom={defaultZoom}
                    maxZoom={20}
                    minZoom={8}
                    center={centerPos}
                    onReady={this.adjustMap}
                    defaultCenter={new window.google.maps.LatLng(centerPos.lat, centerPos.lng)}
                >
                    {fromPos.lat !== 0 && toPos.lat !== 0 && <DirectionRender
                        fromPos={fromPos}
                        toPos={toPos}
                        errors={errors}
                    />}
                    { markers.length > 0 && markers.map((marker, index) => {
                        const lat = parseFloat(marker[0]);
                        const lng = parseFloat(marker[1]);
                        const iconImg = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';

                        return <Marker
                                key={ `marker_${marker[0]}_${marker[1]}` }
                                label={{
                                    text: (index+1).toString(),
                                    fontSize: "14px",
                                    color: "#000"
                                }}
                                icon={{url: iconImg}}
                                position={{lat, lng}}
                            />
                    }) }
                </GoogleMap>
            </React.Fragment>
        );
    }
}

export default compose(
  withProps({
    googleMapURL: G_API_URL,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div className="mapContainer" style={{ height: `1000px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(Map);