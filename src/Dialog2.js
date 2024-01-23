import React, { useState } from 'react';
import './Dialog.css'
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import Box from '@mui/system/Box';
import search from './search.png';
import cute from './cute.png';

const searchQueryType = [
    {
        id: 1,
        queryType: "Name"
    },
    {
        id: 2,
        queryType: "Type"
    },
]

// const DialogAddCard = (props) => {
const DialogAddCard = ({ dataList, open, onClose, onDataReceived, onDataReceivedPokemon }) => {
    const [stateSearchBy, setStateSearchBy] = useState('name');
    const [stateSearchData, setStateSearchData] = useState('');

    const [stateBtn, setStateBtn] = useState({
        isDisplayAddBtn: null,
        isParentIndex: null
    });

    const handleSearchChange = (e) => {
        setStateSearchData('');
        setStateSearchBy(e.target.value);
    };
    
    const handleSearchDataQuery = (e) => {
        setStateSearchData(e.target.value);
        onDataReceived(stateSearchBy, e.target.value);
    };

    const onOverToDisplayAddBtn = (index) => {
        setStateBtn(prevBtn => ({
            ...prevBtn,
            isDisplayAddBtn: index
        }));
    };

    const onOutToDisplayAddBtn = () => {
        setStateBtn(prevBtn => ({
            ...prevBtn,
            isDisplayAddBtn: null
        }));
    };

    const handleAddPokemon = (index, pokemon) => {
        onDataReceivedPokemon(pokemon);
    };

    return (
        <Dialog
            sx={{ backdropFilter: 'blur(1px)', backgroundColor: '#000000a3' }}
            maxWidth="md"
            fullWidth
            open={open}
            onClose={onClose}
        >
            <DialogTitle>
                <Paper
                    component="form"
                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 'full', border: '1px solid #e6e6e6', marginBottom: '5px' }}
                >
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 80 }}>
                        <Select
                            labelId="simple-select-label"
                            id="simple-select-search"
                            value={stateSearchBy}
                            label={stateSearchBy}
                            onChange={handleSearchChange}
                        >
                            {searchQueryType.map((item) => (
                                <MenuItem 
                                    key={item.id} 
                                    value={item.queryType.toLowerCase()}
                                >
                                    {item.queryType}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <InputBase 
                        sx={{ ml: 1, flex: 1, fontFamily: 'Atma', fontSize: '1.5rem' }}
                        placeholder='Find Pokemon'
                        inputProps={{ 'aria-label': 'find pokemon' }}
                        value={stateSearchData}
                        onChange={handleSearchDataQuery}
                    />
                    <img
                        src={search}
                        alt='icon search'
                        style={{ maxWidth: '5%', height: 'auto' }}
                    />
                </Paper>
                <></>
            </DialogTitle>        
            <DialogContent>
                <div className="layout-body-dialog">
                    {dataList && dataList.map((pokemon, index) => (
                        <Box
                            key={index}
                            onMouseEnter={() => onOverToDisplayAddBtn(stateBtn.isParentIndex !== null ? stateBtn.isParentIndex : index)}
                            onMouseLeave={onOutToDisplayAddBtn}
                        >
                            <div className="cardBox-dialog">
                                <Card sx={{ backgroundColor: '#d5d6dc' }}>
                                    <Grid container spacing={2} sx={{ padding: '0.5rem' }}>
                                        <Grid item xs={3}>
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={pokemon.cardImageUrl}
                                                title={pokemon.name}
                                                sx={{ width: '200px', height:'280px' }}
                                            />
                                        </Grid>
                                        <Grid item xs={9}>
                                            <Box display="flex">
                                                <Box flex="1" sx={{ marginLeft: '1rem' }}>
                                                    <div style={{ display: 'flex',justifyContent: 'flex-start' }}>
                                                        <div className="dialog-font-size-name">
                                                            {pokemon.name}
                                                        </div>
                                                    </div>
                                                </Box>
                                                {stateBtn.isDisplayAddBtn === (stateBtn.isParentIndex !== null ? stateBtn.isParentIndex : index) && (
                                                    <Box flex="1">
                                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                            {/* <Button 
                                                                variant="text" 
                                                                sx={{ 
                                                                    fontFamily: 'Atma', 
                                                                    fontSize: '2.5rem', 
                                                                    color: '#dc7777',
                                                                    padding: '0',
                                                                    '&:hover': {background: 'initial', boxShadow: 'none'}
                                                                }}
                                                                onClick={
                                                                    () => this.handleAddPokemon(stateBtn.isParentIndex !== null ? stateBtn.isParentIndex : index,pokemon)
                                                                }>
                                                                Add
                                                            </Button> */}
                                                            <button 
                                                                type="button" 
                                                                className='btnDialogAdd' 
                                                                onClick={
                                                                    () => handleAddPokemon(stateBtn.isParentIndex !== null ? stateBtn.isParentIndex : index,pokemon)
                                                                }
                                                            >
                                                                Add
                                                            </button>
                                                        </div>
                                                    </Box>
                                                )}
                                            </Box>
                                            <Box sx={{ padding: '1rem', paddingTop: '0' }}>
                                                <div className='dialog-font-size-detail'>
                                                    <Grid container>
                                                        <Grid item xs={2} sm={2}>
                                                        HP
                                                        </Grid>
                                                        <Grid item xs={10} sm={10} sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Box sx={{ width: '70%', height: '25px', backgroundColor: '#e4e4e4', borderRadius: '20px', boxShadow: '3px 4px 8px #d4d4d4' }}>
                                                                <Box width={`${pokemon.hp}%`} sx={{ height: '25px', backgroundColor: '#f3701a', borderRadius: '20px' }}></Box>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                                <div className='dialog-font-size-detail'>
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
                                                <div className='dialog-font-size-detail'>
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
                                                <div className='dialog-font-size-detail'>
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
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
};

export default DialogAddCard;