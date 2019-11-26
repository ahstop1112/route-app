import React, { Component } from "react";
import PropTypes from 'prop-types';
import { convertLatLngToObj } from "../utility/helper";
const { Marker, DirectionsRenderer } = require("react-google-maps");

class DirectionRender extends Component {
    static propTypes = {
        fromPos: PropTypes.object.isRequired,
        toPos: PropTypes.object.isRequired
    };

  state = {
    directions: null,
    wayPoints: null,
    currentLocation: null
  };
  delayFactor = 0;

  componentDidMount() {
    const { fromPos, toPos } = this.props;
    const startLoc = fromPos.pos.lat + ", " + fromPos.pos.lng;
    const endLoc = toPos.pos.lat + ", " + toPos.pos.lng;
    this.getDirections(startLoc, endLoc);
    this.setCurrentLocation();
  }

  async getDirections(startLoc, endLoc, wayPoints = []) {
    const waypts = [];
    if (wayPoints.length > 0) {
      waypts.push({
        location: new window.google.maps.LatLng(
          wayPoints[0].lat,
          wayPoints[0].lng
        ),
        stopover: true
      });
    }
    const directionService = new window.google.maps.DirectionsService();
    directionService.route(
      {
        origin: startLoc,
        destination: endLoc,
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: window.google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        // console.log("status", status);
        if (status === window.google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result,
            wayPoints: result.routes[0].overview_path.filter((elem, index) => {
              return index % 30 === 0;
            })
          });
        } else if (
          status === window.google.maps.DirectionsStatus.OVER_QUERY_LIMIT
        ) {
          this.delayFactor += 0.2;
          // if (this.delayFactor <= 10) this.delayFactor = 0.2;
          setTimeout(() => {
            this.getDirections(startLoc, endLoc, wayPoints);
          }, this.delayFactor * 200);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  }

  setCurrentLocation = () => {
    let count = 0;
    let refreshIntervalId = setInterval(() => {
      const locations = this.state.wayPoints;
      if (locations) {
        if (count <= locations.length - 1) {
          const currentLocation = convertLatLngToObj(
            locations[count].lat(),
            locations[count].lng()
          );
          this.setState({ currentLocation });

          const wayPts = [];
          wayPts.push(currentLocation);
          const startLoc = this.props.fromPos.pos.lat + ", " + this.props.fromPos.pos.lng;
          const destinationLoc = this.props.toPos.pos.lat + ", " + this.props.toPos.pos.lng;
          this.delayFactor = 0;
          this.getDirections(startLoc, destinationLoc, wayPts);
          count++;
        } else {
          clearInterval(refreshIntervalId);
        }
      }
    }, 1000);
  };

  render() {
    let originMarker = null;
    let destinationMarker = null;
    if (this.state.directions) {
      originMarker = (
        <Marker
          label={{
            text: "A",
            fontSize: "11px",
            color: "#fff"
          }}
          defaultIcon={null}
          position={{
            lat: parseFloat(this.props.fromPos.pos.lat),
            lng: parseFloat(this.props.fromPos.pos.lng)
          }}
        />
      );
      destinationMarker = (
        <Marker
            label={{
                text: "B",
                fontSize: "11px",
                color: "#fff"
            }}
          defaultIcon={null}
          position={{
            lat: parseFloat(this.props.toPos.pos.lat),
            lng: parseFloat(this.props.toPos.pos.lng)
          }}
        />
      );
    }
    return (
      <div>
        {originMarker}
        {destinationMarker}
        {this.state.currentLocation && (
          <Marker
            icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            position={{
              lat: this.state.currentLocation.lat,
              lng: this.state.currentLocation.lng
            }}
          />
        )}
        {this.state.directions && (
          <DirectionsRenderer
            directions={this.state.directions}
            options={{
              polylineOptions: {
                storkeColor: '#000',
                strokeOpacity: 0.4,
                strokeWeight: 3
              },
              preserveViewport: true,
              suppressMarkers: true,
              icon: { scale: 4 }
            }}
          />
        )}
      </div>
    );
  }
}

export default DirectionRender;