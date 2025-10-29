const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    // Corrigido: tenta várias fontes de imagem em ordem de prioridade
    pokemon.photo =
        pokeDetail.sprites.other?.dream_world?.front_default ||
        pokeDetail.sprites.other?.['official-artwork']?.front_default ||
        pokeDetail.sprites.front_default ||
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png' // fallback padrão

    // Extra (pra preencher os dados da direita da pokédex)
    pokemon.height = pokeDetail.height / 10 // metros
    pokemon.weight = pokeDetail.weight / 10 // kg
    pokemon.xp = pokeDetail.base_experience || 0

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}
