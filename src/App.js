import React, { useState, useEffect } from 'react'
import './App.css'

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
// import Button from '@mui/material/Button';

import Box from '@mui/system/Box';
import cute from './cute.png';

import DialogAddCard from './Dialog2';

const App2 = () => {
    const [stateNewDataList, setStateNewDataList] = useState([]);
    const [stateOpenDialog, setStateOpenDialog] = useState(false);
    const [stateSelectCard, setStateSelectCard] = useState({
        selectCards: [],
        countNumSelectCard: false,
    });
    const [stateRemoveCard, setStateRemoveCard] = useState({
        removeCards: [],
        removeNumSelectCard: false,
    });
    const [stateBtn, setStateBtn] = useState({
        isDisplayRemoveBtn: null,
        isParentIndex: null
    });
    const [stateSearch, setStateSearch] = useState({
        searchNameQuery: '',
        searchTypeQuery: '',
    });

    useEffect(() => {
        fetchDataArray();
    }, [stateSearch.searchNameQuery, stateSearch.searchTypeQuery]);

    const fetchDataArray = async () => {
        var searchQuery = "";
        if (stateSearch.searchNameQuery !== "") {
            searchQuery = `&name=${stateSearch.searchNameQuery}`;
        } else if (stateSearch.searchTypeQuery !== "") {
            searchQuery = `&type=${stateSearch.searchTypeQuery}`
        } else {
            searchQuery = "";
        }
        const url = `http://localhost:3030/api/cards?limit=20${searchQuery}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            const newDataList = data.cards.map(card => ({
                id: card.id,
                name: card.name.toUpperCase(),
                cardImageUrl: card.imageUrl,
                hp: card.hp ? calculateHp(card.hp) : "0",
                strength: card.attacks ? 
                          calculateStrength(card.attacks.length).toString() + '%' :
                          0,
                weakness: card.weaknesses ?
                          calculateWeakness(card.weaknesses.length).toString() + '%' :
                          0,
                damage: card.attacks ? 
                        calculateDamage(card.attacks.map(attack => attack.damage)) :
                        '',
                happiness: card.hp && card.attacks && card.weaknesses ?
                           calculateHappiness(
                            card.hp ? calculateHp(card.hp) : 0,
                            calculateDamage(card.attacks.map(attack => attack.damage)),
                            filterValueWeakness(card.weaknesses.map(weak => weak.value))
                           ) : 0,
            }));

            if (stateSelectCard.countNumSelectCard) {
                const isDuplicate = newDataList.some(
                    (card) => card.id !== stateSelectCard.selectCards.map(s => s.id)
                );

                if (isDuplicate) {
                    const updateNewDataList = newDataList.filter(
                        (card) => !stateSelectCard.selectCards.some(card2 => card.id === card2.id && card.name === card2.name)
                    );
                    setStateNewDataList(updateNewDataList);
                }
            } 
            else if (stateRemoveCard.removeNumSelectCard) {
                const updateNewDataList = newDataList.filter(
                    (card) => stateSelectCard.selectCards.some(card2 => card.id === card2.id && card.name === card2.name)
                );
                setStateNewDataList(updateNewDataList);
            } 
            else {
                setStateNewDataList(newDataList);
            }

        } 
        catch (error) {
            console.error('There was a problem fetching the data ', error)
            return [];
        }
    };

    const calculateHp = (hp) => {
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

    const calculateStrength = (atkLength) => {
        var response = 0;
        if ((atkLength * 50) > 100) {
            response = 100;
        } else {
            response = (atkLength * 50);
        }
        return response;
    };

    const calculateWeakness = (weakLength) => {
        var response = 0;
        if ((weakLength * 100) > 100) {
            response = 100;
        } else {
            response = (weakLength * 100);
        }
        return response;
    };

    const filterValueWeakness = (weaknessValue) => {
        var response = 0;
        response = parseInt(weaknessValue.toString().replace(/[^\d.-]/g, ''));
        return response;
    };

    const calculateDamage = (damages) => {
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

    const calculateHappiness = (hp, damage, weakness) => {
        var total = ((parseInt(hp) / 10) + (damage / 10) + 10 - (weakness)) / 5;
        var totalNumber = Math.floor(total);
        return totalNumber;
    };

    const handleOpenDialog = () => {
        setStateOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setStateOpenDialog(false);
    };

    const handleAddPokemon = (pokemon) => {
        const isDuplicate = stateNewDataList.some(
            (card) => card.id === pokemon.id
        );

        if (isDuplicate) {
            // filter นำ Card ที่ถูก ADD ไปแล้วออกจาก Dialog
            const updateNewDataList = stateNewDataList.filter(
                (card) => card.id !== pokemon.id
            );
            setStateNewDataList(updateNewDataList);
            setStateSelectCard(prevSelectCard => ({
                selectCards: [...prevSelectCard.selectCards, pokemon],
                countNumSelectCard: true
            }));
        }
    };

    const onOverDisplayRemoveBtn = (index) => {
        setStateBtn(prevBtn => ({
            ...prevBtn,
            isDisplayRemoveBtn: index
        }));
    };

    const onOutDisplayRemoveBtn = () => {
        setStateBtn(prevBtn => ({
            ...prevBtn,
            isDisplayRemoveBtn: null
        }));
    }

    const handleRemovePokemon = (index, pokemon) => {
        // remove pokemon ออกจาก My Pokedex
        const removeData = stateSelectCard.selectCards.filter(
            (card) => card.id === pokemon.id
        );

        // update new data 
        const updateNewDataList = stateSelectCard.selectCards.filter(
            (card) => card.id !== pokemon.id
        );

        setStateSelectCard(prevSelect => ({
            countNumSelectCard: true,
            selectCards: updateNewDataList
        }));
        setStateRemoveCard(prevRemove => ({
            removeCards: [...prevRemove.removeCards, removeData],
            removeNumSelectCard: true
        }));
    };

    const handleSearchQueryFromDialog = (searchDataType, data) => {
        if (data) {
            if (searchDataType === "name") {
                setStateSearch(prevSearch => ({
                    ...prevSearch,
                    searchNameQuery: data,
                    searchTypeQuery: ''
                }));
            } else if (searchDataType === "type") {
                setStateSearch(prevSearch => ({
                    ...prevSearch,
                    searchNameQuery: '',
                    searchTypeQuery: data
                }));
            }
        } else {
            setStateSearch(prevSearch => ({
                ...prevSearch,
                searchNameQuery: data,
                searchTypeQuery: data
            }));
        }
    };

    return (
        <div className="App">
            <div className="layout-font">My Pokedex</div>
            {/* body */}
            <div className="layout-body">
                {/* not have data */}
                {stateSelectCard.selectCards.length === 0 && (
                    <div className='isDisplay-body'>
                        Now, you don't have any Card Pokémon in Pokedex!!
                    </div>
                )}          
                {/* have data */}
                {stateSelectCard.countNumSelectCard && (
                    <div>
                        <Grid container spacing={2} sx={{ padding: '0.5rem' }}>
                            {stateSelectCard.selectCards.map((pokemon, index) => (
                                <Grid key={index} item xs={6}>
                                    <Box 
                                        key={index}
                                        onMouseEnter={() => onOverDisplayRemoveBtn(stateBtn.isParentIndex !== null ? stateBtn.isDisplayRemoveBtn : index)}
                                        onMouseLeave={onOutDisplayRemoveBtn}
                                    >
                                        <div className='cardBox'>
                                            <Card sx={{ backgroundColor: '#d5d6dc' }}>
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
                                                            <Grid container>
                                                                <Grid item xs={10}>
                                                                    <div style={{ display: 'flex' ,justifyContent: 'flex-start' }}>
                                                                        <div className='font-size-name'>{pokemon.name}</div>
                                                                    </div>
                                                                </Grid>
                                                                <Grid item xs={2}>
                                                                    { stateBtn.isDisplayRemoveBtn === (stateBtn.isParentIndex !== null ? stateBtn.isParentIndex : index) && (
                                                                    <div style={{ display: 'flex' ,justifyContent: 'flex-end', padding: '0' }}>
                                                                        <button
                                                                            type="button"
                                                                            className="buttonRemovePokemon"
                                                                            onClick={
                                                                                () => handleRemovePokemon(stateBtn.isParentIndex !== null ? stateBtn.isParentIndex : index, pokemon)
                                                                            }
                                                                        >
                                                                        X
                                                                        </button>
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
                    {/* <Button
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
                        '&:hover': {background: '#ec5656', boxShadow: 'none'}
                        }}
                        onClick={this.handleOpenDialog}
                    >
                        +
                    </Button> */}
                    <button
                        type="button"
                        className="buttonAddPokemon"
                        onClick={handleOpenDialog}
                    >
                        +
                    </button>
                </div>
            </div>
            <div className='layout-footer-background'></div>

            {/* Dialog Card */}
            {stateOpenDialog && 
            <DialogAddCard 
                dataList={stateNewDataList}
                open={stateOpenDialog} 
                onClose={handleCloseDialog}  
                onDataReceived={handleSearchQueryFromDialog}
                onDataReceivedPokemon={handleAddPokemon}
            />
            }

        </div>
    );
};

export default App2;