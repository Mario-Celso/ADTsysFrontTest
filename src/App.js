import React, { useEffect, useState, useCallback } from 'react';
import "./App.css";
import axios from "axios";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import lodash from 'lodash';
import CircularProgress from '@material-ui/core/CircularProgress';
import Swal from 'sweetalert2'

const App = () => {
  const [cityName, setCityName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pokemonData, setPokemonData] = useState(null);

  const handleChange = (e) => {
    debounceFindPatient(e.target.value);
  };

  const debounceFindPatient = useCallback(
      lodash.debounce((_searchVal) => {
        getPokemon(_searchVal);
        setCityName(_searchVal)
      }, 1000),
      []
  );
  const handleSubmit = (e) => {
    e.preventDefault();
    getPokemon(cityName);
  };
  const getPokemon = async (value) => {
    if(value.length > 0){
      setIsLoading(true)
      try {
        const url = `http://localhost:5000/searchByCity/${value}`;
        const res = await axios.get(url);
        setPokemonData(res.data);
        console.log(res.data)
      } catch (e) {
        Swal.fire('Insira uma cidade valida!')
      }
    }else{
      setCityName(null)
      setPokemonData(null)
    }
    setIsLoading(false)
  };

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" align={"center"}>
            <img src="https://logos-download.com/wp-content/uploads/2016/07/Pok%C3%A9mon_logo.png"
             style={
              {
                height:"60px"
              }
            } alt="logo"/>
          </Typography>
        </Toolbar>
      </AppBar>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            style={
              {
                width:"700px",
                height:"50px"
              }
            }
            type="text"
            onChange={handleChange}
            placeholder="Insira a cidade"
          />
        </label>
      </form>
      <div className="container">
        {isLoading &&
        <CircularProgress color="primary" style={{
          width:"100px",
          marginTop:"60px"
        }}/>
        }
        {pokemonData != null &&
        <Card style={{
          width:'300px',
          height:'400px',
          borderRadius: '15px'
        }}>
          <CardContent>
            <Typography variant="h5" component="h2">
              Cidade {cityName}
            </Typography>
            <Typography color="textSecondary">
              {pokemonData.rain ?
                  <div>
                    <p> Temperatura atual {pokemonData.temp}ºC</p>
                    Chovendo
                  </div>
                  :
                  <div>
                    <p> Temperatura atual {pokemonData.temp}ºC</p>
                    Sem Chuva
                  </div>
              }
            </Typography>
            <Typography variant="body2" component="p">
              <img src={pokemonData.pokemon.image} alt="pokemon"/>
              <br />
              Nome do Pokemon - {pokemonData.pokemon.name}
            </Typography>
          </CardContent>
        </Card>
        }
      </div>
    </div>
  );
};

export default App;
