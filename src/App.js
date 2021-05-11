import React, { useState, useEffect } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import LineGraph from "./LineGraph";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import numeral from "numeral";
import Map from "./Map";
import "leaflet/dist/leaflet.css";
import axios from "axios"
import styled,{ ThemeProvider } from "styled-components"
import { lightTheme, darkTheme,GlobalStyles } from './theme'
import Brightness4OutlinedIcon from '@material-ui/icons/Brightness4Outlined';

const StyledApp = styled.div``;

const App = () => {
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(2);
  const [theme, setTheme] = useState("light")

  const themeToggler = () => {
    theme === "light" ? setTheme("dark") : setTheme("light")
  }

  useEffect(() => {
    axios.get("https://disease.sh/v3/covid-19/all")
      // .then((response) => response.json())
      .then((response) => {
        setCountryInfo(response.data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      axios.get("https://disease.sh/v3/covid-19/countries")
        // .then((response) => response.json())
        .then((response) => {
          const countries = response.data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          let sortedData = sortData(response.data);
          setCountries(countries);
          setMapCountries(response.data);
          setTableData(sortedData);
        });
    };

    getCountriesData();
  }, []);

  console.log(casesType);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await axios.get(url)
      .then((response) => {
        console.log("WORLDWIDE", response.data)
        setInputCountry(countryCode);
        setCountryInfo(response.data);
        countryCode === "worldwide" ? setMapCenter({ lat: 34.80746, lng: -40.4796 }) && setMapZoom(2) : setMapCenter([response.data.countryInfo.lat, response.data.countryInfo.long]);
        setMapZoom(3)
 });
  };

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <GlobalStyles />
      <StyledApp>
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Brightness4OutlinedIcon style={{width: 40, height: 40, cursor: "pointer", ...(theme === "light" ? {color: "#333333"} : {color: "#fff"})}} onClick={()=> themeToggler()}></Brightness4OutlinedIcon>
        </div>
        <div className="app__stats">
          <InfoBox
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            isRed
            isLight = {theme}
            active={casesType === "cases"}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            isLight = {theme}
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isLight = {theme}
            isRed
            active={casesType === "deaths"}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}
          />
        </div>
        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
          isLight = {theme}
        />
      </div>
      <Card className={`app__right ${theme === "light" ? "app--right--light" : "app--right--dark"} `}>
        <CardContent>
          <div className="app__information">
            <h3>Live Cases by Country</h3>
            <Table isLight = {theme} countries={tableData} />
            <h3 className="app__heading">Worldwide new {casesType}</h3>
            <LineGraph casesType={casesType} />
          </div>
        </CardContent>
      </Card>
    </div>
    </StyledApp>
    </ThemeProvider>
  );
};

export default App;
