import React, {useState, useEffect} from 'react';
import './App.css';
import InfoBox from './InfoBox'
import Map from './Map';
import Table from './Table'
import {sortData, prettyPrintStat} from "./util";
import LineGraph from './LineGraph'
import "leaflet/dist/leaflet.css";
import {
  MenuItem,
  FormControl,
  Select, Card, CardContent
} from "@material-ui/core";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796});
  const [mapZoom, setMapZoom] = useState(3);
  const [casesType, setCasesType] = useState("cases");
  const [mapCountries, setMapCountries] = useState([]);
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    });
  }, []);

  useEffect(() => {
      const getCountriesData = async () =>{
        await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) =>(
            {
              name: country.country,
              value: country.countryInfo.iso2
            }
          ));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
      };
      getCountriesData();
  },[]);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    setCountry(countryCode);

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);

      //All of the data from country response
      setCountryInfo(data);
      setMapCenter(countryCode ==="worldwide" ? {lat: 34.80746, lng: -40.4796} :[data.countryInfo.lat,data.countryInfo.long]);
      setMapZoom(countryCode === "worldwide" ? 3 : 4);

    })

  };

  return (
    <div className="app">
    <div className="app__left">
    <div className="app__header">
    <h1>COVID-19 TRACKER</h1>
      <FormControl className="app__dropdown">
        <Select variant="outlined" onChange={onCountryChange} value={country}>
        {/* Loop through all the countries and show a drop down list of the options  */}
        <MenuItem value="worldwide">Worldwide</MenuItem>
        {
          countries.map(country => {
            return <MenuItem value={country.value}>{country.name}</MenuItem>
          })
        }

          {/*<MenuItem value="worldwide">Worldwide</MenuItem>
          <MenuItem value="worldwide">Worldwide</MenuItem>
          <MenuItem value="worldwide">Worldwide</MenuItem>
          <MenuItem value="worldwide">Worldwide</MenuItem>*/}

        </Select>

      </FormControl>

    </div>
      
    {/* Header */}
    {/* Title + Select input dropdown field */}


    <div className="app__stats">
          <InfoBox 
            isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")} 
            title="Coronavirus Cases" 
            cases={prettyPrintStat(countryInfo.todayCases)} 
            total={prettyPrintStat(countryInfo.cases)}   

            />
          <InfoBox 
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")} 
            title="Recovered" 
            cases={prettyPrintStat(countryInfo.todayRecovered)} 
            total={prettyPrintStat(countryInfo.recovered)}  

            />
          <InfoBox 
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")} 
            title="Deaths" 
            cases={prettyPrintStat(countryInfo.todayDeaths)} 
            total={prettyPrintStat(countryInfo.deaths)}  

            />
          
           {/* InfoBoxes */}
           {/* Infoboxes */}
           {/* InfoBoxes */}

    </div>

   
    {/* Map */}
    <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />

    </div>

    <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData}/>
          {/* Table */}

          <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType} />
          {/* Graph */}



        </CardContent>

    
    </Card>
    

    </div>
  );
}

export default App;
