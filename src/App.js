import React, { Component } from 'react'
import './App.css'

// import { styled } from '@mui/system';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import Box from '@mui/system/Box';
import search from './search.png';
import cute from './cute.png';

// const COLORS = {
//   Psychic: "#f8a5c2",
//   Fighting: "#f0932b",
//   Fairy: "#c44569",
//   Normal: "#f6e58d",
//   Grass: "#badc58",
//   Metal: "#95afc0",
//   Water: "#3dc1d3",
//   Lightning: "#f9ca24",
//   Darkness: "#574b90",
//   Colorless: "#FFF",
//   Fire: "#eb4d4b"
// }

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      selectCards: [],
      removeCards: [],
      countNumSelectCard: false,
      removeNumSelectCard: false,
      cards: [],
      newDataList: [],
      isLoading: false,
      // error: null,
      isDisplayRemoveBtn: null,
      isDisplayAddBtn: null,
      isMouseOverBox: null,
      isParentIndex: null,
      searchNameQuery: '',
    }
  };

  componentDidMount() {
    const { searchNameQuery, selectCards, countNumSelectCard, removeNumSelectCard } = this.state;
    var searchName = "";
    if (searchNameQuery !== "") {
      searchName = `&name=${searchNameQuery}`;
    }
    const url = `http://localhost:3030/api/cards?limit=20${searchName}`;
    fetch(url).then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok!!');
      }
      return response.json();
    })
    .then((cardsResponse) => {
      const cards = cardsResponse.cards;
      this.setState({ cards, isLoading: false });

      // Make model new data list pokemon card
      const newDataList = cards.map(card => ({
        id: card.id,
        name: card.name.toUpperCase(),
        cardImageUrl: card.imageUrl,
        hp: card.hp ? this.calculateHp(card.hp) : "0",
        strength: card.attacks ? 
                  this.calculateStrength(card.attacks.length).toString() + '%' : 
                  0,
        weakness: card.weaknesses ? 
                  this.calculateWeakness(card.weaknesses.length).toString() + '%' : 
                  0,
        damage: card.attacks ? 
                this.calculateDamage(card.attacks.map(attack => attack.damage)) : 
                '',
        happiness: card.hp && card.attacks && card.weaknesses ? 
                    this.calculateHappiness(
                      card.hp ? this.calculateHp(card.hp) : 0, 
                      this.calculateDamage(card.attacks.map(attack => attack.damage)), 
                      this.filterValueWeakness(card.weaknesses.map(weak => weak.value))
                    ) : 
                    0,
      }));

      // check my pokemon card in pokedex => What have pokemon?
      if (countNumSelectCard) {
        const isDuplicate = newDataList.some(
          (card) => card.id !== selectCards.map(card2 => card2.id)
        );

        if (isDuplicate) {
          const updateNewDataList = newDataList.filter((card) =>
            !selectCards.some(card2 => card.id === card2.id && card.name === card2.name)
          );
          this.setState({ newDataList: updateNewDataList });
        }
      } else {
        this.setState({ newDataList, isLoading: false });
      }

      if (removeNumSelectCard) {
        const updateNewDataList = newDataList.filter((card) =>
          !selectCards.some(card2 => card.id === card2.id && card.name === card2.name)
        );
        this.setState({ newDataList: updateNewDataList });
      }
    })
    .catch((error) => {
      // this.setState({ error, isLoading: false })
      console.error('There was a problem fetching the data ', error)
    });
  };

  componentDidUpdate(previewProps, previewState) {
    const { newDataList, searchNameQuery } = this.state;

    if (
      previewState.searchNameQuery !== this.state.searchNameQuery ||
      previewState.searchTypeQuery !== this.state.searchTypeQuery
    ) {
      this.componentDidMount();

      const filterResult = newDataList.filter(card => 
        card.name?.toLowerCase().includes(searchNameQuery.toLowerCase())  
      );
  
      this.setState({newDataList: filterResult});
    }
  };

  calculateHp = (hp) => {
    var response = '';
    if (hp > 100) {
      response = "100";
    } else if (hp <= 100) {
      response = hp;
    } else {
      response = "0"
    }
    return response;
  };

  calculateStrength = (atkLength) => {
    var response = 0;
    if ((atkLength * 50) > 100) {
      response = 100;
    } else {
      response = (atkLength * 50);
    }
    return response;
  };

  calculateWeakness = (weakLength) => {
    var response = 0;
    if ((weakLength * 100) > 100) {
      response = 100;
    } else {
      response = (weakLength * 100);
    }
    return response;
  };

  filterValueWeakness = (weaknessValue) => {
    var response = 0;
    response = parseInt(weaknessValue.toString().replace(/[^\d.-]/g, ''));
    return response;
  };

  calculateDamage = (damages) => {
    var totalDamage = 0;
    if (damages.length > 1) {
      damages.forEach(dmg => {
        if (/[\dx]/.test(dmg)) {
          totalDamage += parseInt(dmg, 10);
        }
      });
    } else {
      totalDamage += parseInt(damages[0], 10);
    }
    return totalDamage;
  };

  calculateHappiness = (hp, damage, weakness) => {
    var total = ((parseInt(hp) / 10) + (damage / 10) + 10 - (weakness)) / 5;
    var totalNumber = Math.floor(total);
    return totalNumber;
  };

  onOverDisplayAddBtn = (index) => {
    this.setState({ isDisplayAddBtn: index });
  };

  onOutDisplayAddBtn = () => {
    this.setState({ isDisplayAddBtn: null });
  };

  onOverDisplayRemoveBtn = (index) => {
    this.setState({ isDisplayRemoveBtn: index });
  };

  onOutDisplayRemoveBtn = () => {
    this.setState({ isDisplayRemoveBtn: null });
  };

  handleOpenDialog = () => {
    // this.setState({ open: true });
    this.setState((prevState) => ({
      openDialog: true,
      searchNameQuery: ''
    }));
  };

  handleCloseDialog = () => {
    this.setState({ openDialog: false });
  };

  handleSearchNameQueryChange = e => {
    this.setState({ searchNameQuery: e.target.value });
  };

  handleSearchTypeQueryChange = e => {
    this.setState({ searchTypeQuery: e.target.value });
  };

  handleAddPokemon = (index, pokemon) => {
    const { newDataList, selectCards } = this.state;

    const isDuplicate = newDataList.some(
      (card) => card.id === pokemon.id
    );

    if (isDuplicate) {
      const updateNewDataList = newDataList.filter(
        (card) => card.id !== pokemon.id
      );

      this.setState((previewState) => ({
        newDataList: updateNewDataList,
        selectCards: [...previewState.selectCards, pokemon],
        countNumSelectCard: true
      }));
    };
  };

  handleRemovePokemon = (index, pokemon) => {
    const { selectCards } = this.state;

    const deleteOldDataList = selectCards.filter(
      (card) => card.id === pokemon.id
    );

    const updateNewDataList = selectCards.filter(
      (card) => card.id !== pokemon.id
    );

    this.setState((previewState) => ({
      selectCards: updateNewDataList,
      removeCards: [...previewState.removeCards, deleteOldDataList],
      removeNumSelectCard: true,
    }));
  };

  renderDialogBoxes = (newDataList, selectCards, parentIndex = null) => {
    return newDataList.map((pokemon, index) => (
      <Box
        key={index}
        onMouseEnter={() => this.onOverDisplayAddBtn(parentIndex !== null ? parentIndex : index)}
        onMouseLeave={this.onOutDisplayAddBtn}
      >
        <div className='cardBox-dialog'>
          <Card sx={{ backgroundColor: '#d5d6dc'}}>
            <Grid container spacing={2} sx={{ padding: '0.5rem' }}>
              <Grid item xs={3}>
                <CardMedia
                  component="img"
                  height="140"
                  image={pokemon.cardImageUrl}
                  title={pokemon.name}
                  style={{ width: '200px', height:'280px' }}
                />
              </Grid>
              <Grid item xs={9}>
                  <Box display="flex">
                    <Box flex="1" sx={{ marginLeft: '1rem' }}>
                      <div style={{ display: 'flex' ,justifyContent: 'flex-start' }}>
                        <div className='font-size-name'>{pokemon.name}</div>
                      </div>
                    </Box>
                    <Box flex="1">
                    { this.state.isDisplayAddBtn === (parentIndex !== null ? parentIndex: index) && (
                      <div style={{ display: 'flex' ,justifyContent: 'flex-end' }}>
                        <a href='#' 
                          className='btnDialogAdd' 
                          onClick={
                            () => this.handleAddPokemon(parentIndex !== null ? parentIndex : index,pokemon)
                          }>
                          Add
                        </a>
                      </div>
                    )}
                    </Box>
                  </Box>
                  <Box sx={{ padding: '1rem', paddingTop: '0' }}>
                    {/* Hp */}
                    <div className='font-size-detail'>
                      <Grid container>
                        <Grid item xs={2} sm={2}>
                          HP
                        </Grid>
                        {/* Hp */}
                        <Grid item xs={10} sm={10} sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: '70%', height: '25px', backgroundColor: '#e4e4e4', borderRadius: '20px', boxShadow: '3px 4px 8px #d4d4d4' }}>
                            <Box width={`${pokemon.hp}%`} sx={{ height: '25px', backgroundColor: '#f3701a', borderRadius: '20px' }}></Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </div>
                    {/* Strength */}
                    <div className='font-size-detail'>
                      <Grid container>
                        <Grid item xs={2} sm={2}>
                          STR
                        </Grid>
                        <Grid item xs={10} sm={10} sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: '70%', height: '25px', backgroundColor: '#e4e4e4', borderRadius: '20px', }}>
                            <Box width={`${pokemon.strength}`} sx={{ height: '25px', backgroundColor: '#f3701a', borderRadius: '20px' }}></Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </div>
                    {/* Weak */}
                    <div className='font-size-detail'>
                      <Grid container>
                        <Grid item xs={2} sm={2}>
                          Weak
                        </Grid>
                        <Grid item xs={10} sm={10} sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: '70%', height: '25px', backgroundColor: '#e4e4e4', borderRadius: '20px', }}>
                            <Box width={`${pokemon.weakness}`} sx={{ height: '25px', backgroundColor: '#f3701a', borderRadius: '20px' }}></Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </div>
                    <div className='font-size-detail'>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {Array.from({ length: pokemon.happiness }, (_, index) => (
                          <img
                            key={index}
                            src={cute}
                            alt='happiness'
                            style={{ maxWidth: '10%', height: 'auto' }}
                          />
                        ))}
                      </Box>
                    </div>
                  </Box>
              </Grid>
            </Grid>
          </Card>
        </div>
      </Box>
    ))
  }

  render() {
    const { newDataList, searchNameQuery, isParentIndex, selectCards, dataArray  } = this.state;
    return (
      <div className="App">
        <div className="layout-font">My Pokedex</div>
        {/* body */}
        <div className="layout-body">
          {selectCards != [] && (
          <div>
            {/* Grid แสดงข้อมูล */}
            <Grid container spacing={2} sx={{ padding: '0.5rem' }}>
              {selectCards.map((pokemon, index) => (  
              <Grid key={index} item xs={6}>
                <Box
                  key={index}
                  onMouseEnter={() => this.onOverDisplayRemoveBtn(isParentIndex !== null ? isParentIndex : index)}
                  onMouseLeave={this.onOutDisplayRemoveBtn}
                >
                  <div className='cardBox'>
                    <Card sx={{ backgroundColor: '#d5d6dc'}}>
                      <Grid container spacing={2} sx={{ padding: '0.5rem' }}>
                          <Grid item xs={4}>
                              <CardMedia
                                component="img"
                                height="120"
                                image={pokemon.cardImageUrl}
                                title={pokemon.name}
                                style={{ width: '160px', height:'220px' }}
                              />
                          </Grid>
                          <Grid item xs={8}>
                            <Box>
                              <Grid container spacing={2}>
                                <Grid item xs={10}>
                                  <div style={{ display: 'flex' ,justifyContent: 'flex-start' }}>
                                    <div className='font-size-name'>{pokemon.name}</div>
                                  </div>
                                </Grid>
                                <Grid item xs={2}>
                                { this.state.isDisplayRemoveBtn === (isParentIndex !== null ? isParentIndex: index) && (
                                  <div style={{ display: 'flex' ,justifyContent: 'flex-end', padding: '0' }}>
                                    <a href='#' 
                                      className='btnDialogRemove'
                                      onClick={
                                        () => this.handleRemovePokemon(isParentIndex !== null ? isParentIndex : index,pokemon)
                                      }>
                                      X
                                    </a>
                                  </div>
                                )}
                                </Grid>
                              </Grid>
                            </Box>
                            <Box sx={{ padding: '5px' }}>
                              <div className='font-size-detail'>
                                <Grid container>
                                  <Grid item xs={3} sm={3}>
                                    HP
                                  </Grid>
                                  <Grid item xs={9} sm={9} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box sx={{ width: '70%', height: '25px', backgroundColor: '#e4e4e4', borderRadius: '20px', }}>
                                      <Box width={`${pokemon.hp}%`} sx={{ height: '25px', backgroundColor: '#f3701a', borderRadius: '20px' }}></Box>
                                    </Box>
                                  </Grid>
                                </Grid>
                              </div>
                              <div className='font-size-detail'>
                                <Grid container>
                                  <Grid item xs={3} sm={3}>
                                    STR
                                  </Grid>
                                  <Grid item xs={9} sm={9} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box sx={{ width: '70%', height: '25px', backgroundColor: '#e4e4e4', borderRadius: '20px', }}>
                                      <Box width={`${pokemon.strength}`} sx={{ height: '25px', backgroundColor: '#f3701a', borderRadius: '20px' }}></Box>
                                    </Box>
                                  </Grid>
                                </Grid>
                              </div>
                              <div className='font-size-detail'>
                                <Grid container>
                                  <Grid item xs={3} sm={3}>
                                    Weak
                                  </Grid>
                                  <Grid item xs={9} sm={9} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box sx={{ width: '70%', height: '25px', backgroundColor: '#e4e4e4', borderRadius: '20px', }}>
                                      <Box width={`${pokemon.weakness}`} sx={{ height: '25px', backgroundColor: '#f3701a', borderRadius: '20px' }}></Box>
                                    </Box>
                                  </Grid>
                                </Grid>
                              </div>
                              <div className='font-size-detail'>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  {Array.from({ length: pokemon.happiness }, (_, index) => (
                                    <img
                                      key={index}
                                      src={cute}
                                      alt='happiness'
                                      style={{ maxWidth: '10%', height: 'auto' }}
                                    />
                                  ))}
                                </Box>
                              </div>
                            </Box>
                          </Grid>
                      </Grid>
                    </Card>
                  </div>
                </Box>
              </Grid>
              ))}
            </Grid>
          </div>
          )}
          
        </div>
        {/* footer */}
        <div className='layout-footer'>
          <div className='layout-btnAdd'>
              <a href='#' type='button' className='buttonAddPokemon' onClick={this.handleOpenDialog}>
                <span>+</span>
              </a>
          </div>
        </div>
        <div className='layout-footer-background'></div>

        {/* Dialog */}
        <Dialog 
          sx={{ backdropFilter: 'blur(1px)', backgroundColor: '#000000a3' }}
          maxWidth="md"
          fullWidth
          open={this.state.openDialog} 
          onClose={this.handleCloseDialog}
        >
          <DialogTitle>
            <Paper 
              component="form"
              sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 'full', border: '1px solid #e6e6e6' }}>
              <InputBase 
                sx={{ ml: 1, flex: 1 }}
                placeholder='Find Pokemon'
                inputProps={{ 'aria-label': 'find pokemon' }}
                value={searchNameQuery}
                onChange={this.handleSearchNameQueryChange}
              />
              <img
                src={search}
                alt='icon search'
                style={{ maxWidth: '5%', height: 'auto' }}
              />
            </Paper>
          </DialogTitle>
          <DialogContent sx={{ boxShadow: '3px 4px 8px #474444' }}>
            <div className="layout-body-dialog">
              {this.renderDialogBoxes(newDataList, selectCards)}             
            </div>
          </DialogContent>
        </Dialog>


      </div>
    )
  }
}

export default App
