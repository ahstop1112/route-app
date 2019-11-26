import React from 'react';
import { Row, Col } from 'reactstrap';

const SearchForm = props => {
    const { changeHandler, searchAddress, resetAddress, searchKeyPress, fromAddress, toAddress } = props;

    return ( 
        <div className="searchForm">
            <Row>
                <Col lg="12" sm="6" xs="6">
                    <label>Starting Location</label>
                    <input 
                        name="from" 
                        value={fromAddress || ""} 
                        placeholder="Start Point" 
                        onChange={changeHandler}
                        onKeyPress={(e) => searchKeyPress(e)}
                        autoFocus
                    />
                </Col>
                <Col lg="12" sm="6" xs="6">
                    <label>Drop-off Point</label>
                    <input 
                        name="to"  
                        value={toAddress || ""} 
                        placeholder="End Point" 
                        onChange={changeHandler}
                        onKeyPress={(e) => searchKeyPress(e)}
                    />
                </Col>
            </Row>    
            <Row>    
                <Col lg="12" sm="6" xs="12">
                    <button 
                    onClick={searchAddress}
                    disabled={!fromAddress || !toAddress}
                    className="marginRight-15px"
                    >Submit</button>
                    <button 
                    onClick={resetAddress}
                    disabled={!fromAddress || !toAddress}>Reset</button>
                </Col>
            </Row>
        </div>
    );
}
 
export default SearchForm;