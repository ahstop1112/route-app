import React from 'react';
import { Alert } from 'reactstrap';
import { Row, Col } from 'reactstrap';
import SearchForm from './SearchForm';
import 'react-toastify/dist/ReactToastify.css';

const SideBar = props => {
    const {changeHandler, searchKeyPress, searchAddress, resetAddress, fromAddress, toAddress, totalDistance, totalTime, errors} = props;

    return ( 
        <div className="sideBar">
            <h3>Google Route</h3>
            <SearchForm
                changeHandler={changeHandler}
                searchAddress={searchAddress}
                resetAddress={resetAddress}
                searchKeyPress={searchKeyPress}
                fromAddress={fromAddress}
                toAddress={toAddress}
            />
            <Row className="marginTop-30px">
                <Col lg="12" sm="6" xs="6">
                    Total Distance: {totalDistance}
                </Col>
                <Col lg="12" sm="6" xs="6">
                    Total Time: {totalTime}
                </Col>
            </Row>
            {errors && <Alert color="danger">
                {errors}
            </Alert>}
        </div>
    );
}

export default SideBar;