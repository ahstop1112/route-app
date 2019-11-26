import React, { Component } from 'react';
import Geocode from "react-geocode";
import { ToastContainer } from 'react-toastify';
import { G_API_KEY, LANG } from "../utility/constants";
import { postAddressToAPI, getMarkersByToken } from '../services/mapServices';
import SideBar from './SideBar';
import Map from './Map';

Geocode.setApiKey( G_API_KEY );
Geocode.setLanguage( LANG );
Geocode.enableDebug();

export class MapContainer extends Component {

  constructor(props){
    super(props);

    this.state = {
      centerPos: {
        lat: 22.279680,
        lng: 114.171692
      },
      fromPos: {
        id: 'A', lat: 0, lng: 0, name: ''
      },
      fromAddress: '',
      toPos: {
        id: 'B', lat: 0,lng: 0, name: ''
      },
      toAddress: '',
      markers: {},
      defaultZoom: 12,
      map: null,
      totalDistance: 0, 
      totalTime: 0,
      errors: null
    }
  }

  async fetchMapAPI(){  //test MockAPI
    const { fromAddress, toAddress } = this.state;
    const response = await postAddressToAPI(fromAddress, toAddress); //if success, it will return the token
    if (!response) return;

    const token = response.data.token;
    const { data } = await getMarkersByToken(token);  // if success, it will return the Markers Data
    //Handle API Response
    if (data.status === 'success'){
      this.setState({
        markers: data.path,
        totalDistance: data.total_distance,
        totalTime: data.total_distance,
        errors: null
      });
    }else if (data.status === 'in progress'){
      this.setState({
        errors: 'In Progress'
      });
    }else{
      this.setState({
        errors: data.error,
        fromPos: {
          id: 'A', lat: 0, lng: 0, name: ''
        },
        fromAddress: '',
        toPos: {
          id: 'B', lat: 0,lng: 0, name: ''
        },
        toAddress: ''
      });
    }
  }

  searchAddress = () => {
    const {fromAddress, toAddress} = this.state;
    
    if (!fromAddress || !toAddress) return ;

    this.getGeoCode(fromAddress, toAddress);
    this.fetchMapAPI();
  }

  resetAddress = () => {
    this.setState({
        centerPos: {
          lat: 22.279680,
          lng: 114.171692
        },
        fromPos: {
          id: 'A', lat: 0, lng: 0, name: ''
        },
        fromAddress: '',
        toPos: {
          id: 'B', lat: 0,lng: 0, name: ''
        },
        toAddress: '',
        defaultZoom: 20,
        map: null,
        totalDistance: 0, 
        totalTime: 0,
        errors: null
    })
  }

  getGeoCode = (fromAdd, toAdd) => {

    Geocode.fromAddress(fromAdd).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;
        
        this.setState({
          fromPos: {pos: {lat, lng}, name: fromAdd},  //Storing the REAL starting points
          centerPos: response.results[0].geometry.bounds.northeast
        })

      },
      error => {
        //console.error(error);
        this.setState({
          errors: 'Please input the correct address', //handle wrong address
          fromAddress: '',
          toAddress: ''
        })
      }
    );

    Geocode.fromAddress(toAdd).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;
        this.setState({
          toPos: {pos: {lat, lng}, name: toAdd} //Storing the REAL ending points
        })
      },
      error => {
        this.setState({
          errors: 'Please input the correct address', //handle wrong address
          fromAddress: '',
          toAddress: ''
        })
      }
    );
  }

  searchKeyPress = (e) => {
      if (e.keycode === 13 || e.key === 'Enter'){
        const {fromAddress, toAddress} = this.state;
    
        if (!fromAddress || !toAddress) return ;
    
        this.getGeoCode(fromAddress, toAddress);
        this.fetchMapAPI();
      }
  }

  changeHandler = (e) =>{
      e.preventDefault();
      let address = e.target.value;  //get the value from the input
      let addressType = e.target.name;

      if (addressType === 'from') 
        this.setState({ fromAddress: address });
      else if (addressType === 'to'){
        this.setState({ toAddress: address });
      }  
  }

render() {
    const { centerPos, fromPos, toPos, defaultZoom, fromAddress, toAddress,  markers, totalDistance, totalTime, errors } = this.state;

    return (
        <React.Fragment>
            <ToastContainer />
            <SideBar 
              changeHandler={this.changeHandler}
              searchAddress={this.searchAddress}
              resetAddress={this.resetAddress}
              searchKeyPress={this.searchKeyPress}
              fromAddress={fromAddress}
              toAddress={toAddress}
              totalDistance={totalDistance}
              totalTime={totalTime}
              errors={errors}
            />
            <Map
              className="mapContainer"
              defaultZoom={defaultZoom}
              centerPos={centerPos}
              fromPos={fromPos}
              toPos={toPos}
              markers={markers} //load with API
              errors={errors}
            />
        </React.Fragment>
    );
  }
}

export default MapContainer;