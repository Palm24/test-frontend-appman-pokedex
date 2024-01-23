import React, { Component } from 'react'
import './App.css'

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';

import Box from '@mui/system/Box';
import cute from './cute.png';

import CustomDialog from './Dialog';

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
      searchTypeQuery: '',
    }
  };

  componentDidMount() {
    const { searchNameQuery, searchTypeQuery, selectCards, countNumSelectCard, removeNumSelectCard } = this.state;

    var searchQuery = "";
    if (searchNameQuery !== "") {
      searchQuery = `&name=${searchNameQuery}`;
    } else if (searchTypeQuery !== "") {
      searchQuery = `&type=${searchTypeQuery}`
    }
    
    const url = `http://localhost:3030/api/cards?limit=20${searchQuery}`;
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
    const { newDataList, searchNameQuery, searchTypeQuery } = this.state;

    if (
      previewState.searchNameQuery !== this.state.searchNameQuery 
      || previewState.searchTypeQuery !== this.state.searchTypeQuery
    ) {
      this.componentDidMount();

      const filterResult = newDataList.filter(card => 
        card.name?.toLowerCase().includes(searchNameQuery.toLowerCase()) 
        || card.type?.toLowerCase().includes(searchTypeQuery.toLowerCase())
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

  handleAddPokemon = (pokemon) => {
    const { newDataList } = this.state;

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

  handleSearchQueryFromDialog = (searchDataType, data) => {
    if (searchDataType === "name") {
      this.setState({ searchNameQuery: data });
    } else if (searchDataType === "type") {
      this.setState({ searchTypeQuery: data });
    }
  };

  render() {
    const { newDataList, isParentIndex, selectCards, countNumSelectCard  } = this.state;
    return (
      <div className="App">
        <div className="layout-font">My Pokedex</div>
        {/* body */}
        <div className="layout-body">
          {!countNumSelectCard && (
            <div className='isDisplay-body'>
              Now, you don't have any Card Pokémon in Pokedex!!
            </div>
          )}
          {countNumSelectCard && (
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
                                    <Button
                                      variant='text'
                                      sx={{
                                        padding: '0',
                                        fontFamily: 'Atma',
                                        fontSize: '2.3rem',
                                        color: '#dc7777',
                                        '&:hover': {background: '#d5d6dc', boxShadow: 'none'}
                                      }}
                                      onClick={
                                        () => this.handleRemovePokemon(isParentIndex !== null ? isParentIndex : index, pokemon)
                                      }
                                    >
                                      X
                                    </Button>
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
        
        {/* Footer */}
        <div className='layout-footer'>
          <div className='layout-btnAdd'>
              <Button
                variant='text'
                sx={{
                  width: '100px',
                  height: '100px',
                  backgroundColor: '#ec5656',
                  borderRadius: '50%',
                  color: '#ffffff',
                  padding: '0',
                  fontFamily: 'Atma',
                  fontSize: '65px',
                  '&:hover': {
                    background: '#ec5656', boxShadow: 'none'
                  }
                }}
                onClick={this.handleOpenDialog}
              >
                +
              </Button>
          </div>
        </div>
        <div className='layout-footer-background'></div>

        {/* Dialog Card */}
        {this.state.openDialog && 
          <CustomDialog 
            dataList={newDataList} 
            open={this.state.openDialog}
            onClose={this.handleCloseDialog} 
            onDataReceived={this.handleSearchQueryFromDialog}
            onDataReceivedPokemon={this.handleAddPokemon}
          /> 
        }

      </div>
    )
  }
}

export default App
